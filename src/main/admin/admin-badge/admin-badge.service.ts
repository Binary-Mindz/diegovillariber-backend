import { Injectable } from '@nestjs/common';
import { BadgeCatalogQueryDto } from './dto/badge-catalog-query.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BadgeStatus } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AdminBadgeService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [totalBadges, totalAwarded, distinctAwardedProfiles] =
      await Promise.all([
        this.prisma.badge.count({
          where: {
            status: {
              not: BadgeStatus.DELETED,
            },
          },
        }),
        this.prisma.profileBadge.count(),
        this.prisma.profileBadge.findMany({
          distinct: ['profileId'],
          select: {
            profileId: true,
          },
        }),
      ]);

    return {
      totalBadges,
      totalAwarded,
      usersWithBadges: distinctAwardedProfiles.length,
    };
  }

  async getCatalog(query: BadgeCatalogQueryDto) {
    const {
      page = 1,
      limit = 9,
      search,
      status,
      rarity,
      targetType,
    } = query;

    const where: Prisma.BadgeWhereInput = {
      ...(status
        ? { status }
        : {
            status: {
              not: BadgeStatus.DELETED,
            },
          }),
      ...(rarity ? { rarity } : {}),
      ...(targetType
        ? {
            targetTypes: {
              has: targetType,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                slug: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                description: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.badge.findMany({
        where,
        orderBy: [
          { sortOrder: 'asc' },
          { createdAt: 'desc' },
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.badge.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getRules() {
    const badges = await this.prisma.badge.findMany({
      where: {
        status: {
          not: BadgeStatus.DELETED,
        },
      },
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        rarity: true,
        targetTypes: true,
        status: true,
        sortOrder: true,
        isHidden: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return badges.map((badge) => ({
      ...badge,
      rule: {
        code: badge.slug,
        title: badge.name,
        description:
          badge.description ?? `${badge.name} badge rule configuration`,
        targetTypes: badge.targetTypes,
      },
    }));
  }

  async getAnalytics() {
    const [totalBadges, totalAwarded, topBadges, awardedBreakdown] =
      await Promise.all([
        this.prisma.badge.count({
          where: {
            status: {
              not: BadgeStatus.DELETED,
            },
          },
        }),
        this.prisma.profileBadge.count(),
        this.prisma.badge.findMany({
          where: {
            status: {
              not: BadgeStatus.DELETED,
            },
          },
          include: {
            _count: {
              select: {
                awards: true,
              },
            },
          },
          orderBy: {
            awards: {
              _count: 'desc',
            },
          },
          take: 10,
        }),
        this.prisma.profileBadge.groupBy({
          by: ['badgeId'],
          _count: {
            badgeId: true,
          },
        }),
      ]);

    const badgeIds = awardedBreakdown.map((item) => item.badgeId);

    const badges = badgeIds.length
      ? await this.prisma.badge.findMany({
          where: {
            id: {
              in: badgeIds,
            },
          },
          select: {
            id: true,
            name: true,
            slug: true,
            rarity: true,
            targetTypes: true,
          },
        })
      : [];

    const badgeMap = new Map(badges.map((badge) => [badge.id, badge]));

    const badgeWiseAwards = awardedBreakdown.map((item) => ({
      badgeId: item.badgeId,
      badgeName: badgeMap.get(item.badgeId)?.name ?? null,
      slug: badgeMap.get(item.badgeId)?.slug ?? null,
      rarity: badgeMap.get(item.badgeId)?.rarity ?? null,
      targetTypes: badgeMap.get(item.badgeId)?.targetTypes ?? [],
      totalAwarded: item._count.badgeId,
    }));

    return {
      totalBadges,
      totalAwarded,
      topBadges: topBadges.map((badge) => ({
        id: badge.id,
        name: badge.name,
        slug: badge.slug,
        description: badge.description,
        rarity: badge.rarity,
        targetTypes: badge.targetTypes,
        totalAwarded: badge._count.awards,
      })),
      badgeWiseAwards,
    };
  }
}