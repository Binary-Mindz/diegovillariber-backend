import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Type } from "generated/prisma/enums";

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
}