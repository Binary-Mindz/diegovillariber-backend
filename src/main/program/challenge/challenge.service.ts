import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationService } from '@/main/notification/notification.service';
import { InjectQueue } from '@nestjs/bullmq';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { Prisma } from 'generated/prisma/client';
import {
  ChallengeStatus,
  DeviceType,
  ParticipantStatus,
  ParticipationScope,
  ReactionType,
  SubmissionStatus,
} from 'generated/prisma/enums';
import { ChallengeQueryDto, ChallengeTab } from './dto/challenge-query.dto';
import { CreateChallengeCommentDto } from './dto/comment-challenge.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { JoinChallengeDto } from './dto/join-challenge.dto';
import { ReactChallengeDto } from './dto/react-challenge.dto';
import { SubmitChallengeDto } from './dto/submit-challenge.dto';
import {
  DeviceCategoryFilter,
  TimeRangeFilter,
  TopBrandsQueryDto,
} from './dto/top-brands-query.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { VoteChallengeDto } from './dto/vote-challenge.dto';

@Injectable()
export class ChallengeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
    @InjectQueue('notification') private readonly notificationQueue: Queue,
  ) {}

  private challengeIncludes() {
    return {
      creator: {
        select: {
          id: true,
          email: true,
          profile: {
            select: {
              profileName: true,
              imageUrl: true,
            },
          },
        },
      },
      challengeParticipants: {
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  profileName: true,
                  imageUrl: true,
                },
              },
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
                  profile: {
                    select: {
                      profileName: true,
                      imageUrl: true,
                    },
                  },
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
    if (end <= start)
      throw new BadRequestException('endDate must be greater than startDate');
  }

  private validateScope(dto: Partial<CreateChallengeDto | UpdateChallengeDto>) {
    if (dto.participationScope === ParticipationScope.RADIUS) {
      if (!dto.radiusKm || dto.radiusKm <= 0)
        throw new BadRequestException('radiusKm is required for RADIUS scope');
      if (dto.latitude === undefined || dto.longitude === undefined)
        throw new BadRequestException(
          'latitude & longitude are required for RADIUS scope',
        );
    }
  }

  async listChallenges(query: ChallengeQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const tab = query.tab;

    const andConditions: Prisma.ChallengeWhereInput[] = [];

    if (tab === ChallengeTab.ACTIVE) {
      andConditions.push({ status: ChallengeStatus.ACTIVE });
    } else if (tab === ChallengeTab.UPCOMING) {
      andConditions.push({ status: ChallengeStatus.UPCOMING });
    } else if (tab === ChallengeTab.FINISHED) {
      andConditions.push({ status: ChallengeStatus.FINISHED });
    }

    // exact filters
    if (query.category) andConditions.push({ category: query.category });
    if (query.type) andConditions.push({ type: query.type });
    if (query.preference) andConditions.push({ preference: query.preference });
    if (query.participationScope)
      andConditions.push({ participationScope: query.participationScope });
    if (query.deviceType) andConditions.push({ deviceType: query.deviceType });
    if (query.quickPreset)
      andConditions.push({ quickPreset: query.quickPreset });
    if (query.brand) andConditions.push({ brand: query.brand });

    if (query.enableDeviceRestriction !== undefined) {
      andConditions.push({
        enableDeviceRestriction: query.enableDeviceRestriction === 'true',
      });
    }

    // search
    if (query.search?.trim()) {
      const s = query.search.trim();

      andConditions.push({
        OR: [
          { title: { contains: s, mode: 'insensitive' } },
          { description: { contains: s, mode: 'insensitive' } },
          { locationName: { contains: s, mode: 'insensitive' } },
          { challengePrize: { contains: s, mode: 'insensitive' } },
          { creator: { email: { contains: s, mode: 'insensitive' } } },
          {
            creator: {
              profile: {
                some: {
                  profileName: { contains: s, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.ChallengeWhereInput = andConditions.length
      ? { AND: andConditions }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        // orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
        orderBy: [{ createdAt: 'desc' }],
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              accountStatus: true,
              profile: {
                select: {
                  profileName: true,
                  imageUrl: true,
                  activeType: true,
                },
              },
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
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listAdminCreatedChallenges(query: ChallengeQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const now = new Date();

    const andConditions: Prisma.ChallengeWhereInput[] = [
      {
        creator: {
          role: 'ADMIN',
        },
      },
    ];

    const tab = query.tab;

    // tab filter only if provided
    if (tab === ChallengeTab.ACTIVE) {
      andConditions.push(
        { startDate: { lte: now } },
        { endDate: { gte: now } },
        { status: { not: ChallengeStatus.FINISHED } },
      );
    } else if (tab === ChallengeTab.UPCOMING) {
      andConditions.push(
        { startDate: { gt: now } },
        { status: { not: ChallengeStatus.FINISHED } },
      );
    } else if (tab === ChallengeTab.FINISHED) {
      andConditions.push({
        OR: [{ status: ChallengeStatus.FINISHED }, { endDate: { lt: now } }],
      });
    }

    // exact filters
    if (query.category) {
      andConditions.push({ category: query.category });
    }

    if (query.type) {
      andConditions.push({ type: query.type });
    }

    if (query.preference) {
      andConditions.push({ preference: query.preference });
    }

    if (query.participationScope) {
      andConditions.push({ participationScope: query.participationScope });
    }

    if (query.deviceType) {
      andConditions.push({ deviceType: query.deviceType });
    }

    if (query.quickPreset) {
      andConditions.push({ quickPreset: query.quickPreset });
    }

    if (query.brand) {
      andConditions.push({ brand: query.brand });
    }

    if (query.enableDeviceRestriction !== undefined) {
      andConditions.push({
        enableDeviceRestriction: query.enableDeviceRestriction === 'true',
      });
    }

    // search filter
    if (query.search?.trim()) {
      const s = query.search.trim();

      andConditions.push({
        OR: [
          { title: { contains: s, mode: 'insensitive' } },
          { description: { contains: s, mode: 'insensitive' } },
          { locationName: { contains: s, mode: 'insensitive' } },
          { challengePrize: { contains: s, mode: 'insensitive' } },
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
        ],
      });
    }

    const where: Prisma.ChallengeWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    let orderBy: Prisma.ChallengeOrderByWithRelationInput[] = [];

    if (tab === ChallengeTab.UPCOMING) {
      orderBy = [{ startDate: 'asc' }, { createdAt: 'desc' }];
    } else if (tab === ChallengeTab.ACTIVE) {
      orderBy = [{ endDate: 'asc' }, { createdAt: 'desc' }];
    } else if (tab === ChallengeTab.FINISHED) {
      orderBy = [{ endDate: 'desc' }, { createdAt: 'desc' }];
    } else {
      orderBy = [{ createdAt: 'desc' }];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              accountStatus: true,
              profile: {
                select: {
                  profileName: true,
                  imageUrl: true,
                  activeType: true,
                },
              },
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
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
          OR: [{ id: userId }],
        },
        select: {
          id: true,
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

      const challenge = await this.prisma.challenge.create({
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

          requireTrueShotVerification: dto.requireTrueShotVerification ?? false,
          rejectEditedPhotos: dto.rejectEditedPhotos ?? false,
          maxEntriesPerUser: dto.maxEntriesPerUser ?? 1,
          maxParticipants: dto.maxParticipants,
          status: ChallengeStatus.UPCOMING,
        },
        include: { creator: true },
      });

      await this.notificationQueue.add(
        'new-challenge',
        {
          challengeId: challenge.id,
          title: challenge.title,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );

      return challenge;
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
    if (challenge.creatorId !== userId)
      throw new ForbiddenException('Only creator can update this challenge');

    if (dto.startDate || dto.endDate) {
      const start = dto.startDate
        ? new Date(dto.startDate)
        : new Date(challenge.startDate);
      const end = dto.endDate
        ? new Date(dto.endDate)
        : new Date(challenge.endDate);
      this.validateDates(start, end);
    }

    this.validateScope(dto);

    return this.prisma.challenge.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title } : {}),
        ...(dto.description !== undefined
          ? { description: dto.description }
          : {}),
        ...(dto.type !== undefined ? { type: dto.type } : {}),
        ...(dto.category !== undefined ? { category: dto.category } : {}),
        ...(dto.preference !== undefined ? { preference: dto.preference } : {}),
        ...(dto.coverImage !== undefined ? { coverImage: dto.coverImage } : {}),

        ...(dto.participationScope !== undefined
          ? { participationScope: dto.participationScope }
          : {}),
        ...(dto.radiusKm !== undefined ? { radiusKm: dto.radiusKm } : {}),
        ...(dto.locationName !== undefined
          ? { locationName: dto.locationName }
          : {}),
        ...(dto.latitude !== undefined
          ? { latitude: dto.latitude as any }
          : {}),
        ...(dto.longitude !== undefined
          ? { longitude: dto.longitude as any }
          : {}),

        ...(dto.startDate !== undefined
          ? { startDate: new Date(dto.startDate) }
          : {}),
        ...(dto.endDate !== undefined
          ? { endDate: new Date(dto.endDate) }
          : {}),
        ...(dto.challengePrize !== undefined
          ? { challengePrize: dto.challengePrize }
          : {}),

        ...(dto.enableDeviceRestriction !== undefined
          ? { enableDeviceRestriction: dto.enableDeviceRestriction }
          : {}),
        ...(dto.quickPreset !== undefined
          ? { quickPreset: dto.quickPreset }
          : {}),
        ...(dto.deviceType !== undefined ? { deviceType: dto.deviceType } : {}),
        ...(dto.brand !== undefined ? { brand: dto.brand } : {}),
        ...(dto.requireTrueShotVerification !== undefined
          ? { requireTrueShotVerification: dto.requireTrueShotVerification }
          : {}),
        ...(dto.rejectEditedPhotos !== undefined
          ? { rejectEditedPhotos: dto.rejectEditedPhotos }
          : {}),
        ...(dto.maxEntriesPerUser !== undefined
          ? { maxEntriesPerUser: dto.maxEntriesPerUser }
          : {}),
        ...(dto.maxParticipants !== undefined
          ? { maxParticipants: dto.maxParticipants }
          : {}),
      },
      include: { creator: true },
    });
  }

  async deleteChallenge(id: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== userId)
      throw new ForbiddenException('Only creator can delete this challenge');

    await this.prisma.challenge.delete({ where: { id } });
    return { id, deleted: true };
  }

  async joinChallenge(
    challengeId: string,
    userId: string,
    _dto: JoinChallengeDto,
  ) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (
      challenge.status !== ChallengeStatus.UPCOMING &&
      challenge.status !== ChallengeStatus.ACTIVE
    ) {
      throw new BadRequestException('Challenge is not open to join');
    }

    if (challenge.maxParticipants) {
      const totalParticipants = await this.prisma.challengeParticipant.count({
        where: { challengeId },
      });

      if (totalParticipants >= challenge.maxParticipants) {
        throw new BadRequestException('Challenge participant limit reached');
      }
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
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    return this.prisma.challengeSubmission.findMany({
      where: { challengeId },
      include: {
        media: true,
        participant: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                activeRole: true,
                totalPoints: true,
                balance: true,
                likeCount: true,
                commentCount: true,
                shareCount: true,
                totalVote: true,
                activeProfileId: true,
                profile: {
                  select: {
                    id: true,
                    profileName: true,
                    imageUrl: true,
                    bio: true,
                    activeType: true,
                  },
                },
              },
            },
          },
        },
        votes: true,
        reactions: true,
        comments: { include: { replies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async submit(challengeId: string, userId: string, dto: SubmitChallengeDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    const now = new Date();
    if (
      challenge.status !== ChallengeStatus.UPCOMING &&
      challenge.status !== ChallengeStatus.ACTIVE
    ) {
      throw new BadRequestException('Challenge is not accepting submissions');
    }
    if (now < challenge.startDate)
      throw new BadRequestException('Challenge not started yet');
    if (now > challenge.endDate)
      throw new BadRequestException('Challenge already ended');

    const participant = await this.prisma.challengeParticipant.findUnique({
      where: { challengeId_userId: { challengeId, userId } },
    });
    if (!participant)
      throw new ForbiddenException('You must join the challenge first');

    const count = await this.prisma.challengeSubmission.count({
      where: { challengeId, participantId: participant.id },
    });
    if (count >= challenge.maxEntriesPerUser)
      throw new BadRequestException('Max entries reached for this challenge');

    if (!dto.media?.length)
      throw new BadRequestException('At least one media item is required');

    const hashtagIds = dto.hashtagIds
      ? Array.from(new Set(dto.hashtagIds))
      : [];

    return this.prisma.$transaction(async (tx) => {
      let hashtagStrings: string[] = [];

      if (hashtagIds.length > 0) {
        const foundHashtags = await tx.hashtag.findMany({
          where: { id: { in: hashtagIds }, isActive: true },
          select: { id: true, tag: true },
        });

        if (foundHashtags.length !== hashtagIds.length) {
          throw new BadRequestException(
            'One or more hashtags are invalid or inactive.',
          );
        }

        hashtagStrings = foundHashtags.map((h) => h.tag);
      }

      const submission = await tx.challengeSubmission.create({
        data: {
          challengeId,
          participantId: participant.id,
          caption: dto.caption,
          hashtags: hashtagStrings,
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

      if (hashtagIds.length > 0) {
        await tx.hashtag.updateMany({
          where: { id: { in: hashtagIds } },
          data: { usageCount: { increment: 1 } },
        });
      }

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
    if (
      now < submission.challenge.startDate ||
      now > submission.challenge.endDate
    ) {
      throw new BadRequestException(
        'Voting is allowed only during active challenge time',
      );
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

    const submission = await this.prisma.challengeSubmission.findUnique({
      where: { id: submissionId },
    });
    if (!submission) throw new NotFoundException('Submission not found');

    return this.prisma.$transaction(async (tx) => {
      // toggle behavior: if exists -> delete, else create
      const existing = await tx.challengeReaction.findUnique({
        where: { submissionId_userId_type: { submissionId, userId, type } },
      });

      if (existing) {
        await tx.challengeReaction.delete({ where: { id: existing.id } });
      } else {
        await tx.challengeReaction.create({
          data: { submissionId, userId, type },
        });
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

  async createComment(
    challengeId: string,
    userId: string,
    dto: CreateChallengeCommentDto,
  ) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');

    if (dto.submissionId) {
      const sub = await this.prisma.challengeSubmission.findUnique({
        where: { id: dto.submissionId },
      });
      if (!sub || sub.challengeId !== challengeId)
        throw new BadRequestException(
          'Invalid submissionId for this challenge',
        );
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
        const commentCount = await tx.challengeComment.count({
          where: { submissionId: dto.submissionId },
        });
        await tx.challengeSubmission.update({
          where: { id: dto.submissionId },
          data: { commentCount },
        });
      }

      return comment;
    });
  }

  async getComments(challengeId: string, submissionId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new NotFoundException('Challenge not found');
    }

    const comments = await this.prisma.challengeComment.findMany({
      where: {
        submissionId,
      },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                profileName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    const map = new Map();
    const roots: any = [];

    comments.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    comments.forEach((c) => {
      if (c.parentId) {
        const parent = map.get(c.parentId);
        if (parent) {
          parent.replies.push(map.get(c.id));
        }
      } else {
        roots.push(map.get(c.id));
      }
    });

    return roots;
  }

  async getSingleComment(commentId: string) {
    const comment = await this.prisma.challengeComment.findUnique({
      where: { id: commentId },
      include: {
        user: {
          select: {
            id: true,
            profile: {
              select: {
                profileName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // get replies
    const replies = await this.prisma.challengeComment.findMany({
      where: { parentId: commentId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return {
      ...comment,
      replies,
    };
  }

  async completeChallenge(challengeId: string, userId: string) {
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
    });
    if (!challenge) throw new NotFoundException('Challenge not found');
    if (challenge.creatorId !== userId)
      throw new ForbiddenException('Only creator can complete this challenge');

    if (challenge.status === ChallengeStatus.FINISHED) {
      return this.prisma.challengeResult.findUnique({
        where: { challengeId },
        include: { winners: true },
      });
    }

    const transactionResult = await this.prisma.$transaction(async (tx) => {
      // Gather submissions with their votes/score
      const submissions = await tx.challengeSubmission.findMany({
        where: { challengeId },
        orderBy: [
          { score: 'desc' },
          { voteCount: 'desc' },
          { createdAt: 'asc' },
        ],
        include: { participant: true },
      });

      const totalParticipants = await tx.challengeParticipant.count({
        where: { challengeId },
      });
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
        include: {
          winners: {
            include: { participant: true },
          },
        },
      });
    });

    const winnerIds =
      transactionResult?.winners
        .map((w) => w.participant?.userId)
        .filter((id) => !!id) || [];

    if (winnerIds.length > 0) {
      await this.notificationQueue.add(
        'challenge-completed',
        {
          challengeId: challenge.id,
          title: challenge.title,
          winnerIds,
        },
        {
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    return transactionResult;
  }

  async getTopBrands(query: TopBrandsQueryDto) {
    const limit = query.limit ?? 10;
    const andConditions: Prisma.ChallengeWhereInput[] = [];
    console.log('query is: ', query);
    const now = new Date();
    if (query.timeRange === TimeRangeFilter.TODAY) {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      andConditions.push({ createdAt: { gte: startOfDay } });
    } else if (query.timeRange === TimeRangeFilter.WEEK) {
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      andConditions.push({ createdAt: { gte: startOfWeek } });
    } else if (query.timeRange === TimeRangeFilter.MONTH) {
      const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      andConditions.push({ createdAt: { gte: startOfMonth } });
    }

    if (query.deviceCategory === DeviceCategoryFilter.MOBILE) {
      andConditions.push({ deviceType: DeviceType.MOBILE });
    } else if (query.deviceCategory === DeviceCategoryFilter.CAMERA) {
      andConditions.push({
        deviceType: {
          in: [
            DeviceType.DSLR,
            DeviceType.MIRRORLESS,
            DeviceType.ACTION_CAMERA,
            DeviceType.DRONE,
            DeviceType.OTHER,
          ],
        },
      });
    }

    const where: Prisma.ChallengeWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [totalChallenges, brandGroups] = await this.prisma.$transaction([
      this.prisma.challenge.count({ where }),
      this.prisma.challenge.groupBy({
        by: ['brand'],
        where,
        _count: {
          brand: true,
        },
        orderBy: {
          _count: {
            brand: 'desc',
          },
        },
        take: limit,
      }),
    ]);

    if (totalChallenges === 0) {
      return {
        totalChallenges: 0,
        brands: [],
      };
    }

    const brands = brandGroups.map((group) => {
      // ✅ টাইপস্ক্রিপ্ট এরর এড়াতে টাইপ-সেফ চেকিং ও টাইপ কাস্টিং (As Any) অথবা অপশনাল চেইনিং ব্যবহার করা হলো
      const count = (group._count as any)?.brand ?? 0;
      const percentage = parseFloat(
        ((count / totalChallenges) * 100).toFixed(2),
      );

      return {
        brand: group.brand,
        count,
        percentage,
      };
    });

    return {
      totalChallenges,
      brands,
    };
  }
}
