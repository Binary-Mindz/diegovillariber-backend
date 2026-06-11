import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MapQueryDto, MapTimeRange } from './dto/map-query.dto';
import {
  BattleStatus,
  ChallengeStatus,
  EventStatus,
  Prisma,
  ProductCategory,
  Type,
} from 'generated/prisma/client';
import { CIRCUITS_DATA } from '../program/lab-time/data/circuits.data';
import { findCircuitLayout } from '../program/lab-time/utils/circuit.util';

@Injectable()
export class MapService {
  constructor(private readonly prisma: PrismaService) { }

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

  private getTimeRangeDate(timeRange?: MapTimeRange): Date | undefined {
    if (!timeRange) return undefined;
    const now = new Date();

    switch (timeRange) {
      case MapTimeRange.LAST_24_HOURS:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case MapTimeRange.LAST_7_DAYS:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case MapTimeRange.LAST_30_DAYS:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case MapTimeRange.LAST_6_MONTHS: {
        const date = new Date(now);
        date.setMonth(date.getMonth() - 6);
        return date;
      }
      case MapTimeRange.LAST_1_YEAR: {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - 1);
        return date;
      }
      default:
        return undefined;
    }
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

  private buildDecimalBounds(bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }) {
    return {
      latitude: {
        gte: new Prisma.Decimal(bounds.minLat),
        lte: new Prisma.Decimal(bounds.maxLat),
      },
      longitude: {
        gte: new Prisma.Decimal(bounds.minLng),
        lte: new Prisma.Decimal(bounds.maxLng),
      },
    };
  }

  async getMapMarkers(query: MapQueryDto) {
    const {
      lat,
      lng,
      radiusKm = 6371,
      timeRange,

      showSpotter = true,
      showOwner = true,
      highRated = false,

      showBattles = true,
      showChallenges = true,
      showEvents = true,
      showCircuits = true,

      showMarketplaceCar = false,
      showMarketplaceCarParts = false,
      showMarketplacePhotography = false,
      showMarketplaceSimRacing = false,

      regionOnly = false,
    } = query;

    const hasRegion = regionOnly && lat != null && lng != null;
    const bounds = hasRegion && lat != null && lng != null ? this.getBounds(lat, lng, radiusKm) : null;
    const boundFilter = bounds ? this.buildDecimalBounds(bounds) : {};
    const fromDate = this.getTimeRangeDate(timeRange);

    const createdAtFilter = fromDate
      ? {
        createdAt: {
          gte: fromDate,
        },
      }
      : {};

    // Profile Types Filtering
    const profileTypes: Type[] = [];
    if (showSpotter) profileTypes.push(Type.SPOTTER);
    if (showOwner) profileTypes.push(Type.OWNER);

    // Marketplace Enums Mapping Fixed
    const marketplaceCategories: ProductCategory[] = [];
    if (showMarketplaceCar) marketplaceCategories.push(ProductCategory.CAR);
    if (showMarketplaceCarParts) marketplaceCategories.push(ProductCategory.CAR_PARTS);
    if (showMarketplacePhotography) marketplaceCategories.push(ProductCategory.PHOTOGRAPHY);
    if (showMarketplaceSimRacing) marketplaceCategories.push(ProductCategory.SIM_RACING);

    // Dynamic Queries Optimization
    const postWhere: Prisma.PostWhereInput = {
      latitude: { not: null },
      longitude: { not: null },
      ...(profileTypes.length > 0 ? { profileType: { in: profileTypes } } : {}),
      ...(highRated ? { ratingAverage: { gte: 4 } } : {}),
      ...boundFilter,
      ...createdAtFilter,
    };

    const challengeWhere: Prisma.ChallengeWhereInput = {
      status: { in: [ChallengeStatus.ACTIVE, ChallengeStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
      ...createdAtFilter,
    };

    const battleWhere: Prisma.HeadToHeadBattleWhereInput = {
      status: { in: [BattleStatus.ACTIVE, BattleStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
      ...createdAtFilter,
    };

    const eventWhere: Prisma.EventWhereInput = {
      eventStatus: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
      ...createdAtFilter,
    };

    const marketplaceWhere: Prisma.ProductListWhereInput = {
      latitude: { not: null },
      longitude: { not: null },
      ...(marketplaceCategories.length > 0 ? { category: { in: marketplaceCategories } } : {}),
      ...boundFilter,
      ...createdAtFilter,
    };

    // Parallel Execution
    const [posts, challenges, battles, events, marketplaceProducts] = await Promise.all([
      profileTypes.length === 0
        ? Promise.resolve<any[]>([])
        : this.prisma.post.findMany({
          where: postWhere,
          orderBy: [{ createdAt: 'desc' }],
        }),

      showChallenges
        ? this.prisma.challenge.findMany({
          where: challengeWhere,
          orderBy: [{ startDate: 'asc' }],
        })
        : Promise.resolve<any[]>([]),

      showBattles
        ? this.prisma.headToHeadBattle.findMany({
          where: battleWhere,
          orderBy: [{ startDate: 'asc' }],
        })
        : Promise.resolve<any[]>([]),

      showEvents
        ? this.prisma.event.findMany({
          where: eventWhere,
          orderBy: [{ startDate: 'asc' }],
        })
        : Promise.resolve<any[]>([]),

      marketplaceCategories.length > 0
        ? this.prisma.productList.findMany({
          where: marketplaceWhere,
          orderBy: [{ createdAt: 'desc' }],
          include: {
            owner: {
              select: {
                id: true,
                email: true,
                profile: { select: { profileName: true, imageUrl: true } },
              },
            },
            car: {
              select: { id: true, make: true, model: true, image: true, displayName: true },
            },
          },
        })
        : Promise.resolve<any[]>([]),
    ]);

    // Format Data Markers cleanly for Frontend Consumption
    const postMarkers = posts.map((p) => ({ ...p, markerType: 'SPOT', type: 'spot' }));
    const challengeMarkers = challenges.map((c) => ({ ...c, markerType: 'CHALLENGE', type: 'challenge' }));
    const battleMarkers = battles.map((b) => ({ ...b, markerType: 'BATTLE', type: 'battle' }));
    const eventMarkers = events.map((e) => ({ ...e, markerType: 'EVENT', type: 'event' }));
    const marketplaceMarkers = marketplaceProducts.map((product) => ({
      ...product,
      markerType: 'MARKETPLACE',
      type: 'marketplace',
    }));

    // Static Circuit Processing (If Enabled)
    // Static Circuit Processing (If Enabled) - FIXED TYPE ERROR
    let circuitMarkers: any[] = [];
    if (showCircuits) {
      CIRCUITS_DATA.forEach((circuit) => {
        if (circuit.layouts && Array.isArray(circuit.layouts)) {
          circuit.layouts.forEach((layout) => {
            let isIncluded = true;
            if (hasRegion && lat != null && lng != null) {
              // Convert to explicit number to avoid number | null TypeScript error
              const currentLayoutLat = layout.latitude != null ? Number(layout.latitude) : null;
              const currentLayoutLng = layout.longitude != null ? Number(layout.longitude) : null;

              if (currentLayoutLat !== null && currentLayoutLng !== null) {
                const distance = this.haversineKm(lat, lng, currentLayoutLat, currentLayoutLng);
                if (distance > radiusKm) isIncluded = false;
              } else {
                // If coordinates are missing, exclude if filtered by region
                isIncluded = false;
              }
            }
            if (isIncluded) {
              const uniqueId = encodeURIComponent(`${circuit.trackName}__${layout.trackLayout}`);
              circuitMarkers.push({
                id: uniqueId,
                trackName: circuit.trackName,
                trackLayout: layout.trackLayout,
                latitude: layout.latitude,
                longitude: layout.longitude,
                country: circuit.country,
                continent: circuit.continent,
                markerType: 'CIRCUIT',
                type: 'circuit',
              });
            }
          });
        }
      });
    }

    const allMarkers = [
      ...postMarkers,
      ...challengeMarkers,
      ...battleMarkers,
      ...eventMarkers,
      ...marketplaceMarkers,
      ...circuitMarkers,
    ];

    return {
      total: allMarkers.length,
      filters: query,
      markers: allMarkers,
    };
  }

  async getMapDetails(type: string, id: string) {
    const normalisedType = type.toLowerCase();

    if (normalisedType === 'spot') {
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
          user: { select: { id: true, email: true } },
          profile: { select: { id: true, profileName: true, imageUrl: true } },
        },
      });
    }

    if (normalisedType === 'challenge') {
      return this.prisma.challenge.findUnique({
        where: { id },
        include: {
          creator: { select: { id: true, email: true } },
          _count: { select: { challengeParticipants: true, challengeSubmissions: true } },
        },
      });
    }

    if (normalisedType === 'battle') {
      return this.prisma.headToHeadBattle.findUnique({
        where: { id },
        include: {
          creator: { select: { id: true, email: true } },
          _count: { select: { participants: true, submissions: true, battleVotes: true } },
        },
      });
    }

    if (normalisedType === 'event') {
      return this.prisma.event.findUnique({
        where: { id },
        include: {
          owner: { select: { id: true, email: true } },
        },
      });
    }

    if (normalisedType === 'marketplace') {
      return this.prisma.productList.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: { select: { profileName: true, imageUrl: true } },
            },
          },
          car: true,
        },
      });
    }

    if (normalisedType === 'raw_shift') {
      return this.prisma.rawShiftBattle.findUnique({
        where: { id },
        include: {
          creator: { select: { id: true, email: true } },
          _count: { select: { participants: true, entries: true, comments: true } },
        },
      });
    }

    if (normalisedType === 'circuit') {
      const [trackName, trackLayout] = decodeURIComponent(id).split('__');
      const layout = findCircuitLayout(trackName, trackLayout);
      if (!layout) return null;

      const circuit = CIRCUITS_DATA.find(
        (item) => item.trackName.trim().toLowerCase() === trackName.trim().toLowerCase(),
      );

      return {
        id,
        type: 'CIRCUIT',
        trackName,
        trackLayout: layout.trackLayout,
        latitude: layout.latitude,
        longitude: layout.longitude,
        country: circuit?.country ?? null,
        continent: circuit?.continent ?? null,
      };
    }

    return null;
  }
}