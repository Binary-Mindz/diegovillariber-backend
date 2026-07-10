import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
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
  constructor(private readonly prisma: PrismaService) { }

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

        const end = new Date(now);
        end.setHours(23, 59, 59, 999);

        return {
          gte: start,
          lte: end,
        };
      }

      case RankingDuration.WEEK: {
        const start = new Date(now);
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);

        return {
          gte: start,
          lte: now,
        };
      }

      case RankingDuration.MONTH: {
        const start = new Date(now);
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);

        return {
          gte: start,
          lte: now,
        };
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
        votes: {
          gt: 0,
        },
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
      .filter((row) => row.totalVotes > 0)
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
      duration: query.duration || RankingDuration.ALL,
      filterNote:
        'Split screen duration is filtered by battle createdAt because votes are stored as total counter.',
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
    const createdAtFilter = this.getDateFilter(query.duration);

    const userPointRows = await this.prisma.userPoint.findMany({
      where: {
        ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      },
      select: {
        userId: true,
        points: true,
      },
    });

    const pointMap = new Map<string, number>();

    for (const row of userPointRows) {
      const current = pointMap.get(row.userId) || 0;
      pointMap.set(row.userId, current + (row.points || 0));
    }

    const rankingRows = Array.from(pointMap.entries())
      .map(([userId, prestigePoints]) => ({
        userId,
        prestigePoints,
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
      duration: query.duration || RankingDuration.ALL,
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

    const createdAtFilter = this.getDateFilter(dto.duration);

    const whereClause = createdAtFilter
      ? { createdAt: createdAtFilter }
      : {};

    const grouped = await this.prisma.post.groupBy({
      by: ['userId'],
      where: whereClause,
      _sum: {
        ratingTotal: true,
        ratingCount: true,
      },
      _avg: {
        ratingAverage: true,
      },
      _count: {
        _all: true,
      },
    });

    const userIds = grouped.map((g) => g.userId);

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: userIds,
        },
      },
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
    });

    const userMap = new Map(users.map((user) => [user.id, user]));

    const rankedItems = grouped
      .map((item) => {
        const user = userMap.get(item.userId);

        return {
          userId: item.userId,
          name:
            user?.profile?.[0]?.profileName ??
            user?.email ??
            'Unknown User',
          avatar: user?.profile?.[0]?.imageUrl ?? null,
          postCount: item._count._all,
          ratingAverage: Number(item._avg.ratingAverage ?? 0),
          ratingCount: item._sum.ratingCount ?? 0,
          ratingTotal: item._sum.ratingTotal ?? 0,
        };
      })
      .sort((a, b) => {
        if (b.ratingAverage !== a.ratingAverage) {
          return b.ratingAverage - a.ratingAverage;
        }

        if (b.ratingCount !== a.ratingCount) {
          return b.ratingCount - a.ratingCount;
        }

        return b.ratingTotal - a.ratingTotal;
      })
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }));

    const items = rankedItems.slice(skip, skip + limit);

    return {
      duration: dto.duration ?? RankingDuration.ALL,
      items,
      meta: {
        total: rankedItems.length,
        page,
        limit,
        totalPages: Math.ceil(rankedItems.length / limit),
      },
    };
  }
}