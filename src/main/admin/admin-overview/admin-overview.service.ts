import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { ChallengeStatus, MediaType } from "generated/prisma/enums";

@Injectable()
export class AdminOverviewService {
  constructor(private readonly prisma: PrismaService) { }

  async getDashboardStats() {
    const [
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      totalEvents,
      totalChallenges,
      activeChallenges,
      headToHeadBattles,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.post.count(),
      this.prisma.like.count(),
      this.prisma.comment.count(),
      this.prisma.event.count(),
      this.prisma.challenge.count(),
      this.prisma.challenge.count({
        where: { status : ChallengeStatus.UPCOMING}
      }),
      this.prisma.headToHeadBattle.count(),
    ]);

    return {
      totalUsers,
      totalPosts,
      totalLikes,
      totalComments,
      totalEvents,
      totalChallenges,
      activeChallenges,
      headToHeadBattles,
    };
  }

  async getWeeklyEngagement() {
    return this.prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('day', "createdAt") as date,
      COUNT(*)::int as total,
      'like' as type
    FROM "Like"
    WHERE "createdAt" >= NOW() - INTERVAL '7 days'
    GROUP BY date

    UNION ALL

    SELECT 
      DATE_TRUNC('day', "createdAt") as date,
      COUNT(*)::int as total,
      'comment' as type
    FROM "Comment"
    WHERE "createdAt" >= NOW() - INTERVAL '7 days'
    GROUP BY date

    ORDER BY date ASC;
  `;
  }

  async getSystemStats() {
    const [totalUsers, totalPosts, totalPhotos, totalVideos] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.post.count(),
        this.prisma.post.count({
          where: {
            mediaType: MediaType.IMAGE,
          },
        }),
        this.prisma.post.count({
          where: {
            mediaType: MediaType.VIDEO,
          },
        }),
      ]);

    return {
      totalUsers,
      totalPosts,
      totalPhotos,
      totalVideos,
    };
  }

}
