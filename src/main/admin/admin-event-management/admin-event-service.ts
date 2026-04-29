import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';
import { EngagementQueryDto } from './dto/engagemant-query.dto';
import { BattleStatus, ChallengeStatus, EventStatus, OfficialPartnerRequestStatus, RawShiftStatus, SplitScreenBattleStatus } from 'generated/prisma/enums';

type Trend = {
  percentage: number; // e.g. 23.5
  direction: 'UP' | 'DOWN' | 'FLAT';
};

type StatCard = {
  key:
    | 'events'
    | 'pro_driver_events'
    | 'creator_events'
    | 'total_attendees'
    | 'upcoming'
    | 'past';
  title: string;
  value: number;
  trend: Trend;
};

@Injectable()
export class AdminEventManagementervice {
  constructor(private readonly prisma: PrismaService) {}

  private getDateWindows() {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);

    const prev30Start = new Date(now);
    prev30Start.setDate(now.getDate() - 60);

    const prev30End = new Date(now);
    prev30End.setDate(now.getDate() - 30);

    return { now, last30, prev30Start, prev30End };
  }

  private trend(current: number, previous: number): Trend {
    if (previous <= 0 && current > 0) return { percentage: 100, direction: 'UP' };
    if (previous <= 0 && current <= 0) return { percentage: 0, direction: 'FLAT' };

    const diff = current - previous;
    const pct = (diff / previous) * 100;

    const rounded = Math.round(pct * 10) / 10; // 1 decimal like 23.5
    const direction: Trend['direction'] =
      rounded > 0 ? 'UP' : rounded < 0 ? 'DOWN' : 'FLAT';

    return { percentage: Math.abs(rounded), direction };
  }

  async getEventsOverview(): Promise<{ cards: StatCard[] }> {
    const { last30, prev30Start, prev30End } = this.getDateWindows();

    // ---------- Current totals (all time) ----------
    const [
      totalEvents,
      totalProDriverEvents,
      totalCreatorEvents,
      totalUpcoming,
      totalPast,
    ] = await this.prisma.$transaction([
      this.prisma.event.count(),
      this.prisma.event.count({ where: { profileType: 'PRO_DRIVER' } }),
      this.prisma.event.count({ where: { profileType: 'CONTENT_CREATOR' } }),
      this.prisma.event.count({ where: { eventStatus: 'UPCOMING' } }),
      this.prisma.event.count({ where: { eventStatus: 'COMPLETED' } }),
    ]);

    // ---------- Growth windows (last 30 vs prev 30) ----------
    const [
      eventsLast30,
      eventsPrev30,

      proDriverLast30,
      proDriverPrev30,

      creatorLast30,
      creatorPrev30,

      upcomingLast30,
      upcomingPrev30,

      pastLast30,
      pastPrev30,
    ] = await this.prisma.$transaction([
      this.prisma.event.count({ where: { createdAt: { gte: last30 } } }),
      this.prisma.event.count({
        where: { createdAt: { gte: prev30Start, lt: prev30End } },
      }),

      this.prisma.event.count({
        where: { profileType: 'PRO_DRIVER', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          profileType: 'PRO_DRIVER',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { profileType: 'CONTENT_CREATOR', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          profileType: 'CONTENT_CREATOR',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { eventStatus: 'UPCOMING', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          eventStatus: 'UPCOMING',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { eventStatus: 'COMPLETED', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          eventStatus: 'COMPLETED',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),
    ]);

    const totalAttendees = 0;
    const attendeesLast30 = 0;
    const attendeesPrev30 = 0;

    const cards: StatCard[] = [
      {
        key: 'events',
        title: 'Events',
        value: totalEvents,
        trend: this.trend(eventsLast30, eventsPrev30),
      },
      {
        key: 'pro_driver_events',
        title: 'Pro Driver Events',
        value: totalProDriverEvents,
        trend: this.trend(proDriverLast30, proDriverPrev30),
      },
      {
        key: 'creator_events',
        title: 'Creator Events',
        value: totalCreatorEvents,
        trend: this.trend(creatorLast30, creatorPrev30),
      },
      {
        key: 'total_attendees',
        title: 'Total Attendees',
        value: totalAttendees,
        trend: this.trend(attendeesLast30, attendeesPrev30),
      },
      {
        key: 'upcoming',
        title: 'Upcoming',
        value: totalUpcoming,
        trend: this.trend(upcomingLast30, upcomingPrev30),
      },
      {
        key: 'past',
        title: 'Past Events',
        value: totalPast,
        trend: this.trend(pastLast30, pastPrev30),
      },
    ];

    return { cards };
  }

  async getAllEvents(query: GetAdminEventsQueryDto) {
  const { status, type, search, page = 1, limit = 20 } = query;

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const where: any = {};

  if (status) where.eventStatus = status;
  if (type) where.eventType = type;

  if (search?.trim()) {
    const s = search.trim();
    where.OR = [
      { eventTitle: { contains: s, mode: 'insensitive' } },
      { location: { contains: s, mode: 'insensitive' } },
      { description: { contains: s, mode: 'insensitive' } },
      { owner: { email: { contains: s, mode: 'insensitive' } } },
      { owner: { profile: { some: { profileName: { contains: s, mode: 'insensitive' } } } } },
    ];
  }

  const [items, total] = await this.prisma.$transaction([
    this.prisma.event.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { id: true, profileName: true, imageUrl: true },
              take: 1, 
            },
          },
        },
      },
    }),
    this.prisma.event.count({ where }),
  ]);
  const rows = items.map((e) => {
    const creatorName =
      e.owner?.profile?.[0]?.profileName ?? e.owner?.email ?? 'Unknown';

    return {
      id: e.id,
      eventTitle: e.eventTitle,
      eventType: e.eventType,
      creator: {
        id: e.owner?.id,
        name: creatorName,
        email: e.owner?.email ?? null,
        imageUrl: e.owner?.profile?.[0]?.imageUrl ?? null,
      },
      createdAt: e.createdAt, 
      location: e.location ?? null,

      attendees: null, 

      status: e.eventStatus,
    };
  });

  return {
    items: rows,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

  async getSingleEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const creatorName =
      event.owner?.profile?.[0]?.profileName ??
      event.owner?.email ??
      event.owner?.phone ??
      'Unknown';

    return {
      statusCode: 200,
      data: {
        id: event.id,
        eventTitle: event.eventTitle,
        description: event.description ?? null,
        eventType: event.eventType,
        eventStatus: event.eventStatus,
        createdAt: event.createdAt,
        startDate: event.startDate ?? null,
        endDate: event.endDate ?? null,
        location: event.location ?? null,
        creator: {
          id: event.owner?.id ?? null,
          name: creatorName,
          email: event.owner?.email ?? null,
          phone: event.owner?.phone ?? null,
          imageUrl: event.owner?.profile?.[0]?.imageUrl ?? null,
          profileId: event.owner?.profile?.[0]?.id ?? null,
        },
      },
    };
  }

  async deleteEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      data: {
        id,
      },
    };
  }

  async deleteAllProDriverEvents() {
    const result = await this.prisma.event.deleteMany({
      where: { profileType: 'PRO_DRIVER' },
    });

    return {
      message: 'Deleted all Pro Driver events successfully',
      deletedCount: result.count,
    };
  }


  async deleteAllCreatorEvents() {
    const result = await this.prisma.event.deleteMany({
      where: { profileType: 'CONTENT_CREATOR' },
    });

    return {
      message: 'Deleted all Creator events successfully',
      deletedCount: result.count,
    };
  }
  async exportEventsToCsv(): Promise<{ filename: string; csv: string }> {
  const events = await this.prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          profile: { select: { profileName: true }, take: 1 },
        },
      },
    },
  });

  const header = ['Event','Type','Creator','Created Date','Location','Attendees','Status'];

  const rows = events.map((e) => {
    const creator =
      e.owner?.profile?.[0]?.profileName ?? e.owner?.email ?? e.owner?.id ?? 'Unknown';

    return [
      e.eventTitle ?? '',
      String(e.eventType ?? ''),
      creator,
      e.createdAt?.toISOString?.() ?? '',
      e.location ?? '',
      '', // attendees placeholder
      String(e.eventStatus ?? ''),
    ];
  });

  const escape = (v: string) => {
    const s = v ?? '';
    const mustWrap = /[",\n]/.test(s);
    const safe = s.replace(/"/g, '""');
    return mustWrap ? `"${safe}"` : safe;
  };

  const csv = [header, ...rows]
    .map((line) => line.map((c) => escape(String(c))).join(','))
    .join('\n');

  const filename = `events-export-${new Date().toISOString().slice(0, 10)}.csv`;
  return { filename, csv };
}


 private subtractDays(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  private toPercent(value: number): number {
    return Number(value.toFixed(2));
  }

  async getRetentionOverview() {
    const now = new Date();
    const last1Day = this.subtractDays(1);
    const last7Days = this.subtractDays(7);
    const last30Days = this.subtractDays(30);

    const [dau, wau, mau] = await this.prisma.$transaction([
      this.prisma.user.count({
        where: {
          updatedAt: { gte: last1Day },
        },
      }),
      this.prisma.user.count({
        where: {
          updatedAt: { gte: last7Days },
        },
      }),
      this.prisma.user.count({
        where: {
          updatedAt: { gte: last30Days },
        },
      }),
    ]);

    const stickiness = mau > 0 ? this.toPercent((dau / mau) * 100) : 0;

    return {
      section: 'Retention & User Lifecycle Analysis',
      description:
        'Critical metrics for understanding user behavior and platform health',
      activeUsers: {
        dau: {
          label: 'DAU (Daily)',
          value: dau,
          description: 'Active in last 24h',
        },
        wau: {
          label: 'WAU (Weekly)',
          value: wau,
          description: 'Last 7 days',
        },
        mau: {
          label: 'MAU (Monthly)',
          value: mau,
          description: 'Last 30 days',
        },
        stickiness: {
          label: 'Stickiness (DAU/MAU)',
          value: stickiness,
          description: 'Industry 20%+ excellent',
          unit: '%',
        },
      },
      generatedAt: now,
    };
  }

  async getCohortRetention() {
    const now = new Date();

    const day1Cutoff = this.subtractDays(1);
    const day7Cutoff = this.subtractDays(7);
    const day30Cutoff = this.subtractDays(30);

    const [eligibleD1Users, eligibleD7Users, eligibleD30Users] =
      await this.prisma.$transaction([
        this.prisma.user.findMany({
          where: { createdAt: { lte: day1Cutoff } },
          select: { id: true, createdAt: true, updatedAt: true },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { lte: day7Cutoff } },
          select: { id: true, createdAt: true, updatedAt: true },
        }),
        this.prisma.user.findMany({
          where: { createdAt: { lte: day30Cutoff } },
          select: { id: true, createdAt: true, updatedAt: true },
        }),
      ]);

    const retainedD1 = eligibleD1Users.filter(
      (user) =>
        user.updatedAt.getTime() >
        user.createdAt.getTime() + 1 * 24 * 60 * 60 * 1000,
    ).length;

    const retainedD7 = eligibleD7Users.filter(
      (user) =>
        user.updatedAt.getTime() >
        user.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000,
    ).length;

    const retainedD30 = eligibleD30Users.filter(
      (user) =>
        user.updatedAt.getTime() >
        user.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000,
    ).length;

    const day1Retention =
      eligibleD1Users.length > 0
        ? this.toPercent((retainedD1 / eligibleD1Users.length) * 100)
        : 0;

    const day7Retention =
      eligibleD7Users.length > 0
        ? this.toPercent((retainedD7 / eligibleD7Users.length) * 100)
        : 0;

    const day30Retention =
      eligibleD30Users.length > 0
        ? this.toPercent((retainedD30 / eligibleD30Users.length) * 100)
        : 0;

    return {
      section: 'Cohort Retention Rates',
      metrics: {
        day1: {
          label: 'Day Retention',
          day: 1,
          value: day1Retention,
          description: 'User who return after 1 day',
          progress: day1Retention,
        },
        day7: {
          label: 'Day 7 Retention',
          day: 7,
          value: day7Retention,
          description: 'User who return after 7 day',
          progress: day7Retention,
        },
        day30: {
          label: 'Day 30 Retention',
          day: 30,
          value: day30Retention,
          description: 'User who return after 30 day',
          progress: day30Retention,
        },
      },
      generatedAt: now,
    };
  }

  async getChurnAndHealth() {
    const now = new Date();
    const last30Days = this.subtractDays(30);

    const [totalUsers, activeLast30Days, postsLast30Days] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: {
            updatedAt: { gte: last30Days },
          },
        }),
        this.prisma.post.count({
          where: {
            createdAt: { gte: last30Days },
          },
        }),
      ]);

    const inactiveUsers = totalUsers - activeLast30Days;
    const churnRate =
      totalUsers > 0 ? this.toPercent((inactiveUsers / totalUsers) * 100) : 0;

    const dailyContentRate = this.toPercent(postsLast30Days / 30);

    return {
      section: 'Churn & User Health',
      metrics: {
        churnRate: {
          label: 'Churn Rate',
          value: churnRate,
          description: `${activeLast30Days} active user last 30 days`,
          progress: churnRate,
          unit: '%',
        },
        content: {
          label: 'Content',
          value: dailyContentRate,
          description: 'Daily content creation rate',
          progress: dailyContentRate,
        },
      },
      generatedAt: now,
    };
  }

  async getPowerUsers() {
    const totalUsers = await this.prisma.user.count();

    if (!totalUsers) {
      return {
        section: 'Power Users (Top 10%)',
        summary: {
          powerUserCount: 0,
          activityShare: 0,
          avgLifetimeValue: 0,
        },
        users: [],
      };
    }

    const powerUserCount = Math.max(1, Math.ceil(totalUsers * 0.1));

    const users = await this.prisma.user.findMany({
      take: powerUserCount,
      orderBy: [
        { totalPoints: 'desc' },
        { likeCount: 'desc' },
        { commentCount: 'desc' },
        { shareCount: 'desc' },
      ],
      select: {
        id: true,
        email: true,
        totalPoints: true,
        likeCount: true,
        commentCount: true,
        shareCount: true,
        balance: true,
        profile: {
          take: 1,
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
          },
        },
      },
    });

    const allUsers = await this.prisma.user.findMany({
      select: {
        totalPoints: true,
        likeCount: true,
        commentCount: true,
        shareCount: true,
      },
    });

    const totalActivity = allUsers.reduce(
      (sum, user) =>
        sum +
        user.totalPoints +
        user.likeCount +
        user.commentCount +
        user.shareCount,
      0,
    );

    const topActivity = users.reduce(
      (sum, user) =>
        sum +
        user.totalPoints +
        user.likeCount +
        user.commentCount +
        user.shareCount,
      0,
    );

    const activityShare =
      totalActivity > 0 ? this.toPercent((topActivity / totalActivity) * 100) : 0;

    const avgLifetimeValue =
      users.length > 0
        ? this.toPercent(
            users.reduce((sum, user) => sum + user.balance, 0) / users.length,
          )
        : 0;

    return {
      section: 'Power Users (Top 10%)',
      summary: {
        powerUserCount,
        activityShare,
        avgLifetimeValue,
      },
      users: users.map((user, index) => ({
        rank: index + 1,
        id: user.id,
        name: user.profile?.[0]?.profileName ?? user.email,
        avatar: user.profile?.[0]?.imageUrl ?? null,
        totalPoints: user.totalPoints,
        likes: user.likeCount,
        comments: user.commentCount,
        shares: user.shareCount,
        balance: user.balance,
        activityScore:
          user.totalPoints +
          user.likeCount +
          user.commentCount +
          user.shareCount,
      })),
      generatedAt: new Date(),
    };
  }


  async getEngagementOverview(query: EngagementQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 5);
    const skip = (page - 1) * limit;

    const [
      totalPosts,
      totalLikes,
      totalComments,
      totalShares,
      totalRacingVotes,

      totalChallenges,
      activeChallenges,
      completedChallenges,

      totalHeadToHeadBattles,
      activeHeadToHeadBattles,
      finishedHeadToHeadBattles,

      totalRawShiftBattles,
      activeRawShiftBattles,
      finishedRawShiftBattles,

      totalSplitScreenBattles,
      activeSplitScreenBattles,
      completedSplitScreenBattles,
    ] = await this.prisma.$transaction([
      this.prisma.post.count(),
      this.prisma.like.count(),
      this.prisma.comment.count(),
      this.prisma.share.count(),
      this.prisma.racingVote.count(),

      this.prisma.challenge.count(),
      this.prisma.challenge.count({
        where: { status: ChallengeStatus.ACTIVE },
      }),
      this.prisma.challenge.count({
        where: { status: ChallengeStatus.FINISHED },
      }),

      this.prisma.headToHeadBattle.count(),
      this.prisma.headToHeadBattle.count({
        where: { status: BattleStatus.ACTIVE },
      }),
      this.prisma.headToHeadBattle.count({
        where: { status: BattleStatus.FINISHED },
      }),

      this.prisma.rawShiftBattle.count(),
      this.prisma.rawShiftBattle.count({
        where: { status: RawShiftStatus.ACTIVE },
      }),
      this.prisma.rawShiftBattle.count({
        where: { status: RawShiftStatus.FINISHED },
      }),

      this.prisma.splitScreenBattle.count(),
      this.prisma.splitScreenBattle.count({
        where: { status: SplitScreenBattleStatus.LIVE },
      }),
      this.prisma.splitScreenBattle.count({
        where: { status: SplitScreenBattleStatus.COMPLETED },
      }),
    ]);

    const totalBattles =
      totalHeadToHeadBattles + totalRawShiftBattles + totalSplitScreenBattles;

    const activeBattles =
      activeHeadToHeadBattles + activeRawShiftBattles + activeSplitScreenBattles;

    const completedBattles =
      finishedHeadToHeadBattles +
      finishedRawShiftBattles +
      completedSplitScreenBattles;

    const avgLikesPerPost =
      totalPosts > 0 ? Number((totalLikes / totalPosts).toFixed(2)) : 0;

    const avgCommentsPerPost =
      totalPosts > 0 ? Number((totalComments / totalPosts).toFixed(2)) : 0;

    const avgSharesPerPost =
      totalPosts > 0 ? Number((totalShares / totalPosts).toFixed(2)) : 0;

    const avgVotesPerPost =
      totalPosts > 0 ? Number((totalRacingVotes / totalPosts).toFixed(2)) : 0;

    const engagementRate =
      totalPosts > 0
        ? Number(
            (
              ((totalLikes + totalComments + totalShares + totalRacingVotes) /
                totalPosts) *
              100
            ).toFixed(2),
          )
        : 0;

    /**
     * NOTE:
     * Total views is not possible from the provided schema because
     * there is no PostView / ViewLog / impression counter model.
     * So returning 0 for now.
     */
    const totalViews = 0;
    const avgViewsPerPost = 0;

    const postIds = await this.prisma.post.findMany({
      select: { id: true },
    });

    const ids = postIds.map((p) => p.id);

    let rankedPosts: Array<{
      postId: string;
      likeCount: number;
      commentCount: number;
      shareCount: number;
      voteCount: number;
      engagementScore: number;
    }> = [];

    if (ids.length) {
    const [likeGroups, commentGroups, shareGroups, racingVoteGroups] =
  await this.prisma.$transaction([
    this.prisma.like.groupBy({
      by: ['postId'],
      where: { postId: { in: ids } },
      orderBy: { postId: 'asc' },
      _count: { _all: true },
    }),
    this.prisma.comment.groupBy({
      by: ['postId'],
      where: { postId: { in: ids } },
      orderBy: { postId: 'asc' },
      _count: { _all: true },
    }),
    this.prisma.share.groupBy({
      by: ['postId'],
      where: { postId: { in: ids } },
      orderBy: { postId: 'asc' },
      _count: { _all: true },
    }),
    this.prisma.racingVote.groupBy({
      by: ['postId'],
      where: {
        postId: {
          in: ids,
          not: null,
        },
      },
      orderBy: { postId: 'asc' },
      _count: { _all: true },
    }),
  ]);

const likeMap = new Map<string, number>();
const commentMap = new Map<string, number>();
const shareMap = new Map<string, number>();
const voteMap = new Map<string, number>();

likeGroups.forEach((item) => {
  likeMap.set(item.postId, typeof item._count === 'object' ? (item._count._all ?? 0) : 0);
});

commentGroups.forEach((item) => {
  commentMap.set(item.postId, typeof item._count === 'object' ? (item._count._all ?? 0) : 0);
});

shareGroups.forEach((item) => {
 shareMap.set(item.postId, typeof item._count === 'object' ? (item._count._all ?? 0) : 0);
});

racingVoteGroups.forEach((item) => {
  if (item.postId) {
  voteMap.set(item.postId, typeof item._count === 'object' ? (item._count._all ?? 0) : 0);
  }
});

      rankedPosts = ids.map((postId) => {
        const likeCount = likeMap.get(postId) ?? 0;
        const commentCount = commentMap.get(postId) ?? 0;
        const shareCount = shareMap.get(postId) ?? 0;
        const voteCount = voteMap.get(postId) ?? 0;

        return {
          postId,
          likeCount,
          commentCount,
          shareCount,
          voteCount,
          engagementScore: likeCount + commentCount + shareCount + voteCount,
        };
      });

      rankedPosts.sort((a, b) => b.engagementScore - a.engagementScore);
    }

    const totalTopPosts = rankedPosts.length;
    const paginatedRankedPosts = rankedPosts.slice(skip, skip + limit);
    const selectedPostIds = paginatedRankedPosts.map((item) => item.postId);

    const posts = selectedPostIds.length
      ? await this.prisma.post.findMany({
          where: {
            id: { in: selectedPostIds },
          },
          select: {
            id: true,
            caption: true,
            mediaUrl: true,
            postType: true,
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  take: 1,
                  select: {
                    id: true,
                    profileName: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        })
      : [];

    const postMap = new Map(posts.map((post) => [post.id, post]));

    const topPerformingPosts = paginatedRankedPosts.map((item, index) => {
      const post = postMap.get(item.postId);

      const authorName =
        post?.user?.profile?.[0]?.profileName ?? post?.user?.email ?? 'Unknown';

      return {
        rank: skip + index + 1,
        id: item.postId,
        title: post?.caption || 'Untitled Post',
        image: post?.mediaUrl || null,
        postType: post?.postType || null,
        author: {
          id: post?.user?.id || null,
          name: authorName,
          avatar: post?.user?.profile?.[0]?.imageUrl || null,
        },
        stats: {
          likeCount: item.likeCount,
          commentCount: item.commentCount,
          shareCount: item.shareCount,
          voteCount: item.voteCount,
          engagementScore: item.engagementScore,
        },
      };
    });

    return {
      contentMetrics: {
        totalPost: {
          label: 'Total Post',
          value: totalPosts,
          description: 'Total published posts',
        },
        totalLikes: {
          label: 'Total Likes',
          value: totalLikes,
          description: `Avg ${avgLikesPerPost} per post`,
        },
        totalComments: {
          label: 'Total Comments',
          value: totalComments,
          description: `Avg ${avgCommentsPerPost} per post`,
        },
        totalViews: {
          label: 'Total Views',
          value: totalViews,
          description: `Avg ${avgViewsPerPost} per post`,
        },
        totalShare: {
          label: 'Total Share',
          value: totalShares,
          description: `Avg ${avgSharesPerPost} per post`,
        },
        totalRacingVote: {
          label: 'Total Racing Vote',
          value: totalRacingVotes,
          description: `Avg ${avgVotesPerPost} per post`,
        },
        engagementRate: {
          label: 'Engagement Rate',
          value: engagementRate,
          unit: '%',
          description: '((likes + comments + shares + votes) / posts) × 100',
        },
      },

      arenaActivity: {
        totalChallenges: {
          label: 'Total Challenges',
          value: totalChallenges,
          description: `${activeChallenges} active`,
        },
        totalBattle: {
          label: 'Total Battle',
          value: totalBattles,
          description: `Active ${activeBattles}`,
        },
        completedChallenge: {
          label: 'Completed Challenge',
          value: completedChallenges,
          description: `Completed ${completedChallenges}`,
        },
        completedBattle: {
          label: 'Completed Battle',
          value: completedBattles,
          description: `Completed ${completedBattles}`,
        },
        battleBreakdown: {
          headToHead: {
            total: totalHeadToHeadBattles,
            active: activeHeadToHeadBattles,
            completed: finishedHeadToHeadBattles,
          },
          rawShift: {
            total: totalRawShiftBattles,
            active: activeRawShiftBattles,
            completed: finishedRawShiftBattles,
          },
          splitScreen: {
            total: totalSplitScreenBattles,
            active: activeSplitScreenBattles,
            completed: completedSplitScreenBattles,
          },
        },
      },

      topPerformingPosts: {
        items: topPerformingPosts,
        pagination: {
          page,
          limit,
          total: totalTopPosts,
          totalPages: Math.ceil(totalTopPosts / limit),
        },
      },
    };
  }

  async getBrandMetricsOverview() {
  const now = new Date();
  const last1Day = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    dau,
    mau,
    verifiedUsers,
    approvedAmbassadors,
    totalAmbassadors,
    contentCreators,
    ambassadorCountries,
    totalPosts,
    totalLikes,
    totalComments,
    topAmbassadors,
  ] = await this.prisma.$transaction([
    this.prisma.user.count(),

    this.prisma.user.count({
      where: {
        updatedAt: {
          gte: last1Day,
        },
      },
    }),

    this.prisma.user.count({
      where: {
        updatedAt: {
          gte: last30Days,
        },
      },
    }),

    this.prisma.user.count({
      where: {
        isEmailVerified: true,
      },
    }),

    this.prisma.ambassadorProgram.count({
      where: {
        status: 'APPROVED' as any,
      },
    }),

    this.prisma.ambassadorProgram.count(),

    this.prisma.profile.count({
      where: {
        creator: {
          isNot: null,
        },
      },
    }),

    this.prisma.ambassadorProgram.findMany({
      where: {
        country: {
          not: '',
        },
      },
      select: {
        country: true,
      },
      distinct: ['country'],
    }),

    this.prisma.post.count(),

    this.prisma.like.count(),

    this.prisma.comment.count(),

    this.prisma.ambassadorProgram.findMany({
      where: {
        status: 'APPROVED' as any,
      },
      take: 5,
      orderBy: {
        user: {
          totalPoints: 'desc',
        },
      },
      select: {
        id: true,
        motorspotName: true,
        country: true,
        user: {
          select: {
            id: true,
            totalPoints: true,
            email: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
                activeType: true,
              },
              take: 1,
            },
          },
        },
      },
    }),
  ]);

  const stickiness = mau > 0 ? Number(((dau / mau) * 100).toFixed(2)) : 0;

  const monthlyImpressions =
    totalUsers > 0 ? Number(((mau / totalUsers) * 100).toFixed(2)) : 0;

  const ambassadorRate =
    totalUsers > 0
      ? Number(((approvedAmbassadors / totalUsers) * 100).toFixed(2))
      : 0;

  const engagementRate =
    totalPosts > 0
      ? Number((((totalLikes + totalComments) / totalPosts) * 100).toFixed(2))
      : 0;

  const avgPostLikes =
    totalPosts > 0 ? Number((totalLikes / totalPosts).toFixed(2)) : 0;

  const avgPostComments =
    totalPosts > 0 ? Number((totalComments / totalPosts).toFixed(2)) : 0;

  /**
   * Top device:
   * তোমার দেওয়া schema snippet দিয়ে real device brand breakdown বের করা যাচ্ছে না,
   * কারণ User/Profile/Ambassador এর সাথে device brand relation নাই।
   * তাই fallback response দিলাম।
   *
   * যদি DeviceToken বা submission EXIF brand relation থাকে,
   * এখানে count query বসিয়ে দিবে।
   */
  const topDevice = [
    {
      label: 'Apple',
      value: 0,
    },
    {
      label: 'Samsung',
      value: 0,
    },
    {
      label: 'Sony Camera',
      value: 0,
    },
  ];

  return {
    section: 'Brand Partnership Value Proposition',
    description:
      'Key metrics that demonstrate platform value to motorsport brands',

    audienceReach: {
      totalReach: {
        label: 'Total Reach',
        value: totalUsers,
        description: 'Registered automotive enthusiasts',
      },
      monthlyImpressions: {
        label: 'Monthly Impressions',
        value: monthlyImpressions,
        unit: '%',
        description: 'Average monthly content views',
      },
      globalPresence: {
        label: 'Global Presence',
        value: ambassadorCountries.length,
        suffix: 'countries',
        description: 'International audience',
      },
      stickiness: {
        label: 'Stickiness (DAU/MAU)',
        value: stickiness,
        description: 'Industry 20%+ excellent',
        unit: '%',
      },
    },

    qualityMetrics: {
      verifiedUser: {
        label: 'Verified User',
        value: verifiedUsers,
      },
      ambassador: {
        label: 'Ambassador',
        value: ambassadorRate,
        unit: '%',
      },
      contentCreator: {
        label: 'Content Creator',
        value: contentCreators,
      },
    },

    topDevice,

    topInfluencers: topAmbassadors.map((item, index) => ({
      rank: index + 1,
      ambassadorId: item.id,
      userId: item.user.id,
      name:
        item.user.profile?.[0]?.profileName ||
        item.motorspotName ||
        item.user.email,
      avatar: item.user.profile?.[0]?.imageUrl || null,
      role: item.user.profile?.[0]?.activeType || 'AMBASSADOR',
      country: item.country,
      prestigePoint: item.user.totalPoints,
    })),

    engagementQuality: {
      engagementRate: {
        label: 'Engagement Rate',
        value: engagementRate,
        unit: '%',
      },
      avgPostLikes: {
        label: 'Avg Post Likes',
        value: avgPostLikes,
      },
      avgPostComments: {
        label: 'Avg Post Comments',
        value: avgPostComments,
      },
      dauMauRatio: {
        label: 'DAU/MAU Ratio',
        value: stickiness,
        unit: '%',
      },
    },

    meta: {
      totalAmbassadors,
      approvedAmbassadors,
      generatedAt: now,
    },
  };
}

async getEconomyOverview() {
  const [
    totalUsers,
    userPointAggregate,
    userPointTransactions,
    paymentsCount,
    liveRewardCount,
    totalEvents,
    upcomingEvents,
    socialCommunication,
    approvedBrandPartners,
  ] = await this.prisma.$transaction([
    this.prisma.user.count(),

    this.prisma.user.aggregate({
      _sum: {
        totalPoints: true,
      },
    }),

    this.prisma.userPoint.count(),

    this.prisma.payment.count(),

    this.prisma.liveReward.count(),

    this.prisma.event.count(),

    this.prisma.event.count({
      where: {
        eventStatus: EventStatus.UPCOMING,
      },
    }),

    this.prisma.follow.count(),

    this.prisma.officialPartner.count({
      where: {
        requestStatus: OfficialPartnerRequestStatus.APPROVED,
      },
    }),
  ]);

  const totalPrestige = userPointAggregate._sum.totalPoints ?? 0;

  const avgPerUser =
    totalUsers > 0 ? Number((totalPrestige / totalUsers).toFixed(2)) : 0;

  const transactions =
    userPointTransactions + paymentsCount + liveRewardCount;

  return {
    section: 'Prestige Economy',

    prestigeEconomy: {
      totalPrestige: {
        label: 'Total Prestige',
        value: totalPrestige,
        description: 'Total points in circulation',
      },
      avgPerUser: {
        label: 'Avg per User',
        value: avgPerUser,
        description: 'Average prestige points',
      },
      transactions: {
        label: 'Transactions',
        value: transactions,
        description: 'Total prestige events',
      },
    },

    platformActivity: {
      totalEvents: {
        label: 'Total Events',
        value: totalEvents,
        description: `Upcoming ${upcomingEvents}`,
      },
      socialCommunication: {
        label: 'Social Communication',
        value: socialCommunication,
        description: 'Total Follow',
      },
      brandPartners: {
        label: 'Brand Partners',
        value: approvedBrandPartners,
        description: 'Official Partners',
      },
    },

    meta: {
      totalUsers,
      userPointTransactions,
      paymentsCount,
      liveRewardCount,
      generatedAt: new Date(),
    },
  };
}

}