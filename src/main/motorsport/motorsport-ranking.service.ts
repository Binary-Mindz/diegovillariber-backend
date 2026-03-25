import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BattleStatus,
  RawShiftStatus,
  SplitScreenBattleStatus,
} from 'generated/prisma/enums';
import {
  MotorsportRankingQueryDto,
  MotorsportRankingType,
  RankingDuration,
} from './dto/motorsport-ranking-query.dto';
import { TopRatedPostDto } from './dto/top-rated-post.dto';


type RankingUserMap = {
  userId: string;
  totalVotes?: number;
  prestigePoints?: number;
};

@Injectable()
export class MotorsportRankingService {
  constructor(private readonly prisma: PrismaService) {}

  async getRankings(query: MotorsportRankingQueryDto) {
    const type = query.type || MotorsportRankingType.HEAD2HEAD;

    switch (type) {
      case MotorsportRankingType.HEAD2HEAD:
        return this.getHead2HeadRankings(query);

      case MotorsportRankingType.SPLIT_SCREEN:
        return this.getSplitScreenRankings(query);

      case MotorsportRankingType.RAWSHIFT:
        return this.getRawShiftRankings(query);

      case MotorsportRankingType.PRESTIGE:
        return this.getPrestigeRankings(query);

      default:
        return this.getHead2HeadRankings(query);
    }
  }

  private getDateFilter(duration?: RankingDuration) {
    const now = new Date();

    switch (duration) {
      case RankingDuration.TODAY: {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        return { gte: start };
      }

      case RankingDuration.WEEK: {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        return { gte: start };
      }

      case RankingDuration.MONTH: {
        const start = new Date(now);
        start.setDate(start.getDate() - 30);
        return { gte: start };
      }

      case RankingDuration.ALL:
      default:
        return undefined;
    }
  }

  private buildPagination(page = 1, limit = 10) {
    const safePage = Number(page) || 1;
    const safeLimit = Number(limit) || 10;
    const skip = (safePage - 1) * safeLimit;

    return { page: safePage, limit: safeLimit, skip };
  }

  private async hydrateUsers(
    rankingRows: RankingUserMap[],
    type: MotorsportRankingType,
    page: number,
    limit: number,
  ) {
    const { skip } = this.buildPagination(page, limit);
    const paginatedRows = rankingRows.slice(skip, skip + limit);

    const userIds = paginatedRows.map((x) => x.userId);

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
        likeCount: true,
        commentCount: true,
        shareCount: true,
        profile: {
          select: {
            profileName: true,
            imageUrl: true,
          },
        },
      },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const items = paginatedRows.map((row, index) => {
      const user = userMap.get(row.userId);


      return {
        rank: skip + index + 1,
        userId: row.userId,
        email: user?.email ?? 'Unknown User',
        userName: user?.profile?.[0]?.profileName ?? user?.email,
        avatar: user?.profile?.[0]?.imageUrl ?? null,
        totalVotes:
          type === MotorsportRankingType.PRESTIGE ? undefined : row.totalVotes || 0,
        prestigePoints:
          type === MotorsportRankingType.PRESTIGE
            ? row.prestigePoints || 0
            : undefined,
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total: rankingRows.length,
        totalPages: Math.ceil(rankingRows.length / limit),
      },
    };
  }

  async getHead2HeadRankings(query: MotorsportRankingQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const createdAtFilter = this.getDateFilter(query.duration);

    const submissions = await this.prisma.battleSubmission.findMany({
      where: {
        battle: {
          status: {
            in: [
              BattleStatus.UPCOMING,
              BattleStatus.ACTIVE,
              BattleStatus.FINISHED,
            ],
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!submissions.length) {
      return {
        rankingType: MotorsportRankingType.HEAD2HEAD,
        title: 'Top Head2Head Winner',
        items: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const submissionIds = submissions.map((s) => s.id);

    const votes = await this.prisma.battleVote.findMany({
      where: {
        submissionId: {
          in: submissionIds,
        },
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      select: {
        submissionId: true,
        value: true,
      },
    });

    const submissionToUserMap = new Map(
      submissions.map((submission) => [submission.id, submission.userId]),
    );

    const userVoteMap = new Map<string, number>();

    for (const vote of votes) {
      const userId = submissionToUserMap.get(vote.submissionId);
      if (!userId) continue;

      const current = userVoteMap.get(userId) || 0;
      userVoteMap.set(userId, current + (vote.value || 0));
    }

    const rankingRows = Array.from(userVoteMap.entries())
      .map(([userId, totalVotes]) => ({
        userId,
        totalVotes,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes);

    const hydrated = await this.hydrateUsers(
      rankingRows,
      MotorsportRankingType.HEAD2HEAD,
      page,
      limit,
    );

    return {
      rankingType: MotorsportRankingType.HEAD2HEAD,
      title: 'Top Head2Head Winner',
      ...hydrated,
    };
  }

  async getSplitScreenRankings(query: MotorsportRankingQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const createdAtFilter = this.getDateFilter(query.duration);

    const participants = await this.prisma.splitScreenBattleParticipant.findMany({
      where: {
        battle: {
          status: {
            in: [
              SplitScreenBattleStatus.LIVE,
              SplitScreenBattleStatus.COMPLETED,
            ],
          },
          ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
        },
      },
      select: {
        userId: true,
        votes: true,
      },
    });

    const userVoteMap = new Map<string, number>();

    for (const participant of participants) {
      const current = userVoteMap.get(participant.userId) || 0;
      userVoteMap.set(participant.userId, current + (participant.votes || 0));
    }

    const rankingRows = Array.from(userVoteMap.entries())
      .map(([userId, totalVotes]) => ({
        userId,
        totalVotes,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes);

    const hydrated = await this.hydrateUsers(
      rankingRows,
      MotorsportRankingType.SPLIT_SCREEN,
      page,
      limit,
    );

    return {
      rankingType: MotorsportRankingType.SPLIT_SCREEN,
      title: 'Top Split Screen Winner',
      ...hydrated,
    };
  }

  async getRawShiftRankings(query: MotorsportRankingQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const createdAtFilter = this.getDateFilter(query.duration);

    const entries = await this.prisma.rawShiftEntry.findMany({
      where: {
        battle: {
          status: {
            in: [
              RawShiftStatus.UPCOMING,
              RawShiftStatus.ACTIVE,
              RawShiftStatus.FINISHED,
            ],
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!entries.length) {
      return {
        rankingType: MotorsportRankingType.RAWSHIFT,
        title: 'Top RawShift Winner',
        items: [],
        meta: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const entryIds = entries.map((entry) => entry.id);

    const votes = await this.prisma.rawShiftVote.findMany({
      where: {
        entryId: {
          in: entryIds,
        },
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      select: {
        entryId: true,
        value: true,
      },
    });

    const entryToUserMap = new Map(
      entries.map((entry) => [entry.id, entry.userId]),
    );

    const userVoteMap = new Map<string, number>();

    for (const vote of votes) {
      const userId = entryToUserMap.get(vote.entryId);
      if (!userId) continue;

      const current = userVoteMap.get(userId) || 0;
      userVoteMap.set(userId, current + (vote.value || 0));
    }

    const rankingRows = Array.from(userVoteMap.entries())
      .map(([userId, totalVotes]) => ({
        userId,
        totalVotes,
      }))
      .sort((a, b) => b.totalVotes - a.totalVotes);

    const hydrated = await this.hydrateUsers(
      rankingRows,
      MotorsportRankingType.RAWSHIFT,
      page,
      limit,
    );

    return {
      rankingType: MotorsportRankingType.RAWSHIFT,
      title: 'Top RawShift Winner',
      ...hydrated,
    };
  }

  async getPrestigeRankings(query: MotorsportRankingQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;

    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        totalPoints: true,
      },
    });

    const userIds = users.map((u) => u.id);

    let userPointRows: { userId: string; points: number }[] = [];

    try {
      userPointRows = await this.prisma.userPoint.findMany({
        where: {
          userId: {
            in: userIds,
          },
        },
        select: {
          userId: true,
          points: true,
        },
      });
    } catch {
      userPointRows = [];
    }

    const pointMap = new Map<string, number>();

    for (const row of userPointRows) {
      const current = pointMap.get(row.userId) || 0;
      pointMap.set(row.userId, current + (row.points || 0));
    }

    const rankingRows = users
      .map((user) => ({
        userId: user.id,
        prestigePoints: pointMap.has(user.id)
          ? pointMap.get(user.id) || 0
          : user.totalPoints || 0,
      }))
      .sort((a, b) => b.prestigePoints - a.prestigePoints);

    const hydrated = await this.hydrateUsers(
      rankingRows,
      MotorsportRankingType.PRESTIGE,
      page,
      limit,
    );

    return {
      rankingType: MotorsportRankingType.PRESTIGE,
      title: 'Top Prestige Point',
      ...hydrated,
    };
  }

  async getRankingSummary(query: MotorsportRankingQueryDto) {
    const [head2head, splitScreen, rawshift, prestige] = await Promise.all([
      this.getHead2HeadRankings({
        ...query,
        type: MotorsportRankingType.HEAD2HEAD,
        page: 1,
        limit: 3,
      }),
      this.getSplitScreenRankings({
        ...query,
        type: MotorsportRankingType.SPLIT_SCREEN,
        page: 1,
        limit: 3,
      }),
      this.getRawShiftRankings({
        ...query,
        type: MotorsportRankingType.RAWSHIFT,
        page: 1,
        limit: 3,
      }),
      this.getPrestigeRankings({
        ...query,
        type: MotorsportRankingType.PRESTIGE,
        page: 1,
        limit: 3,
      }),
    ]);

    return {
      head2head,
      splitScreen,
      rawshift,
      prestige,
    };
  }

  async getTopRatedPosts(dto: TopRatedPostDto) {
  const page = dto.page ?? 1;
  const limit = dto.limit ?? 10;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    this.prisma.post.findMany({
      orderBy: [
        { ratingAverage: 'desc' },
        { ratingCount: 'desc' },
      ],
      skip,
      take: limit,
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
    }),

    this.prisma.post.count(),
  ]);

  const items = posts.map((post, index) => ({
    rank: skip + index + 1,
    postId: post.id,
    caption: post.caption,
    mediaUrl: post.mediaUrl,
    ratingAverage: post.ratingAverage,
    ratingCount: post.ratingCount,

    user: {
      id: post.user.id,
      name:
        post.user.profile?.[0]?.profileName ??
        post.user.email,
      avatar: post.user.profile?.[0]?.imageUrl ?? null,
    },
  }));

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

}