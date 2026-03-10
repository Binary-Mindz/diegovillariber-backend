import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateSplitScreenBattleDto } from './dto/create-split-screen-battle.dto';
import { UpdateSplitScreenBattleDto } from './dto/update-split-screen-battle.dto';
import { SplitScreenQueryDto } from './dto/split-screen-query.dto';
import { InviteSplitScreenDto } from './dto/invite-split-screen.dto';
import { RespondSplitScreenInvitationDto } from './dto/respond-split-screen-invitation.dto';
import { SubmitSplitScreenDto } from './dto/submit-split-screen.dto';
import { VoteSplitScreenDto } from './dto/vote-split-screen.dto';
import { CreateSplitScreenCommentDto } from './dto/comment-split-screen.dto';

import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BattleAccessType,
  Prisma,
  PrismaClient,
  SplitScreenBattleStatus,
  SplitScreenInvitationStatus,
  SplitScreenPreferenceMode,
  SplitScreenSubmissionStatus,
  SplitScreenResultType,
} from 'generated/prisma/client';

type Tx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable()
export class SplitScreenService {
  constructor(private readonly prisma: PrismaService) {}

  private battleInclude = {
    creator: {
      select: {
        id: true,
        email: true,
        totalPoints: true,
      },
    },
    winner: {
      select: {
        id: true,
        email: true,
        totalPoints: true,
      },
    },
    participants: {
      include: {
        user: {
          select: {
            id: true,
            email: true,
            totalPoints: true,
          },
        },
        submission: {
          include: {
            votes: true,
          },
        },
      },
      orderBy: {
        lane: 'asc' as const,
      },
    },
    invitations: true,
    comments: {
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' as const },
      take: 20,
    },
    _count: {
      select: {
        votes: true,
        comments: true,
        participants: true,
      },
    },
  };

  private mapTabToStatus(tab?: string): Prisma.SplitScreenBattleWhereInput {
    if (!tab) return {};

    switch (tab.toLowerCase()) {
      case 'active':
        return {
          status: {
            in: [
              SplitScreenBattleStatus.OPEN,
              SplitScreenBattleStatus.LIVE,
              SplitScreenBattleStatus.VOTING,
            ],
          },
        };
      case 'upcoming':
        return {
          startsAt: { gt: new Date() },
          status: { in: [SplitScreenBattleStatus.OPEN] },
        };
      case 'finished':
        return {
          status: {
            in: [
              SplitScreenBattleStatus.COMPLETED,
              SplitScreenBattleStatus.CANCELLED,
            ],
          },
        };
      default:
        return {};
    }
  }

  private async ensureUserExists(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private validateCreateDto(dto: CreateSplitScreenBattleDto) {
    if (
      dto.preferenceMode === SplitScreenPreferenceMode.SPECIFIC_BRAND &&
      !dto.preferredBrand
    ) {
      throw new BadRequestException(
        'preferredBrand is required for SPECIFIC_BRAND mode',
      );
    }

    if (
      dto.preferenceMode === SplitScreenPreferenceMode.SIMILAR_PRESTIGE &&
      !dto.similarPrestigeRange
    ) {
      throw new BadRequestException(
        'similarPrestigeRange is required for SIMILAR_PRESTIGE mode',
      );
    }
  }

  private checkPreferenceMatch(
    battle: {
      preferenceMode: SplitScreenPreferenceMode;
      preferredBrand?: string | null;
      similarPrestigeRange?: number | null;
    },
    candidate: {
      carBrand?: string | null;
      carModel?: string | null;
      prestigePoints?: number | null;
    },
    creator: {
      carBrand?: string | null;
      carModel?: string | null;
      prestigePoints?: number | null;
    },
  ) {
    switch (battle.preferenceMode) {
      case SplitScreenPreferenceMode.ANY_CAR_BRAND:
        return true;

      case SplitScreenPreferenceMode.SAME_BRAND_ONLY:
        return (
          !!creator.carBrand &&
          !!candidate.carBrand &&
          creator.carBrand === candidate.carBrand
        );

      case SplitScreenPreferenceMode.SAME_MODEL_ONLY:
        return (
          !!creator.carModel &&
          !!candidate.carModel &&
          creator.carModel === candidate.carModel
        );

      case SplitScreenPreferenceMode.SPECIFIC_BRAND:
        return (
          !!candidate.carBrand && candidate.carBrand === battle.preferredBrand
        );

      case SplitScreenPreferenceMode.SIMILAR_PRESTIGE:
        if (
          creator.prestigePoints == null ||
          candidate.prestigePoints == null
        ) {
          return false;
        }

        return (
          Math.abs(creator.prestigePoints - candidate.prestigePoints) <=
          (battle.similarPrestigeRange ?? 0)
        );

      default:
        return true;
    }
  }

  async listBattles(query: SplitScreenQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.SplitScreenBattleWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...this.mapTabToStatus(query.tab),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              {
                participants: {
                  some: {
                    OR: [
                      {
                        carBrand: {
                          contains: query.search,
                          mode: 'insensitive',
                        },
                      },
                      {
                        carModel: {
                          contains: query.search,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.splitScreenBattle.findMany({
        where,
        include: this.battleInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.splitScreenBattle.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBattle(id: string) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id },
      include: this.battleInclude,
    });

    if (!battle) {
      throw new NotFoundException('SplitScreen battle not found');
    }

    return battle;
  }

  async createBattle(userId: string, dto: CreateSplitScreenBattleDto) {
    await this.ensureUserExists(userId);
    this.validateCreateDto(dto);

    const activeBattle = await this.prisma.splitScreenBattle.findFirst({
      where: {
        creatorId: userId,
        status: {
          in: [
            SplitScreenBattleStatus.OPEN,
            SplitScreenBattleStatus.LIVE,
            SplitScreenBattleStatus.VOTING,
          ],
        },
      },
    });

    if (activeBattle) {
      throw new BadRequestException(
        'You already have an active SplitScreen battle',
      );
    }

    return this.prisma.splitScreenBattle.create({
      data: {
        title: dto.title,
        description: dto.description,
        creatorId: userId,
        category: dto.category,
        matchmakingMode: dto.matchmakingMode ?? 'ANYONE',
        preferenceMode: dto.preferenceMode ?? 'ANY_CAR_BRAND',
        preferredBrand: dto.preferredBrand,
        similarPrestigeRange: dto.similarPrestigeRange,
        accessType: dto.accessType ?? BattleAccessType.OPEN,
        status: SplitScreenBattleStatus.OPEN,
        maxParticipants: 2,
        entryCost: dto.entryCost ?? 0,
        prizePool: dto.entryCost ?? 0,
        winnerPointReward: dto.winnerPointReward ?? 450,
        votingDurationHours: dto.votingDurationHours ?? 24,
        startsAt: dto.startsAt,
        participants: {
          create: {
            userId,
            profileId: dto.profileId,
            lane: 1,
            carBrand: dto.carBrand,
            carModel: dto.carModel,
            carYear: dto.carYear,
            carImageUrl: dto.carImageUrl,
            prestigePoints: dto.prestigePoints ?? 0,
          },
        },
      },
      include: this.battleInclude,
    });
  }

  async updateBattle(
    id: string,
    userId: string,
    dto: UpdateSplitScreenBattleDto,
  ) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id },
      include: { participants: true },
    });

    if (!battle) {
      throw new NotFoundException('SplitScreen battle not found');
    }

    if (battle.creatorId !== userId) {
      throw new ForbiddenException('Only creator can update this battle');
    }

    if (battle.status !== SplitScreenBattleStatus.OPEN) {
      throw new BadRequestException('Only OPEN battles can be updated');
    }

    this.validateCreateDto({
      ...battle,
      ...dto,
    } as any);

    return this.prisma.splitScreenBattle.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        matchmakingMode: dto.matchmakingMode,
        preferenceMode: dto.preferenceMode,
        preferredBrand: dto.preferredBrand,
        similarPrestigeRange: dto.similarPrestigeRange,
        accessType: dto.accessType,
        entryCost: dto.entryCost,
        winnerPointReward: dto.winnerPointReward,
        votingDurationHours: dto.votingDurationHours,
        startsAt: dto.startsAt,
      },
      include: this.battleInclude,
    });
  }

  async deleteBattle(id: string, userId: string) {
    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id },
    });

    if (!battle) {
      throw new NotFoundException('SplitScreen battle not found');
    }

    if (battle.creatorId !== userId) {
      throw new ForbiddenException('Only creator can delete this battle');
    }

    if (battle.status !== SplitScreenBattleStatus.OPEN) {
      throw new BadRequestException('Only OPEN battles can be deleted');
    }

    await this.prisma.splitScreenBattle.delete({ where: { id } });

    return { deleted: true };
  }

  async joinBattle(battleId: string, userId: string) {
    await this.ensureUserExists(userId);

    return this.prisma.$transaction(async (tx: Tx) => {
      const battle = await tx.splitScreenBattle.findUnique({
        where: { id: battleId },
        include: { participants: true },
      });

      if (!battle) {
        throw new NotFoundException('SplitScreen battle not found');
      }

      if (battle.status !== SplitScreenBattleStatus.OPEN) {
        throw new BadRequestException('Battle is not open for joining');
      }

      if (battle.participants.length >= battle.maxParticipants) {
        throw new BadRequestException('Battle is already full');
      }

      if (battle.creatorId === userId) {
        throw new BadRequestException('Creator cannot join own battle again');
      }

      if (
        battle.participants.some(
          (p: { userId: string }) => p.userId === userId,
        )
      ) {
        throw new BadRequestException('You already joined this battle');
      }

      const creatorParticipant = battle.participants.find(
        (p: {
          userId: string;
          carBrand?: string | null;
          carModel?: string | null;
          prestigePoints?: number | null;
        }) => p.userId === battle.creatorId,
      );

      if (!creatorParticipant) {
        throw new BadRequestException('Creator participant not found');
      }

      if (battle.accessType === BattleAccessType.INVITATION_ONLY) {
        const invitation = await tx.splitScreenInvitation.findFirst({
          where: {
            battleId,
            inviteeId: userId,
            status: SplitScreenInvitationStatus.ACCEPTED,
          },
        });

        if (!invitation) {
          throw new ForbiddenException(
            'Invitation only battle requires accepted invitation',
          );
        }
      }

      const candidateActiveProfile = await tx.user.findUnique({
        where: { id: userId },
        select: { activeProfileId: true },
      });

      const profile = candidateActiveProfile?.activeProfileId
        ? await tx.profile.findUnique({
            where: { id: candidateActiveProfile.activeProfileId },
            select: {
              id: true,
              imageUrl: true,
              profileName: true,
            },
          })
        : null;

      const matches = this.checkPreferenceMatch(
        battle,
        {
          carBrand: null,
          carModel: null,
          prestigePoints: null,
        },
        {
          carBrand: creatorParticipant.carBrand,
          carModel: creatorParticipant.carModel,
          prestigePoints: creatorParticipant.prestigePoints,
        },
      );

      if (!matches) {
        throw new BadRequestException(
          'Your car does not match the battle preference rules',
        );
      }

      await tx.splitScreenParticipant.create({
        data: {
          battleId,
          userId,
          profileId: profile?.id,
          lane: 2,
          carBrand: null,
          carModel: null,
          carYear: null,
          carImageUrl: profile?.imageUrl ?? null,
          prestigePoints: 0,
        },
      });

      return tx.splitScreenBattle.update({
        where: { id: battleId },
        data: {
          status: SplitScreenBattleStatus.LIVE,
          startsAt: battle.startsAt ?? new Date(),
        },
        include: this.battleInclude,
      });
    });
  }

  async inviteUser(
    battleId: string,
    inviterId: string,
    dto: InviteSplitScreenDto,
  ) {
    await this.ensureUserExists(inviterId);
    await this.ensureUserExists(dto.inviteeId);

    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id: battleId },
      include: { participants: true },
    });

    if (!battle) {
      throw new NotFoundException('SplitScreen battle not found');
    }

    if (battle.creatorId !== inviterId) {
      throw new ForbiddenException('Only creator can invite users');
    }

    if (battle.status !== SplitScreenBattleStatus.OPEN) {
      throw new BadRequestException('Only OPEN battles can send invitations');
    }

    if (dto.inviteeId === inviterId) {
      throw new BadRequestException('You cannot invite yourself');
    }

    const existingParticipant = battle.participants.find(
      (p: { userId: string }) => p.userId === dto.inviteeId,
    );

    if (existingParticipant) {
      throw new BadRequestException('User is already a participant');
    }

    const existingInvite = await this.prisma.splitScreenInvitation.findFirst({
      where: {
        battleId,
        inviteeId: dto.inviteeId,
        status: SplitScreenInvitationStatus.PENDING,
      },
    });

    if (existingInvite) {
      throw new BadRequestException('Pending invitation already exists');
    }

    return this.prisma.splitScreenInvitation.create({
      data: {
        battleId,
        inviterId,
        inviteeId: dto.inviteeId,
        status: SplitScreenInvitationStatus.PENDING,
        expiresAt: dto.expiresInHours
          ? new Date(Date.now() + dto.expiresInHours * 60 * 60 * 1000)
          : null,
      },
    });
  }

  async respondInvitation(
    invitationId: string,
    userId: string,
    dto: RespondSplitScreenInvitationDto,
  ) {
    return this.prisma.$transaction(async (tx: Tx) => {
      const invitation = await tx.splitScreenInvitation.findUnique({
        where: { id: invitationId },
        include: {
          battle: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!invitation) {
        throw new NotFoundException('Invitation not found');
      }

      if (invitation.inviteeId !== userId) {
        throw new ForbiddenException('Not your invitation');
      }

      if (invitation.status !== SplitScreenInvitationStatus.PENDING) {
        throw new BadRequestException('Invitation already responded');
      }

      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        await tx.splitScreenInvitation.update({
          where: { id: invitationId },
          data: { status: SplitScreenInvitationStatus.EXPIRED },
        });
        throw new BadRequestException('Invitation expired');
      }

      const isAccepted = dto.status === SplitScreenInvitationStatus.ACCEPTED;
      const isDeclined = dto.status === SplitScreenInvitationStatus.DECLINED;

      if (!isAccepted && !isDeclined) {
        throw new BadRequestException('Only ACCEPTED or DECLINED is allowed');
      }

      const updatedInvitation = await tx.splitScreenInvitation.update({
        where: { id: invitationId },
        data: {
          status: dto.status,
          respondedAt: new Date(),
        },
      });

      if (isAccepted) {
        const battle = invitation.battle;

        if (battle.status !== SplitScreenBattleStatus.OPEN) {
          throw new BadRequestException('Battle is not open for joining');
        }

        if (battle.participants.length >= battle.maxParticipants) {
          throw new BadRequestException('Battle is already full');
        }

        if (
          battle.participants.some(
            (p: { userId: string }) => p.userId === userId,
          )
        ) {
          throw new BadRequestException('You already joined this battle');
        }

        const creatorParticipant = battle.participants.find(
          (p: {
            userId: string;
            carBrand?: string | null;
            carModel?: string | null;
            prestigePoints?: number | null;
          }) => p.userId === battle.creatorId,
        );

        if (!creatorParticipant) {
          throw new BadRequestException('Creator participant not found');
        }

        const candidateActiveProfile = await tx.user.findUnique({
          where: { id: userId },
          select: { activeProfileId: true },
        });

        const profile = candidateActiveProfile?.activeProfileId
          ? await tx.profile.findUnique({
              where: { id: candidateActiveProfile.activeProfileId },
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
            })
          : null;

        const matches = this.checkPreferenceMatch(
          battle,
          {
            carBrand: null,
            carModel: null,
            prestigePoints: null,
          },
          {
            carBrand: creatorParticipant.carBrand,
            carModel: creatorParticipant.carModel,
            prestigePoints: creatorParticipant.prestigePoints,
          },
        );

        if (!matches) {
          throw new BadRequestException(
            'Your car does not match the battle preference rules',
          );
        }

        await tx.splitScreenParticipant.create({
          data: {
            battleId: battle.id,
            userId,
            profileId: profile?.id,
            lane: 2,
            carBrand: null,
            carModel: null,
            carYear: null,
            carImageUrl: profile?.imageUrl ?? null,
            prestigePoints: 0,
          },
        });

        await tx.splitScreenBattle.update({
          where: { id: battle.id },
          data: {
            status: SplitScreenBattleStatus.LIVE,
            startsAt: battle.startsAt ?? new Date(),
          },
        });
      }

      return updatedInvitation;
    });
  }

  async submit(battleId: string, userId: string, dto: SubmitSplitScreenDto) {
    return this.prisma.$transaction(async (tx: Tx) => {
      const battle = await tx.splitScreenBattle.findUnique({
        where: { id: battleId },
        include: { participants: true },
      });

      if (!battle) {
        throw new NotFoundException('SplitScreen battle not found');
      }

      if (
        battle.status !== SplitScreenBattleStatus.LIVE &&
        battle.status !== SplitScreenBattleStatus.VOTING
      ) {
        throw new BadRequestException('Battle is not open for submission');
      }

      const participant = battle.participants.find(
        (p: { userId: string }) => p.userId === userId,
      );

      if (!participant) {
        throw new ForbiddenException('You are not a participant of this battle');
      }

      const submission = await tx.splitScreenSubmission.upsert({
        where: { participantId: participant.id },
        update: {
          mediaUrl: dto.mediaUrl,
          thumbnailUrl: dto.thumbnailUrl,
          caption: dto.caption,
        },
        create: {
          battleId,
          participantId: participant.id,
          userId,
          mediaUrl: dto.mediaUrl,
          thumbnailUrl: dto.thumbnailUrl,
          caption: dto.caption,
        },
      });

      await tx.splitScreenParticipant.update({
        where: { id: participant.id },
        data: {
          submissionStatus: SplitScreenSubmissionStatus.SUBMITTED,
        },
      });

      const submissionCount = await tx.splitScreenSubmission.count({
        where: { battleId },
      });

      if (submissionCount === 2) {
        await tx.splitScreenBattle.update({
          where: { id: battleId },
          data: {
            status: SplitScreenBattleStatus.VOTING,
            votingStartsAt: new Date(),
            votingEndsAt: new Date(
              Date.now() + battle.votingDurationHours * 60 * 60 * 1000,
            ),
          },
        });
      }

      return submission;
    });
  }

  async vote(submissionId: string, userId: string, _dto: VoteSplitScreenDto) {
    await this.ensureUserExists(userId);

    return this.prisma.$transaction(async (tx: Tx) => {
      const submission = await tx.splitScreenSubmission.findUnique({
        where: { id: submissionId },
        include: {
          battle: {
            include: {
              participants: true,
            },
          },
        },
      });

      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      const battle = submission.battle;

      if (battle.status !== SplitScreenBattleStatus.VOTING) {
        throw new BadRequestException('Voting is not active for this battle');
      }

      if (battle.votingEndsAt && battle.votingEndsAt < new Date()) {
        throw new BadRequestException('Voting has ended');
      }

      const isParticipant = battle.participants.some(
        (p: { userId: string }) => p.userId === userId,
      );

      if (isParticipant) {
        throw new ForbiddenException(
          'Participants cannot vote in their own battle',
        );
      }

      const existingVote = await tx.splitScreenVote.findUnique({
        where: {
          battleId_userId: {
            battleId: battle.id,
            userId,
          },
        },
      });

      if (existingVote) {
        throw new BadRequestException('You have already voted in this battle');
      }

      const vote = await tx.splitScreenVote.create({
        data: {
          battleId: battle.id,
          submissionId,
          userId,
        },
      });

      await tx.splitScreenParticipant.update({
        where: { id: submission.participantId },
        data: {
          score: {
            increment: 1,
          },
        },
      });

      await tx.splitScreenBattle.update({
        where: { id: battle.id },
        data: {
          totalVotes: {
            increment: 1,
          },
        },
      });

      return vote;
    });
  }

  async createComment(
    battleId: string,
    userId: string,
    dto: CreateSplitScreenCommentDto,
  ) {
    await this.ensureUserExists(userId);

    const battle = await this.prisma.splitScreenBattle.findUnique({
      where: { id: battleId },
    });

    if (!battle) {
      throw new NotFoundException('SplitScreen battle not found');
    }

    if (dto.submissionId) {
      const submission = await this.prisma.splitScreenSubmission.findUnique({
        where: { id: dto.submissionId },
      });

      if (!submission || submission.battleId !== battleId) {
        throw new BadRequestException('Invalid submission for this battle');
      }
    }

    const comment = await this.prisma.splitScreenComment.create({
      data: {
        battleId,
        userId,
        submissionId: dto.submissionId,
        content: dto.content,
      },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });

    await this.prisma.splitScreenBattle.update({
      where: { id: battleId },
      data: {
        totalComments: {
          increment: 1,
        },
      },
    });

    return comment;
  }

  async completeBattle(battleId: string, userId: string) {
    return this.prisma.$transaction(async (tx: Tx) => {
      const battle = await tx.splitScreenBattle.findUnique({
        where: { id: battleId },
        include: {
          participants: {
            include: {
              submission: true,
            },
          },
        },
      });

      if (!battle) {
        throw new NotFoundException('SplitScreen battle not found');
      }

      if (battle.creatorId !== userId) {
        throw new ForbiddenException('Only creator can complete battle');
      }

      if (battle.status === SplitScreenBattleStatus.COMPLETED) {
        throw new BadRequestException('Battle already completed');
      }

      if (
        battle.status !== SplitScreenBattleStatus.VOTING &&
        battle.status !== SplitScreenBattleStatus.LIVE
      ) {
        throw new BadRequestException(
          'Battle cannot be completed in current status',
        );
      }

      if (battle.participants.length < 2) {
        throw new BadRequestException(
          'Battle must have 2 participants before completion',
        );
      }

      const [left, right] = battle.participants.sort(
        (a: { lane: number }, b: { lane: number }) => a.lane - b.lane,
      );

      const leftScore = left.score ?? 0;
      const rightScore = right.score ?? 0;

      let winnerParticipantId: string | null = null;
      let winnerUserId: string | null = null;
      let isDraw = false;

      if (leftScore > rightScore) {
        winnerParticipantId = left.id;
        winnerUserId = left.userId;
      } else if (rightScore > leftScore) {
        winnerParticipantId = right.id;
        winnerUserId = right.userId;
      } else {
        isDraw = true;
      }

      await tx.splitScreenBattle.update({
        where: { id: battleId },
        data: {
          status: SplitScreenBattleStatus.COMPLETED,
          completedAt: new Date(),
          winnerId: winnerUserId,
        },
      });

      if (isDraw) {
        await Promise.all(
          battle.participants.map((participant: { id: string; userId: string }) =>
            tx.splitScreenResult.create({
              data: {
                battleId,
                participantId: participant.id,
                userId: participant.userId,
                resultType: SplitScreenResultType.DRAW,
                earnedPoints: 0,
              },
            }),
          ),
        );

        return tx.splitScreenBattle.findUnique({
          where: { id: battleId },
          include: this.battleInclude,
        });
      }

      if (!winnerParticipantId || !winnerUserId) {
        throw new BadRequestException('Failed to determine winner');
      }

      const loser = battle.participants.find(
        (p: { id: string }) => p.id !== winnerParticipantId,
      );
      const winner = battle.participants.find(
        (p: { id: string }) => p.id === winnerParticipantId,
      );

      if (!winner || !loser) {
        throw new BadRequestException('Participant mapping failed');
      }

      await tx.splitScreenParticipant.update({
        where: { id: winnerParticipantId },
        data: { isWinner: true },
      });

      await tx.user.update({
        where: { id: winnerUserId },
        data: {
          totalPoints: {
            increment: battle.winnerPointReward,
          },
        },
      });

      await tx.userPoint.create({
        data: {
          userId: winnerUserId,
          point: battle.winnerPointReward,
          type: 'EARNED',
          reason: `SplitScreen winner reward for battle ${battleId}`,
          splitScreenBattleId: battleId,
        } as any,
      });

      await tx.splitScreenResult.create({
        data: {
          battleId,
          participantId: winner.id,
          userId: winner.userId,
          resultType: SplitScreenResultType.WIN,
          earnedPoints: battle.winnerPointReward,
        },
      });

      await tx.splitScreenResult.create({
        data: {
          battleId,
          participantId: loser.id,
          userId: loser.userId,
          resultType: SplitScreenResultType.LOSS,
          earnedPoints: 0,
        },
      });

      return tx.splitScreenBattle.findUnique({
        where: { id: battleId },
        include: this.battleInclude,
      });
    });
  }

  async autoCompleteExpiredBattles() {
    const battles = await this.prisma.splitScreenBattle.findMany({
      where: {
        status: SplitScreenBattleStatus.VOTING,
        votingEndsAt: { lte: new Date() },
      },
      select: {
        id: true,
        creatorId: true,
      },
    });

    for (const battle of battles) {
      try {
        await this.completeBattle(battle.id, battle.creatorId);
      } catch (error) {
        console.error(
          `Failed to auto-complete SplitScreen battle ${battle.id}`,
          error,
        );
      }
    }

    return battles.length;
  }

  async expirePendingInvitations() {
    const result = await this.prisma.splitScreenInvitation.updateMany({
      where: {
        status: SplitScreenInvitationStatus.PENDING,
        expiresAt: { lte: new Date() },
      },
      data: {
        status: SplitScreenInvitationStatus.EXPIRED,
      },
    });

    return result.count;
  }
}