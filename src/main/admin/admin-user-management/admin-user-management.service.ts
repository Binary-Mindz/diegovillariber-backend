import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MediaType, Role, Type } from "generated/prisma/enums";
import { PostModerationListResponse } from "./dto/post-moderation.response";
import { ModerationMediaFilter, PostModerationQueryDto } from "./dto/post-mpderation.query.dto";
import { Prisma } from "generated/prisma/client";
import { QueryMode } from "generated/prisma/internal/prismaNamespace";
import { GetUsersQueryDto } from "./dto/get-user-query.dto";

@Injectable()
export class AdminUserManagementService {
  constructor(private readonly prisma: PrismaService) { }

  async getUserGrowthRetentionDashboard() {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const totalUsers = await this.prisma.user.count();

  const newUsersLast7Days = await this.prisma.user.count({
    where: { createdAt: { gte: last7Days } },
  });

  const dailyActiveUsers = await this.prisma.user.count({
    where: { updatedAt: { gte: last24h } },
  });

  const verifiedUsers = await this.prisma.user.count({
    where: {
      isEmailVerified: true,
      profile: {
        some: {
          activeType: { in: [Type.PRO_DRIVER, Type.PRO_BUSSINESS, Type.CONTENT_CREATOR] },
        },
      },
    },
  });

  const ambassadors = await this.prisma.user.count({
    where: { ambassadorPrograms: { isNot: null } },
  });

  
  const countries = 0;

  const grouped = await this.prisma.profile.groupBy({
    by: ['activeType'],
    _count: { _all: true },
    where: { activeType: { not: null } },
  });

  const totalTyped = grouped.reduce((sum, g) => sum + g._count._all, 0);

  const userTypeDistribution = grouped
    .map((g) => ({
      type: g.activeType!,
      count: g._count._all,
      percent: totalTyped === 0 ? 0 : Number(((g._count._all / totalTyped) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totals: {
      totalUsers,
      dailyActiveUsers,
      newUsersLast7Days,
      verifiedUsers,
      ambassadors,
      countries,
    },
    userTypeDistribution,
  };
}

async getUsers(query: GetUsersQueryDto) {
  const hasPagination =
    query.page !== undefined || query.limit !== undefined;

  const where = {
    role: {
      not: Role.ADMIN,
    },
  };

  if (!hasPagination) {
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        activeProfileId: true,
        profile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
            activeType: true,
            _count: {
              select: {
                posts: true,
                cars: true,
              },
            },
          },
        },
      },
    });

    return {
      data: users,
      pagination: null,
    };
  }

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  const safePage = page > 0 ? page : 1;
  const safeLimit = limit > 0 ? limit : 10;
  const skip = (safePage - 1) * safeLimit;

  const [users, total] = await Promise.all([
    this.prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: safeLimit,
      skip,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        activeProfileId: true,
        profile: {
          select: {
            id: true,
            profileName: true,
            imageUrl: true,
            activeType: true,
            _count: {
              select: {
                posts: true,
                cars: true,
              },
            },
          },
        },
      },
    }),
    this.prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}
async listPostsForModeration(
  aquery: PostModerationQueryDto
): Promise<PostModerationListResponse> {
  const query = aquery;

  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const q = query.q?.trim();

  const where: Prisma.PostWhereInput = {
    ...(query.media === ModerationMediaFilter.PHOTO
      ? { mediaType: MediaType.IMAGE }
      : query.media === ModerationMediaFilter.VIDEO
        ? { mediaType: MediaType.VIDEO }
        : {}),

    ...(q
      ? {
          OR: [
            { caption: { contains: q, mode: QueryMode.insensitive } },
          ],
        }
      : {}),
  };

  const [total, posts] = await this.prisma.$transaction([
    this.prisma.post.count({ where }),
    this.prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        userId: true,
        profileId: true,
        mediaType: true,
        mediaUrl: true,
        caption: true,
        createdAt: true,
        like: true,
        comment: true,
        share: true,
      },
    }),
  ]);

  const userIds = [...new Set(posts.map((p) => p.userId))];
  const profileIds = [...new Set(posts.map((p) => p.profileId).filter(Boolean))] as string[];

  const [users, profiles] = await this.prisma.$transaction([
    this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, email: true },
    }),
    this.prisma.profile.findMany({
      where: { id: { in: profileIds } },
      select: { id: true, profileName: true, imageUrl: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data: posts.map((p) => {
      const u = userMap.get(p.userId);
      const pr = p.profileId ? profileMap.get(p.profileId) : null;

      return {
        id: p.id,
        mediaType: p.mediaType,
        mediaUrl: p.mediaUrl,
        caption: p.caption,
        createdAt: p.createdAt,
        like: p.like,
        comment: p.comment,
        share: p.share,
        author: {
          userId: p.userId,
          email: u?.email ?? "",
          profileId: p.profileId ?? null,
          name: pr?.profileName ?? null,
          avatarUrl: pr?.imageUrl ?? null,
        },
        hashtags: [],
      };
    }),
    meta: { page, limit, total, totalPages },
  };
}

  async deletePost(postId: string) {
    const exists = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException("Post not found");

    await this.prisma.post.delete({ where: { id: postId } });
    return { message: "Post deleted successfully" };
  }


  async deleteUser(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.role === Role.ADMIN) {
    throw new NotFoundException('Admin user cannot be deleted from this endpoint');
  }

  await this.prisma.$transaction(async (tx) => {
    // delete child/dependent data first if needed
    await tx.challengeParticipant.deleteMany({
      where: { userId },
    });

    await tx.challengeVote.deleteMany({
      where: { userId },
    });

    await tx.challengeReaction.deleteMany({
      where: { userId },
    });

    await tx.challengeComment.deleteMany({
      where: { userId },
    });

    await tx.challenge.deleteMany({
      where: { creatorId: userId },
    });

    await tx.post.deleteMany({
      where: { userId },
    });

    await tx.profile.deleteMany({
      where: { userId },
    });

    await tx.user.delete({
      where: { id: userId },
    });
  });

  return { id: userId, deleted: true };
}

}