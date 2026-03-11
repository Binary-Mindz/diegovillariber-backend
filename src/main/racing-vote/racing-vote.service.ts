import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateRacingVoteDto, RacingVoteTargetType } from './dto/create-racing-vote.dto';

@Injectable()
export class RacingVoteService {
  private readonly DAILY_LIMIT = 5;
  private readonly DEFAULT_POINT = 5;

  constructor(private readonly prisma: PrismaService) {}

  private getDhakaDayRange(date = new Date()) {
    // Asia/Dhaka = UTC+6, no DST
    const offsetMs = 6 * 60 * 60 * 1000;

    const local = new Date(date.getTime() + offsetMs);

    const startLocal = new Date(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      0,
      0,
      0,
      0,
    );

    const endLocal = new Date(
      local.getFullYear(),
      local.getMonth(),
      local.getDate(),
      23,
      59,
      59,
      999,
    );

    const startUtc = new Date(startLocal.getTime() - offsetMs);
    const endUtc = new Date(endLocal.getTime() - offsetMs);

    return { startUtc, endUtc };
  }

  async createVote(voterId: string, dto: CreateRacingVoteDto) {
    const { startUtc, endUtc } = this.getDhakaDayRange();

    const todayVoteCount = await this.prisma.racingVote.count({
      where: {
        voterId,
        createdAt: {
          gte: startUtc,
          lte: endUtc,
        },
      },
    });

    if (todayVoteCount >= this.DAILY_LIMIT) {
      throw new BadRequestException(
        `You can vote maximum ${this.DAILY_LIMIT} times in a day`,
      );
    }

    if (dto.targetType === RacingVoteTargetType.USER) {
      if (!dto.targetUserId) {
        throw new BadRequestException('targetUserId is required');
      }

      if (dto.targetUserId === voterId) {
        throw new BadRequestException('You cannot vote for yourself');
      }

      const targetUser = await this.prisma.user.findUnique({
        where: { id: dto.targetUserId },
        select: { id: true, totalPoints: true },
      });

      if (!targetUser) {
        throw new NotFoundException('Target user not found');
      }

      const alreadyVotedTodayForSameUser = await this.prisma.racingVote.findFirst({
        where: {
          voterId,
          targetUserId: dto.targetUserId,
          createdAt: {
            gte: startUtc,
            lte: endUtc,
          },
        },
      });

      if (alreadyVotedTodayForSameUser) {
        throw new BadRequestException(
          'You already voted for this user today',
        );
      }

      return this.prisma.$transaction(async (tx) => {
        const vote = await tx.racingVote.create({
          data: {
            voterId,
            targetUserId: dto.targetUserId,
            point: this.DEFAULT_POINT,
          },
          include: {
            voter: { select: { id: true, email: true } },
            targetUser: { select: { id: true, email: true, totalPoints: true } },
          },
        });

        await tx.user.update({
          where: { id: dto.targetUserId },
          data: {
            totalPoints: {
              increment: this.DEFAULT_POINT,
            },
          },
        });

        const remainingVotes = this.DAILY_LIMIT - (todayVoteCount + 1);

        return {
          vote,
          targetType: dto.targetType,
          pointsAdded: this.DEFAULT_POINT,
          remainingVotesToday: remainingVotes,
        };
      });
    }

    if (dto.targetType === RacingVoteTargetType.POST) {
      if (!dto.postId) {
        throw new BadRequestException('postId is required');
      }

      const post = await this.prisma.post.findUnique({
        where: { id: dto.postId },
        select: {
          id: true,
          userId: true,
          point: true,
        },
      });

      if (!post) {
        throw new NotFoundException('Post not found');
      }

      if (post.userId === voterId) {
        throw new BadRequestException('You cannot vote for your own post');
      }

      const alreadyVotedTodayForSamePost = await this.prisma.racingVote.findFirst({
        where: {
          voterId,
          postId: dto.postId,
          createdAt: {
            gte: startUtc,
            lte: endUtc,
          },
        },
      });

      if (alreadyVotedTodayForSamePost) {
        throw new BadRequestException(
          'You already voted for this post today',
        );
      }

      return this.prisma.$transaction(async (tx) => {
        const vote = await tx.racingVote.create({
          data: {
            voterId,
            postId: dto.postId,
            point: this.DEFAULT_POINT,
          },
          include: {
            voter: { select: { id: true, email: true } },
            post: {
              select: {
                id: true,
                userId: true,
                point: true,
              },
            },
          },
        });

        await tx.post.update({
          where: { id: dto.postId },
          data: {
            point: {
              increment: this.DEFAULT_POINT,
            },
          },
        });

        await tx.user.update({
          where: { id: post.userId },
          data: {
            totalPoints: {
              increment: this.DEFAULT_POINT,
            },
          },
        });

        const remainingVotes = this.DAILY_LIMIT - (todayVoteCount + 1);

        return {
          vote,
          targetType: dto.targetType,
          pointsAddedToPost: this.DEFAULT_POINT,
          pointsAddedToPostOwner: this.DEFAULT_POINT,
          remainingVotesToday: remainingVotes,
        };
      });
    }

    throw new BadRequestException('Invalid target type');
  }

  async myTodayVoteSummary(voterId: string) {
    const { startUtc, endUtc } = this.getDhakaDayRange();

    const votes = await this.prisma.racingVote.findMany({
      where: {
        voterId,
        createdAt: {
          gte: startUtc,
          lte: endUtc,
        },
      },
      include: {
        targetUser: {
          select: {
            id: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            userId: true,
            point: true,
            caption: true,
            mediaUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      totalVotesToday: votes.length,
      remainingVotesToday: this.DAILY_LIMIT - votes.length,
      votes,
    };
  }

  async topVotedUsers(query: { limit?: string }) {
  const limit = Number(query?.limit || 10);

  const grouped = await this.prisma.racingVote.groupBy({
    by: ['targetUserId'],
    where: {
      targetUserId: {
        not: null,
      },
    },
    _count: {
      targetUserId: true,
    },
    _sum: {
      point: true,
    },
    orderBy: {
      _count: {
        targetUserId: 'desc',
      },
    },
    take: limit,
  });

  const userIds = grouped
    .map((item) => item.targetUserId)
    .filter((id): id is string => !!id);

  const users = await this.prisma.user.findMany({
    where: {
      id: {
        in: userIds,
      },
    },
    select: {
      id: true,
      email: true,
      phone: true,
      totalPoints: true,
      accountStatus: true,
      profile: {
        select: {
          id: true,
          profileName:true,
          imageUrl: true,
        },
        take: 1,
      },
    },
  });

  const userMap = new Map(users.map((user) => [user.id, user]));

  const leaderboard = grouped.map((item, index) => {
    const user = userMap.get(item.targetUserId!);

    return {
      rank: index + 1,
      user: user ?? null,
      totalVotes: item._count.targetUserId,
      totalVotePoints: item._sum.point ?? 0,
    };
  });

  return {
    total: leaderboard.length,
    leaderboard,
  };
}
}