// src/head-to-head/head-to-head.service.ts
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';


import { HeadToHeadQueryDto, HeadToHeadTab } from './dto/headtohead-query.dto';
import { CreateHeadToHeadBattleDto } from './dto/create-headtohead-battle.dto';
import { UpdateHeadToHeadBattleDto } from './dto/update-headtohead-battle.dto';
import { InviteHeadToHeadDto } from './dto/invite-headtohead.dto';
import { RespondInvitationDto } from './dto/respond-invitation.dto';
import { SubmitHeadToHeadDto } from './dto/submit-headtohead.dto';
import { VoteHeadToHeadDto } from './dto/vote-headtohead.dto';
import { CreateHeadToHeadCommentDto } from './dto/comment-headtohead.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BattleAccessType, BattleCategory, BattleStatus, CameraRequirement, InvitationStatus, ParticipantStatus, ParticipationScope, Preference, SubmissionStatus } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';
import { NODATA } from 'node:dns';
import { handlePrismaError } from '@/common/utils/error.handler';

@Injectable()
export class HeadToHeadService {
  constructor(private readonly prisma: PrismaService) {}

  private now() {
    return new Date();
  }


private calcDurationDays(startDate: Date, endDate: Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new BadRequestException('Invalid startDate or endDate');
  }

  if (start >= end) {
    throw new BadRequestException('startDate must be before endDate');
  }

  const ms = end.getTime() - start.getTime();
  const days = ms / (1000 * 60 * 60 * 24);
  
  return Math.ceil(days);
}

async listBattles(query: HeadToHeadQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;

  const where: Prisma.HeadToHeadBattleWhereInput = {};
  const tab = query.tab ?? HeadToHeadTab;

  if (tab === HeadToHeadTab.ACTIVE) {
    where.status = BattleStatus.ACTIVE;
  } else if (tab === HeadToHeadTab.UPCOMING) {
    where.status = BattleStatus.UPCOMING;
  } else if (tab === HeadToHeadTab.FINISHED) {
    where.status = BattleStatus.FINISHED;
  }
  // ALL হলে status filter apply হবে না

  if (query.accessType) {
    where.accessType = query.accessType;
  }

  if (query.battleCategory) {
    where.battleCategory = query.battleCategory;
  }

  if (query.preference) {
    where.preference = query.preference;
  }

  if (query.participationScope) {
    where.participationScope = query.participationScope;
  }

  if (query.search?.trim()) {
    const s = query.search.trim();

    where.OR = [
      { title: { contains: s, mode: 'insensitive' } },
      { description: { contains: s, mode: 'insensitive' } },
      { locationName: { contains: s, mode: 'insensitive' } },
      { brandFilter: { contains: s, mode: 'insensitive' } },
      { winPrize: { contains: s, mode: 'insensitive' } },
      {
        creator: {
          email: { contains: s, mode: 'insensitive' },
        },
      },
      {
        creator: {
          profile: {
            some: {
              profileName: { contains: s, mode: 'insensitive' },
            },
          },
        },
      },
    ];
  }

  const orderBy: Prisma.HeadToHeadBattleOrderByWithRelationInput[] =
    tab === HeadToHeadTab.FINISHED
      ? [{ endDate: 'desc' }, { createdAt: 'desc' }]
      : [{ startDate: 'asc' }, { createdAt: 'desc' }];

  const [items, total] = await this.prisma.$transaction([
    this.prisma.headToHeadBattle.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        creator: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
              },
            },
          },
        },
        winnerUser: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            participants: true,
            submissions: true,
            battleComments: true,
            battleVotes: true,
            invitations: true,
          },
        },
      },
    }),
    this.prisma.headToHeadBattle.count({ where }),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async getBattle(id: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, email: true , profile: {
          select: {
            profileName: true, 
            imageUrl: true, 
          }
        }} },
        winnerUser: { select: { id: true, email: true } },
        participants: {
          orderBy: { joinedAt: 'asc' },
          include: { user: { select: { id: true, email: true } } },
        },
        submissions: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: { select: { id: true, email: true } },
            votes: true,
            comments: { include: { user: { select: { id: true, email: true } } } },
            _count: { select: { votes: true, comments: true } },
          },
        },
        invitations: {
          orderBy: { sentAt: 'desc' },
          include: {
            inviter: { select: { id: true, email: true } },
            invitee: { select: { id: true, email: true } },
          },
        },
        battleComments: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { id: true, email: true } } },
          take: 50,
        },
        _count: { select: { participants: true, submissions: true, invitations: true } },
      },
    });

    if (!battle) throw new NotFoundException('Battle not found');
    return battle;
  }

 async createBattle(creatorId: string, dto: CreateHeadToHeadBattleDto) {
  try{
  const user = await this.prisma.user.findFirst({where:{id:creatorId}})
  if(!user){
    throw new NotFoundException("Creator Not Found")
  }
   const durationDays = this.calcDurationDays(dto.startDate, dto.endDate);

  if (dto.startDate >= dto.endDate) throw new BadRequestException('startDate must be before endDate');

  if (dto.accessType === BattleAccessType.AUTO_INVITE) {
    if (!dto.autoInviteScope || !dto.autoInviteCount) {
      throw new BadRequestException('autoInviteScope and autoInviteCount are required when accessType = AUTO_INVITE');
    }
  }
  return this.prisma.headToHeadBattle.create({
    data: {
      creatorId:user.id,
      title: dto.title,
      preference: dto.preference ?? Preference.CAR,
      description: dto.description,
      coverImage: dto.coverImage,
      battleCategory: dto.battleCategory ?? BattleCategory.STYLE_BATTLE,
      brandFilter: dto.brandFilter,
      durationDays,
      winPrize: dto.winPrize,
      uploadImageOrVideo: dto.uploadImageOrVideo,
      cameraRequirement: dto.cameraRequirement ?? CameraRequirement.ANY,
      requireTrueShotVerified: dto.requireTrueShotVerified ?? false,
      rejectEditedPhotos: dto.rejectEditedPhotos ?? false,
      accessType: dto.accessType ?? BattleAccessType.OPEN,
      autoInviteScope: dto.autoInviteScope,
      autoInviteCount: dto.autoInviteCount,
      participationScope: dto.participationScope ?? ParticipationScope.GLOBAL,
      radiusKm: dto.radiusKm,
      locationName: dto.locationName,
      latitude: dto.latitude as any,
      longitude: dto.longitude as any,
      placeId: dto.placeId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      // auto-join creator
      participants: { create: { userId: creatorId, status: ParticipantStatus.JOINED } },
    },
  });
  }catch(error){
    handlePrismaError(error)
  }
}

  async updateBattle(id: string, userId: string, dto: UpdateHeadToHeadBattleDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can update');

  const nextStartDate = dto.startDate ?? battle.startDate;
  const nextEndDate = dto.endDate ?? battle.endDate;
  const dateChanged = dto.startDate !== undefined || dto.endDate !== undefined;
  let nextDurationDays: number | undefined = undefined;

  if (dateChanged) {
    if (nextStartDate >= nextEndDate) {
      throw new BadRequestException('startDate must be before endDate');
    }
    nextDurationDays = this.calcDurationDays(nextStartDate, nextEndDate);
  }

    return this.prisma.headToHeadBattle.update({
    where: { id },
    data: {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.preference !== undefined ? { preference: dto.preference } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),

      ...(dto.battleCategory !== undefined ? { battleCategory: dto.battleCategory } : {}),
      ...(dto.brandFilter !== undefined ? { brandFilter: dto.brandFilter } : {}),
      ...(nextDurationDays !== undefined ? { durationDays: nextDurationDays } : {}),

      ...(dto.winPrize !== undefined ? { winPrize: dto.winPrize } : {}),
      ...(dto.uploadImageOrVideo !== undefined ? { uploadImageOrVideo: dto.uploadImageOrVideo } : {}),

      ...(dto.cameraRequirement !== undefined ? { cameraRequirement: dto.cameraRequirement } : {}),
      ...(dto.requireTrueShotVerified !== undefined ? { requireTrueShotVerified: dto.requireTrueShotVerified } : {}),
      ...(dto.rejectEditedPhotos !== undefined ? { rejectEditedPhotos: dto.rejectEditedPhotos } : {}),

      ...(dto.accessType !== undefined ? { accessType: dto.accessType } : {}),
      ...(dto.autoInviteScope !== undefined ? { autoInviteScope: dto.autoInviteScope } : {}),
      ...(dto.autoInviteCount !== undefined ? { autoInviteCount: dto.autoInviteCount } : {}),

      ...(dto.participationScope !== undefined ? { participationScope: dto.participationScope } : {}),
      ...(dto.radiusKm !== undefined ? { radiusKm: dto.radiusKm } : {}),
      ...(dto.locationName !== undefined ? { locationName: dto.locationName } : {}),
      ...(dto.latitude !== undefined ? { latitude: dto.latitude as any } : {}),
      ...(dto.longitude !== undefined ? { longitude: dto.longitude as any } : {}),
      ...(dto.placeId !== undefined ? { placeId: dto.placeId } : {}),

      ...(dto.startDate !== undefined ? { startDate: dto.startDate } : {}),
      ...(dto.endDate !== undefined ? { endDate: dto.endDate } : {}),
    },
  });
  }

  async deleteBattle(id: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can delete');

    // Hard delete (your schema uses cascade)
    await this.prisma.headToHeadBattle.delete({ where: { id } });
    return true;
  }

  async joinBattle(battleId: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({
      where: { id: battleId },
      include: { invitations: { where: { inviteeId: userId } } },
    });
    if (!battle) throw new NotFoundException('Battle not found');

    // Access rules
    if (battle.accessType === BattleAccessType.INVITATION_ONLY) {
      const inv = battle.invitations?.[0];
      if (!inv || inv.status !== InvitationStatus.ACCEPTED) {
        throw new ForbiddenException('Invitation required (and must be accepted) to join this battle');
      }
    }

    if (battle.accessType === BattleAccessType.FOLLOWERS_ONLY) {
      // NOTE: you can enforce this if your Follow model exists.
      // Throwing for safety so you don’t accidentally expose private battles.
      throw new ForbiddenException('FOLLOWERS_ONLY access requires follower check implementation');
    }

    // OPEN & AUTO_INVITE: allow join
    const participant = await this.prisma.battleParticipant.upsert({
      where: { battleId_userId: { battleId, userId } },
      update: { status: ParticipantStatus.JOINED },
      create: { battleId, userId, status: ParticipantStatus.JOINED },
    });

    return participant;
  }

  async inviteUser(battleId: string, inviterId: string, dto: InviteHeadToHeadDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== inviterId) throw new ForbiddenException('Only creator can invite');

    if (dto.inviteeId === inviterId) throw new BadRequestException('Cannot invite yourself');

    // Upsert invitation: if exists, reset to pending
    return this.prisma.battleInvitation.upsert({
      where: { battleId_inviteeId: { battleId, inviteeId: dto.inviteeId } },
      update: { status: InvitationStatus.PENDING, respondedAt: null },
      create: {
        battleId,
        inviterId,
        inviteeId: dto.inviteeId,
        status: InvitationStatus.PENDING,
      },
    });
  }

  async respondInvitation(invitationId: string, userId: string, dto: RespondInvitationDto) {
    const inv = await this.prisma.battleInvitation.findUnique({ where: { id: invitationId } });
    if (!inv) throw new NotFoundException('Invitation not found');
    if (inv.inviteeId !== userId) throw new ForbiddenException('Only invitee can respond');

    const next = dto.status;

    const updated = await this.prisma.battleInvitation.update({
      where: { id: invitationId },
      data: { status: next, respondedAt: new Date() },
    });

    // if accepted, auto join
    if (next === InvitationStatus.ACCEPTED) {
      await this.prisma.battleParticipant.upsert({
        where: { battleId_userId: { battleId: inv.battleId, userId } },
        update: { status: ParticipantStatus.JOINED },
        create: { battleId: inv.battleId, userId, status: ParticipantStatus.JOINED },
      });
    }

    return updated;
  }

  async submit(battleId: string, userId: string, dto: SubmitHeadToHeadDto) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');

    // must be participant (joined)
    const participant = await this.prisma.battleParticipant.findUnique({
      where: { battleId_userId: { battleId, userId } },
    });
    if (!participant || participant.status !== ParticipantStatus.JOINED) {
      throw new ForbiddenException('You must join the battle before submitting');
    }

    // If battle rejects edited photos, you can still store but mark status later by moderator/AI.
    return this.prisma.battleSubmission.upsert({
      where: { battleId_userId: { battleId, userId } },
      update: {
        mediaUrl: dto.mediaUrl,
        thumbnailUrl: dto.thumbnailUrl,
        caption: dto.caption,
        isTrueShotVerified: dto.isTrueShotVerified ?? false,
        isEditedDetected: dto.isEditedDetected ?? false,
        status: dto.status ?? SubmissionStatus.SUBMITTED,
      },
      create: {
        battleId,
        userId,
        mediaUrl: dto.mediaUrl,
        thumbnailUrl: dto.thumbnailUrl,
        caption: dto.caption,
        isTrueShotVerified: dto.isTrueShotVerified ?? false,
        isEditedDetected: dto.isEditedDetected ?? false,
        status: dto.status ?? SubmissionStatus.SUBMITTED,
      },
    });
  }

  async vote(submissionId: string, userId: string, dto: VoteHeadToHeadDto) {
    const submission = await this.prisma.battleSubmission.findUnique({
      where: { id: submissionId },
      include: { battle: true },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    // Optional: prevent voting on your own submission
    if (submission.userId === userId) throw new BadRequestException('Cannot vote on your own submission');

    // Optional: only allow voting when battle is RUNNING
    if (submission.battle.status !== BattleStatus.ACTIVE) {
      throw new BadRequestException('Voting is allowed only when battle is Active');
    }

    return this.prisma.battleVote.upsert({
      where: { submissionId_userId: { submissionId, userId } },
      update: { value: dto.value ?? 1, battleId: submission.battleId },
      create: { submissionId, userId, battleId: submission.battleId, value: dto.value ?? 1 },
    });
  }

  async createComment(battleId: string, userId: string, dto: CreateHeadToHeadCommentDto) {
    // validate battle exists
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');

    if (dto.submissionId) {
      const sub = await this.prisma.battleSubmission.findUnique({ where: { id: dto.submissionId } });
      if (!sub || sub.battleId !== battleId) throw new BadRequestException('Invalid submissionId for this battle');
    }

    return this.prisma.battleComment.create({
      data: {
        battleId,
        userId,
        submissionId: dto.submissionId ?? null,
        message: dto.message,
      },
    });
  }

  async completeBattle(battleId: string, userId: string) {
    const battle = await this.prisma.headToHeadBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can complete');

    return this.prisma.$transaction(async (tx) => {
      const submissions = await tx.battleSubmission.findMany({
        where: { battleId, status: SubmissionStatus.SUBMITTED },
        include: { _count: { select: { votes: true } } },
        orderBy: [{ createdAt: 'asc' }],
      });

      if (submissions.length === 0) throw new BadRequestException('No submissions found to pick winner');

      // highest votes wins; tie => earliest createdAt wins (already ordered)
      let winner = submissions[0];
      for (const s of submissions) {
        if ((s._count?.votes ?? 0) > (winner._count?.votes ?? 0)) winner = s;
      }

      const updated = await tx.headToHeadBattle.update({
        where: { id: battleId },
        data: {
          status: BattleStatus.FINISHED,
          winnerUserId: winner.userId,
        },
      });

      return { battle: updated, winnerUserId: winner.userId, winnerSubmissionId: winner.id };
    });
  }
}