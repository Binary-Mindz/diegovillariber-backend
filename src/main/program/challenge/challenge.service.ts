import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { ChallengeQueryDto, ChallengeTab } from './dto/challenge-query.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import { VoteChallengeDto } from './dto/vote-challenge.dto';
import { ReactChallengeDto } from './dto/react-challenge.dto';
import { CreateChallengeCommentDto } from './dto/comment-challenge.dto';

import {
  ChallengeStatus,
  ParticipationScope,
  ParticipantStatus,
  ReactionType,
  SubmissionStatus,
} from 'generated/prisma/enums';
import { profile } from 'console';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ChallengeService {
  constructor(private readonly prisma: PrismaService) {}

  private challengeIncludes() {
  return {
    creator: {
      select: {
        id: true,
        email: true
      },
    },
    challengeParticipants: {
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    },
    challengeSubmissions: {
      include: {
        media: true,
        votes: true,
        reactions: true,
        comments: {
          include: {
            replies: true,
          },
        },
        participant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc' as const,
      },
    },
    challengeResults: {
      include: {
        winners: true,
      },
    },
  };
}
  private validateDates(start: Date, end: Date) {
    if (end <= start) throw new BadRequestException('endDate must be greater than startDate');
  }

  private validateScope(dto: Partial<CreateChallengeDto | UpdateChallengeDto>) {
    if (dto.participationScope === ParticipationScope.RADIUS) {
      if (!dto.radiusKm || dto.radiusKm <= 0) throw new BadRequestException('radiusKm is required for RADIUS scope');
      if (dto.latitude === undefined || dto.longitude === undefined)
        throw new BadRequestException('latitude & longitude are required for RADIUS scope');
    }
  }

async listChallenges(query: ChallengeQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const now = new Date();

  const where: any = {};

  // tab filter
  const tab = query.tab ?? ChallengeTab.ACTIVE;

if (tab === ChallengeTab.ACTIVE) {
  where.status = ChallengeStatus.ACTIVE;
} else if (tab === ChallengeTab.UPCOMING) {
  where.status = ChallengeStatus.UPCOMING;
} else if (tab === ChallengeTab.FINISHED) {
  where.status = ChallengeStatus.FINISHED;
}

  // optional filters
  if (query.category) {
    where.category = query.category;
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.preference) {
    where.preference = query.preference;
  }

  if (query.participationScope) {
    where.participationScope = query.participationScope;
  }

  if (query.search) {
    where.OR = [
      ...(where.OR ?? []),
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { locationName: { contains: query.search, mode: 'insensitive' } },
      { challengePrize: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await this.prisma.$transaction([
    this.prisma.challenge.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { startDate: 'asc' },
        { createdAt: 'desc' },
      ],
      include: {
        creator: {
          select: {
            id: true,
            email: true,
          },
        },
        _count: {
          select: {
            challengeParticipants: true,
            challengeSubmissions: true,
          },
        },
      },
    }),
    this.prisma.challenge.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  };
}

async listAdminCreatedChallenges(query: ChallengeQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const now = new Date();

  const where: any = {
    creator: {
      role: 'ADMIN', // <-- তোমার actual enum/value অনুযায়ী change করো
    },
  };

  const tab = query.tab ?? ChallengeTab.ACTIVE;

  if (tab === ChallengeTab.ACTIVE) {
    where.AND = [
      ...(where.AND ?? []),
      { startDate: { lte: now } },
      { endDate: { gte: now } },
      { status: { not: ChallengeStatus.FINISHED } },
    ];
  } else if (tab === ChallengeTab.UPCOMING) {
    where.AND = [
      ...(where.AND ?? []),
      { startDate: { gt: now } },
      { status: { not: ChallengeStatus.FINISHED } },
    ];
  } else if (tab === ChallengeTab.FINISHED) {
    where.OR = [
      { status: ChallengeStatus.FINISHED },
      { endDate: { lt: now } },
    ];
  }

  if (query.category) where.category = query.category;
  if (query.type) where.type = query.type;
  if (query.preference) where.preference = query.preference;
  if (query.participationScope) where.participationScope = query.participationScope;

  if (query.search) {
    where.OR = [
      ...(where.OR ?? []),
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
      { locationName: { contains: query.search, mode: 'insensitive' } },
      { challengePrize: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await this.prisma.$transaction([
    this.prisma.challenge.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        creator: true,
        _count: {
          select: {
            challengeParticipants: true,
            challengeSubmissions: true,
          },
        },
      },
    }),
    this.prisma.challenge.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    items,
  };
}


  async getChallenge(id: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id },
      include: this.challengeIncludes(),
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    return challenge;
  }

async createChallenge(userId: string, dto: CreateChallengeDto) {
  try {
    const creator = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: userId }
        ],
      },
      select: {
        id: true
      },
    });

    if (!creator) {
      throw new NotFoundException('Creator user not found');
    }

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new BadRequestException('Invalid startDate or endDate');
    }

    this.validateDates(startDate, endDate);
    this.validateScope(dto);

    return await this.prisma.challenge.create({
      data: {
        creatorId: creator.id,
        title: dto.title,
        description: dto.description,
        type: dto.type,
        category: dto.category,
        preference: dto.preference,
        coverImage: dto.coverImage,

        participationScope:
          dto.participationScope ?? ParticipationScope.GLOBAL,
        radiusKm: dto.radiusKm,
        locationName: dto.locationName,
        latitude: dto.latitude as any,
        longitude: dto.longitude as any,

        startDate,
        endDate,
        challengePrize: dto.challengePrize,

        enableDeviceRestriction: dto.enableDeviceRestriction ?? false,
        quickPreset: dto.quickPreset,
        deviceType: dto.deviceType,
        brand: dto.brand,

        requireTrueShotVerification:
          dto.requireTrueShotVerification ?? false,
        rejectEditedPhotos: dto.rejectEditedPhotos ?? false,
        maxEntriesPerUser: dto.maxEntriesPerUser ?? 1,
        status: ChallengeStatus.UPCOMING,
      },
      include: { creator: true },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Invalid related reference data provided for challenge creation',
        );
      }

      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Duplicate data violates a unique constraint',
        );
      }

      if (error.code === 'P2025') {
        throw new NotFoundException('Required related record was not found');
      }
    }

    throw error;
  }
}

  async updateChallenge(id: string, userId: string, dto: UpdateChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== userId) throw new ForbiddenException('Only creator can update this challenge');

    if (dto.startDate || dto.endDate) {
      const start = dto.startDate ? new Date(dto.startDate) : new Date(challenge.startDate);
      const end = dto.endDate ? new Date(dto.endDate) : new Date(challenge.endDate);
      this.validateDates(start, end);
    }

    this.validateScope(dto);

    return this.prisma.challenge.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.preference !== undefined ? { preference: dto.preference } : {}),
        ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),

        ...(dto.participationScope !== undefined ? { participationScope: dto.participationScope } : {}),
        ...(dto.radiusKm !== undefined ? { radiusKm: dto.radiusKm } : {}),
        ...(dto.locationName !== undefined ? { locationName: dto.locationName } : {}),
        ...(dto.latitude !== undefined ? { latitude: dto.latitude as any } : {}),
        ...(dto.longitude !== undefined ? { longitude: dto.longitude as any } : {}),

        ...(dto.startDate !== undefined ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.endDate !== undefined ? { endDate: new Date(dto.endDate) } : {}),
        ...(dto.challengePrize !== undefined ? { challengePrize: dto.challengePrize } : {}),

        ...(dto.enableDeviceRestriction !== undefined ? { enableDeviceRestriction: dto.enableDeviceRestriction } : {}),
        ...(dto.quickPreset !== undefined ? { quickPreset: dto.quickPreset } : {}),
        ...(dto.deviceType !== undefined ? { deviceType: dto.deviceType } : {}),
        ...(dto.brand !== undefined ? { brand: dto.brand } : {}),
        ...(dto.requireTrueShotVerification !== undefined
          ? { requireTrueShotVerification: dto.requireTrueShotVerification }
          : {}),
        ...(dto.rejectEditedPhotos !== undefined ? { rejectEditedPhotos: dto.rejectEditedPhotos } : {}),
        ...(dto.maxEntriesPerUser !== undefined ? { maxEntriesPerUser: dto.maxEntriesPerUser } : {}),
      },
      include: { creator: true },
    });
  }

  async deleteChallenge(id: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== userId) throw new ForbiddenException('Only creator can delete this challenge');

    await this.prisma.challenge.delete({ where: { id } });
    return { id, deleted: true };
  }

  async joinChallenge(challengeId: string, userId: string, _dto: JoinChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (
       challenge.status !== ChallengeStatus.UPCOMING &&
       challenge.status !== ChallengeStatus.ACTIVE
       ) {
  throw new BadRequestException('Challenge is not open to join');
         }
    try {
      return await this.prisma.challengeParticipant.create({
        data: {
          challengeId,
          userId,
          status: ParticipantStatus.JOINED,
        },
      });
    } catch {
      return this.prisma.challengeParticipant.findUnique({
        where: { challengeId_userId: { challengeId, userId } },
      });
    }
  }

  async listSubmissions(challengeId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');

    return this.prisma.challengeSubmission.findMany({
      where: { challengeId },
      include: {
        media: true,
        participant: { include: { user: true } },
        votes: true,
        reactions: true,
        comments: { include: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submit(challengeId: string, userId: string, dto: SubmitChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const now = new Date();
   if (
  challenge.status !== ChallengeStatus.UPCOMING &&
  challenge.status !== ChallengeStatus.ACTIVE
) {
  throw new BadRequestException('Challenge is not accepting submissions');
}
    if (now < challenge.startDate) throw new BadRequestException('Challenge not started yet');
    if (now > challenge.endDate) throw new BadRequestException('Challenge already ended');

    const participant = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (!participant) throw new ForbiddenException('You must join the challenge first');

    const count = await this.prisma.challengeSubmission.count({
      where: { challengeId, participantId: participant.id },
    });
    if (count >= challenge.maxEntriesPerUser) throw new BadRequestException('Max entries reached for this challenge');

    if (!dto.media?.length) throw new BadRequestException('At least one media item is required');

    return this.prisma.$transaction(async (tx) => {
      const submission = await tx.challengeSubmission.create({
        data: {
          challengeId,
          participantId: participant.id,
          caption: dto.caption,
          hashtags: dto.hashtags ?? [],
          status: SubmissionStatus.PENDING,
          media: {
            create: dto.media.map((m) => ({
              type: m.type,
              url: m.url,
              durationSec: m.durationSec,
              thumbnailUrl: m.thumbnailUrl,
              sortOrder: m.sortOrder ?? 0,
              pairKey: m.pairKey,
            })),
          },
        },
        include: { media: true },
      });

      await tx.challengeParticipant.update({
        where: { id: participant.id },
        data: { submittedAt: new Date() },
      });

      return submission;
    });
  }

 async vote(submissionId: string, userId: string, dto: VoteChallengeDto) {
  const submission = await this.prisma.challengeSubmission.findUnique({
    where: { id: submissionId },
    include: { participant: true, challenge: true },
  });

  if (!submission) {
    throw new NotFoundException('Submission not found');
  }

  if (submission.participant.userId === userId) {
    throw new BadRequestException('You cannot vote on your own submission');
  }

  if (submission.challenge.status !== ChallengeStatus.ACTIVE) {
    throw new BadRequestException('Voting is closed');
  }

  const now = new Date();
  if (now < submission.challenge.startDate || now > submission.challenge.endDate) {
    throw new BadRequestException('Voting is allowed only during active challenge time');
  }

  const weight = dto.weight ?? 1;

  return this.prisma.$transaction(async (tx) => {
    const vote = await tx.challengeVote.upsert({
      where: { submissionId_userId: { submissionId, userId } },
      create: { submissionId, userId, weight },
      update: { weight },
    });

    const agg = await tx.challengeVote.aggregate({
      where: { submissionId },
      _sum: { weight: true },
      _count: { id: true },
    });

    await tx.challengeSubmission.update({
      where: { id: submissionId },
      data: {
        voteCount: agg._count.id,
        score: agg._sum.weight ?? 0,
      },
    });

    return vote;
  });
}

  async react(submissionId: string, userId: string, dto: ReactChallengeDto) {
    const type = dto.type ?? ReactionType.LIKE;

    const submission = await this.prisma.challengeSubmission.findUnique({ where: { id: submissionId } });
    if (!submission) throw new NotFoundException('Submission not found');

    return this.prisma.$transaction(async (tx) => {
      // toggle behavior: if exists -> delete, else create
      const existing = await tx.challengeReaction.findUnique({
        where: { submissionId_userId_type: { submissionId, userId, type } },
      });

      if (existing) {
        await tx.challengeReaction.delete({ where: { id: existing.id } });
      } else {
        await tx.challengeReaction.create({ data: { submissionId, userId, type } });
      }

      const likeCount = await tx.challengeReaction.count({
        where: { submissionId, type: ReactionType.LIKE },
      });

      await tx.challengeSubmission.update({
        where: { id: submissionId },
        data: { likeCount },
      });

      return { submissionId, type, liked: !existing };
    });
  }

  async createComment(challengeId: string, userId: string, dto: CreateChallengeCommentDto) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
    if (!challenge) throw new NotFoundException('Challenge not found');

    if (dto.submissionId) {
      const sub = await this.prisma.challengeSubmission.findUnique({ where: { id: dto.submissionId } });
      if (!sub || sub.challengeId !== challengeId) throw new BadRequestException('Invalid submissionId for this challenge');
    }

    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.challengeComment.create({
        data: {
          submissionId: dto.submissionId!,
          userId,
          parentId: dto.parentId,
          text: dto.text,
        },
      });

      if (dto.submissionId) {
        const commentCount = await tx.challengeComment.count({ where: { submissionId: dto.submissionId } });
        await tx.challengeSubmission.update({ where: { id: dto.submissionId }, data: { commentCount } });
      }

      return comment;
    });
  }

  async completeChallenge(challengeId: string, userId: string) {
  const challenge = await this.prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new NotFoundException('Challenge not found');
  if (challenge.creatorId !== userId) throw new ForbiddenException('Only creator can complete this challenge');

  if (challenge.status === ChallengeStatus.FINISHED) {
    return this.prisma.challengeResult.findUnique({
      where: { challengeId },
      include: { winners: true },
    });
  }

  return this.prisma.$transaction(async (tx) => {
    // Gather submissions with their votes/score
    const submissions = await tx.challengeSubmission.findMany({
      where: { challengeId },
      orderBy: [{ score: 'desc' }, { voteCount: 'desc' }, { createdAt: 'asc' }],
      include: { participant: true },
    });

    const totalParticipants = await tx.challengeParticipant.count({ where: { challengeId } });
    const totalSubmissions = submissions.length;

    const result = await tx.challengeResult.upsert({
      where: { challengeId },
      create: {
        challengeId,
        totalParticipants,
        totalSubmissions,
        completedAt: new Date(),
      },
      update: {
        totalParticipants,
        totalSubmissions,
        completedAt: new Date(),
      },
    });

    // pick top 3 winners (if available)
    const top = submissions.slice(0, 3);
    await tx.challengeWinner.deleteMany({ where: { challengeId } });

    for (let i = 0; i < top.length; i++) {
      const sub = top[i];
      await tx.challengeWinner.create({
        data: {
          resultId: result.id,
          challengeId,
          participantId: sub.participantId,
          submissionId: sub.id,
          position: i + 1,
          finalVotes: sub.voteCount,
          finalScore: sub.score,
        },
      });
    }

    // ✅ Only update status (no winnerUserId column in Challenge model)
    await tx.challenge.update({
      where: { id: challengeId },
      data: {
        status: ChallengeStatus.FINISHED,
      },
    });

    return tx.challengeResult.findUnique({
      where: { challengeId },
      include: { winners: true },
    });
  });
}
}