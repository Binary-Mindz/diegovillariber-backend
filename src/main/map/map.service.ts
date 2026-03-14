import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MapQueryDto } from './dto/map-query.dto';
import { BattleStatus, ChallengeStatus, Prisma, Type } from 'generated/prisma/client';

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) {}

  private getBounds(lat: number, lng: number, radiusKm: number) {
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos((lat * Math.PI) / 180));

    return {
      minLat: lat - latDelta,
      maxLat: lat + latDelta,
      minLng: lng - lngDelta,
      maxLng: lng + lngDelta,
    };
  }

  private haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  private withinRadius(
    userLat: number,
    userLng: number,
    rowLat?: Prisma.Decimal | null,
    rowLng?: Prisma.Decimal | null,
    radiusKm = 50,
  ) {
    if (rowLat == null || rowLng == null) return false;

    const lat = Number(rowLat);
    const lng = Number(rowLng);

    return this.haversineKm(userLat, userLng, lat, lng) <= radiusKm;
  }

  async getMapMarkers(query: MapQueryDto) {
    const {
      lat,
      lng,
      radiusKm = 50,
      showSpotter = true,
      showOwner = true,
      highRated = false,
      showBattles = true,
      showChallenges = true,
      regionOnly = false,
      limit = 100,
    } = query;

    const hasRegion = regionOnly && lat != null && lng != null;
    const bounds =
      hasRegion && lat != null && lng != null
        ? this.getBounds(lat, lng, radiusKm)
        : null;

    const profileTypes: Type[] = [];
    if (showSpotter) profileTypes.push(Type.SPOTTER);
    if (showOwner) profileTypes.push(Type.OWNER);

    const postWhere: Prisma.PostWhereInput = {
      latitude: { not: null },
      longitude: { not: null },
      ...(profileTypes.length > 0 ? { profileType: { in: profileTypes } } : {}),
      ...(highRated
        ? {
            ratingAverage: { gte: 4 },
          }
        : {}),
      ...(bounds
        ? {
            latitude: {
              gte: new Prisma.Decimal(bounds.minLat),
              lte: new Prisma.Decimal(bounds.maxLat),
            },
            longitude: {
              gte: new Prisma.Decimal(bounds.minLng),
              lte: new Prisma.Decimal(bounds.maxLng),
            },
          }
        : {}),
    };

    const challengeWhere: Prisma.ChallengeWhereInput = {
      status: { in: [ChallengeStatus.ACTIVE, ChallengeStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...(bounds
        ? {
            latitude: {
              gte: new Prisma.Decimal(bounds.minLat),
              lte: new Prisma.Decimal(bounds.maxLat),
            },
            longitude: {
              gte: new Prisma.Decimal(bounds.minLng),
              lte: new Prisma.Decimal(bounds.maxLng),
            },
          }
        : {}),
    };

    const battleWhere: Prisma.HeadToHeadBattleWhereInput = {
      status: { in: [BattleStatus.ACTIVE, BattleStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...(bounds
        ? {
            latitude: {
              gte: new Prisma.Decimal(bounds.minLat),
              lte: new Prisma.Decimal(bounds.maxLat),
            },
            longitude: {
              gte: new Prisma.Decimal(bounds.minLng),
              lte: new Prisma.Decimal(bounds.maxLng),
            },
          }
        : {}),
    };

   const [posts, challenges, battles] = await Promise.all([
  profileTypes.length === 0
    ? Promise.resolve<any[]>([])
    : this.prisma.post.findMany({
        where: postWhere,
        take: limit,
        orderBy: highRated
          ? [{ ratingAverage: 'desc' }, { createdAt: 'desc' }]
          : [{ createdAt: 'desc' }],
        select: {
          id: true,
          caption: true,
          mediaUrl: true,
          locationName: true,
          latitude: true,
          longitude: true,
          profileType: true,
          ratingAverage: true,
          ratingCount: true,
          like: true,
          comment: true,
          repost: true,
          user: {
            select: {
              id: true,
              email: true,
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
      }),

  showChallenges
    ? this.prisma.challenge.findMany({
        where: challengeWhere,
        take: limit,
        orderBy: [{ startDate: 'asc' }],
        select: {
          id: true,
          title: true,
          coverImage: true,
          locationName: true,
          latitude: true,
          longitude: true,
          status: true,
          type: true,
          category: true,
          preference: true,
          radiusKm: true,
          participationScope: true,
          startDate: true,
          endDate: true,
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
    : Promise.resolve<any[]>([]),

  showBattles
    ? this.prisma.headToHeadBattle.findMany({
        where: battleWhere,
        take: limit,
        orderBy: [{ startDate: 'asc' }],
        select: {
          id: true,
          title: true,
          coverImage: true,
          locationName: true,
          latitude: true,
          longitude: true,
          status: true,
          battleCategory: true,
          preference: true,
          radiusKm: true,
          participationScope: true,
          startDate: true,
          endDate: true,
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      })
    : Promise.resolve<any[]>([]),
]);

    const filteredPosts =
      hasRegion && lat != null && lng != null
        ? posts.filter((item) =>
            this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
          )
        : posts;

    const filteredChallenges =
      hasRegion && lat != null && lng != null
        ? challenges.filter((item) =>
            this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
          )
        : challenges;

    const filteredBattles =
      hasRegion && lat != null && lng != null
        ? battles.filter((item) =>
            this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
          )
        : battles;

    const markers = [
      ...filteredPosts.map((item) => ({
        id: item.id,
        mapType: 'SPOT',
        title: item.caption ?? item.locationName ?? 'Spot',
        image: item.mediaUrl,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        locationName: item.locationName,
        profileType: item.profileType,
        ratingAverage: Number(item.ratingAverage),
        ratingCount: item.ratingCount,
        profile: item.profile,
        owner: item.user,
      })),

      ...filteredChallenges.map((item) => ({
        id: item.id,
        mapType: 'CHALLENGE',
        title: item.title,
        image: item.coverImage,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        locationName: item.locationName,
        status: item.status,
        type: item.type,
        category: item.category,
        preference: item.preference,
        startDate: item.startDate,
        endDate: item.endDate,
        creator: item.creator,
      })),

      ...filteredBattles.map((item) => ({
        id: item.id,
        mapType: 'BATTLE',
        title: item.title,
        image: item.coverImage,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        locationName: item.locationName,
        status: item.status,
        battleCategory: item.battleCategory,
        preference: item.preference,
        startDate: item.startDate,
        endDate: item.endDate,
        creator: item.creator,
      })),
    ];

    return {
      total: markers.length,
      filters: {
        showSpotter,
        showOwner,
        highRated,
        showBattles,
        showChallenges,
        regionOnly,
        lat,
        lng,
        radiusKm,
      },
      markers,
    };
  }

  async getMapDetails(type: string, id: string) {
    if (type === 'spot') {
      return this.prisma.post.findUnique({
        where: { id },
        select: {
          id: true,
          caption: true,
          mediaUrl: true,
          postLocation: true,
          locationName: true,
          latitude: true,
          longitude: true,
          like: true,
          comment: true,
          repost: true,
          ratingAverage: true,
          ratingCount: true,
          profileType: true,
          user: {
            select: {
              id: true,
              email: true,
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
      });
    }

    if (type === 'challenge') {
      return this.prisma.challenge.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
          _count: {
            select: {
              challengeParticipants: true,
              challengeSubmissions: true,
            },
          },
        },
      });
    }

    if (type === 'battle') {
      return this.prisma.headToHeadBattle.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
          _count: {
            select: {
              participants: true,
              submissions: true,
              battleVotes: true,
            },
          },
        },
      });
    }

    return null;
  }
}