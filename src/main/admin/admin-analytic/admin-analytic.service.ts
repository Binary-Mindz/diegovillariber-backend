import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

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
    const grouped = await this.prisma.challenge.groupBy({
      by: ['isActive'],
      _count: {
        _all: true,
      },
    });

    let totalChallenges = 0;
    let activeChallenges = 0;
    let pendingChallenges = 0;

    for (const item of grouped) {
      totalChallenges += item._count._all;

      if (item.isActive === 'ACTIVE') {
        activeChallenges = item._count._all;
      }

      if (item.isActive === 'PENDING') {
        pendingChallenges = item._count._all;
      }
    }

    return {
      totalChallenges,
      activeChallenges,
      pendingChallenges,
    };
  }

}