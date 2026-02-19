import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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
        where: { isActive: 'ACTIVE' },
      }),
      this.prisma.battle.count({
        where: { battleCategory: 'HEAD_TO_HEAD' },
      }),
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

}
