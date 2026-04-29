import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { TopContentCreatorQueryDto } from "./dto/top-content-creator-query.dto";
import { GetMostEngagedPostsQueryDto } from "./dto/get-most-engaged-posts-query.dto";
import { ChallengeStatus } from "generated/prisma/enums";

@Injectable()
export class AdminAnalyticService {
  constructor(private readonly prisma: PrismaService) { }

  async getAdvancedStats() {
    const [
      totalUser,
      totalPost,
      totalLike,
      totalComment,
      totalRacingVotes,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.like.count(),
      this.prisma.comment.count(),
      this.prisma.racingVote.count(),
    ]);

    const avgPostPerUser =
      totalUser === 0 ? 0 : Number((totalPost / totalUser).toFixed(2));

    const avgLikePerPost =
      totalPost === 0 ? 0 : Number((totalLike / totalPost).toFixed(2));

    return {
      totalUser,
      totalPost,
      totalLike,
      totalComment,
      totalRacingVotes,
      avgPostPerUser,
      avgLikePerPost,
    };
  }

 async getChallengeStats() {
  const [totalChallenges, active, pending] = await this.prisma.$transaction([
    this.prisma.challenge.count(),
    this.prisma.challenge.count({
      where: {
        status: ChallengeStatus.ACTIVE,
      },
    }),
    this.prisma.challenge.count({
      where: {
        status: ChallengeStatus.UPCOMING,
      },
    }),
  ]);

  return {
    statusCode: 200,
    message: 'Challenge stats fetched successfully',
    data: {
      totalChallenges,
      active,
      pending,
    },
  };
}

  async getTopContentCreators(query: TopContentCreatorQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const whereClause: any = {
    creator: {
      isNot: null,
    },
    user: {},
  };

  if (query.status) {
    whereClause.user.accountStatus = query.status;
  }

  if (query.search?.trim()) {
    const s = query.search.trim();

    whereClause.OR = [
      {
        profileName: {
          contains: s,
          mode: 'insensitive',
        },
      },
      {
        user: {
          email: {
            contains: s,
            mode: 'insensitive',
          },
        },
      },
      {
        user: {
          phone: {
            contains: s,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  const [profiles, total] = await Promise.all([
    this.prisma.profile.findMany({
      where: whereClause,
      skip,
      take: safeLimit,
      select: {
        id: true,
        profileName: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            accountStatus: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        posts: {
          _count: 'desc',
        },
      },
    }),
    this.prisma.profile.count({
      where: whereClause,
    }),
  ]);

  const rows = await Promise.all(
    profiles.map(async (profile) => {
      const lastPost = await this.prisma.post.findFirst({
        where: {
          profileId: profile.id,
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        id: profile.id,
        user:
          profile.profileName ||
          profile.user.email ||
          profile.user.phone ||
          'Unknown User',
        emailOrNumber: profile.user.email || profile.user.phone || null,
        totalPost: profile._count.posts,
        lastActivity: lastPost?.createdAt ?? null,
        status: profile.user.accountStatus,
      };
    }),
  );

  return {
    statusCode: 200,
    message: 'Top content creators fetched successfully',
    data: rows,
    pagination: {
      totalItems: total,
      currentPage: safePage,
      itemsPerPage: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage < Math.ceil(total / safeLimit),
      hasPrevPage: safePage > 1,
    },
  };
}


async getMostEngagedPosts(query: GetMostEngagedPostsQueryDto) {
  const { search, postType, page = 1, limit = 20 } = query;

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const where: any = {};

  if (postType) {
    where.postType = postType;
  }

  if (search?.trim()) {
    const s = search.trim();

    where.OR = [
      { caption: { contains: s, mode: 'insensitive' } },
      {
        user: {
          email: { contains: s, mode: 'insensitive' },
        },
      },
      {
        user: {
          phone: { contains: s, mode: 'insensitive' },
        },
      },
      {
        profile: {
          profileName: { contains: s, mode: 'insensitive' },
        },
      },
    ];
  }

  const [posts, total] = await this.prisma.$transaction([
    this.prisma.post.findMany({
      where,
      skip,
      take: safeLimit,
      select: {
        id: true,
        caption: true,
        like: true,
        comment: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
          },
        },
        profile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
          },
        },
      },
      orderBy: [
        { like: 'desc' },
        { comment: 'desc' },
        { createdAt: 'desc' },
      ],
    }),
    this.prisma.post.count({ where }),
  ]);

  const rows = posts
    .map((post) => {
      const engagementScore = (post.like ?? 0) + (post.comment ?? 0);

      return {
        id: post.id,
        user:
          post.profile?.profileName ||
          post.user?.email ||
          post.user?.phone ||
          'Unknown User',
        postCaption: post.caption ?? '',
        totalLike: post.like ?? 0,
        date: post.createdAt,
        totalComment: post.comment ?? 0,
        engagementScore,
        creator: {
          id: post.user?.id ?? null,
          email: post.user?.email ?? null,
          phone: post.user?.phone ?? null,
          profileId: post.profile?.id ?? null,
          imageUrl: post.profile?.imageUrl ?? null,
        },
      };
    })
    .sort((a, b) => {
      if (b.engagementScore !== a.engagementScore) {
        return b.engagementScore - a.engagementScore;
      }
      if (b.totalLike !== a.totalLike) {
        return b.totalLike - a.totalLike;
      }
      if (b.totalComment !== a.totalComment) {
        return b.totalComment - a.totalComment;
      }
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return {
    statusCode: 200,
    message: 'Most engaged posts fetched successfully',
    data: rows.map(({ engagementScore, ...rest }) => rest),
    pagination: {
      totalItems: total,
      currentPage: safePage,
      itemsPerPage: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasNextPage: safePage < Math.ceil(total / safeLimit),
      hasPrevPage: safePage > 1,
    },
  };
}
}