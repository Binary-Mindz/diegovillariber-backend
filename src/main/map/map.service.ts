import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MapQueryDto } from './dto/map-query.dto';
import {
  BattleStatus,
  ChallengeStatus,
  EventStatus,
  Prisma,
  RawShiftStatus,
  Type,
} from 'generated/prisma/client';
import { CIRCUITS_DATA } from '../program/lab-time/data/circuits.data';
import { findCircuitLayout } from '../program/lab-time/utils/circuit.util';

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
    rowLat?: Prisma.Decimal | number | null,
    rowLng?: Prisma.Decimal | number | null,
    radiusKm = 6371,
  ) {
    if (rowLat == null || rowLng == null) return false;

    const lat = Number(rowLat);
    const lng = Number(rowLng);

    return this.haversineKm(userLat, userLng, lat, lng) <= radiusKm;
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
      showSpotter = true,
      showOwner = true,
      highRated = false,
      showBattles = true,
      showChallenges = true,
      showEvents = true,
      showRawShift = true,
      showCircuits = true,
      showMarketplaceCar = false,
      showMarketplaceCarParts = false,
      showMarketplacePhotography = false,
      showMarketplaceSimRacing = false,
      showProBusiness = false,
      showProDriver = false,
      showContentCreator = false,
      showSimRacing = false,
      regionOnly = false,
    } = query;

    const hasRegion = regionOnly && lat != null && lng != null;
    const bounds =
      hasRegion && lat != null && lng != null
        ? this.getBounds(lat, lng, radiusKm)
        : null;

    const boundFilter = bounds ? this.buildDecimalBounds(bounds) : {};

    const profileTypes: Type[] = [];
    if (showSpotter) profileTypes.push(Type.SPOTTER);
    if (showOwner) profileTypes.push(Type.OWNER);

    const postWhere: Prisma.PostWhereInput = {
      latitude: { not: null },
      longitude: { not: null },
      ...(profileTypes.length > 0 ? { profileType: { in: profileTypes } } : {}),
      ...(highRated ? { ratingAverage: { gte: 4 } } : {}),
      ...boundFilter,
    };

    const challengeWhere: Prisma.ChallengeWhereInput = {
      status: { in: [ChallengeStatus.ACTIVE, ChallengeStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
    };

    const battleWhere: Prisma.HeadToHeadBattleWhereInput = {
      status: { in: [BattleStatus.ACTIVE, BattleStatus.UPCOMING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
    };

    const eventWhere: Prisma.EventWhereInput = {
      eventStatus: { in: [EventStatus.UPCOMING, EventStatus.ONGOING] },
      latitude: { not: null },
      longitude: { not: null },
      ...boundFilter,
    };

    const rawShiftWhere: Prisma.RawShiftBattleWhereInput = {
      status: { in: [RawShiftStatus.ACTIVE, RawShiftStatus.UPCOMING] },
    };

    const [posts, challenges, battles, events] = await Promise.all([
      profileTypes.length === 0
        ? Promise.resolve<any[]>([])
        : this.prisma.post.findMany({
            where: postWhere,
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
                  profile: {
                    select: {
                      activeType: true,
                      profileName: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showBattles
        ? this.prisma.headToHeadBattle.findMany({
            where: battleWhere,
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
                  profile: {
                    select: {
                      activeType: true,
                      profileName: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showEvents
        ? this.prisma.event.findMany({
            where: eventWhere,
            orderBy: [{ startDate: 'asc' }],
            select: {
              id: true,
              eventTitle: true,
              coverImage: true,
              location: true,
              locationAddress: true,
              latitude: true,
              longitude: true,
              eventType: true,
              eventStatus: true,
              startDate: true,
              endDate: true,
              owner: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: {
                      activeType: true,
                      profileName: true,
                      imageUrl: true,
                    },
                  },
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),
    ]);

    const filterRegion = <T extends { latitude?: any; longitude?: any }>(
      items: T[],
    ) => {
      if (!hasRegion || lat == null || lng == null) return items;
      return items.filter((item) =>
        this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
      );
    };

    const filteredPosts = filterRegion(posts);
    const filteredChallenges = filterRegion(challenges);
    const filteredBattles = filterRegion(battles);
    const filteredEvents = filterRegion(events);

    const circuitMarkers = showCircuits
      ? CIRCUITS_DATA.flatMap((circuit) =>
          (circuit.layouts ?? [])
            .filter(
              (layout) =>
                layout.latitude !== null &&
                layout.latitude !== undefined &&
                layout.longitude !== null &&
                layout.longitude !== undefined,
            )
            .map((layout) => ({
              id: `${circuit.trackName}__${layout.trackLayout}`,
              mapType: 'CIRCUIT',
              title: layout.trackLayout
                ? `${circuit.trackName} - ${layout.trackLayout}`
                : circuit.trackName,
              image: null,
              latitude: Number(layout.latitude),
              longitude: Number(layout.longitude),
              locationName: circuit.country ?? null,
              trackName: circuit.trackName,
              trackLayout: layout.trackLayout,
              country: circuit.country ?? null,
              continent: circuit.continent ?? null,
            })),
        )
      : [];

    const filteredCircuits =
      hasRegion && lat != null && lng != null
        ? circuitMarkers.filter((item) =>
            this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
          )
        : circuitMarkers;

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

      ...filteredEvents.map((item) => ({
        id: item.id,
        mapType: 'EVENT',
        title: item.eventTitle,
        image: item.coverImage,
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        locationName: item.location ?? item.locationAddress,
        status: item.eventStatus,
        eventType: item.eventType,
        startDate: item.startDate,
        endDate: item.endDate,
        owner: item.owner,
      })),

      ...filteredCircuits,
    ];

    return {
      total: markers.length,
      filters: query,
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

    if (type === 'event') {
      return this.prisma.event.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
    }

    if (type === 'raw_shift') {
      return this.prisma.rawShiftBattle.findUnique({
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
              entries: true,
              comments: true,
            },
          },
        },
      });
    }

    if (type === 'circuit') {
      const [trackName, trackLayout] = decodeURIComponent(id).split('__');

      const layout = findCircuitLayout(trackName, trackLayout);

      if (!layout) {
        return null;
      }

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