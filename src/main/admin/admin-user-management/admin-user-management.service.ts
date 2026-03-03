import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable, NotFoundException } from "@nestjs/common";
import { MediaType, Type } from "generated/prisma/enums";
import { PostModerationListResponse } from "./dto/post-moderation.response";
import { ModerationMediaFilter, PostModerationQueryDto } from "./dto/post-mpderation.query.dto";
import { Prisma } from "generated/prisma/client";
import { QueryMode } from "generated/prisma/internal/prismaNamespace";

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

async getUsers(){
  const users = await this.prisma.user.findMany({
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: 0,
  select: {
    id: true,
    email: true,
    role: true,
    createdAt: true,
    activeProfileId: true,
    profile: {
      where: { id: { equals: undefined as any } },
      select: {
        id: true,
        profileName: true,
        imageUrl: true,
        activeType: true,
        _count: { select: { posts: true, cars: true } },
      },
    },
  },
});
return users
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

              // ✅ since relation "user" doesn't exist in your generated types,
              // search user by joining manually is hard in single query.
              // We'll support caption-only search for now.
              // If you want search by user email/profileName, we can do it with a 2-step filter.
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

    // Collect ids for batch fetch
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
          hashtags: [], // ✅ keep empty until you confirm Hashtag schema
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

}