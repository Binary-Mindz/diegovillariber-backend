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

    const [
      posts,
      challenges,
      battles,
      events,
      businessProfiles,
      proDrivers,
      contentCreators,
      simRacingProfiles,
    ] = await Promise.all([
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
                  profile:{
                    select:{
                      activeType:true,
                      profileName:true,
                      imageUrl:true
                    }
                  }
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
                  profile:{
                    select:{
                      activeType:true,
                      profileName:true,
                      imageUrl:true
                    }
                  }
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
                  profile:{
                    select:{
                      activeType: true,
                      profileName: true,
                      imageUrl: true
                    }
                  }
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showRawShift
        ? this.prisma.rawShiftBattle.findMany({
            where: rawShiftWhere,
            orderBy: [{ startDate: 'asc' }],
            select: {
              id: true,
              title: true,
              coverImage: true,
              bannerImage: true,
              location: true,
              status: true,
              startDate: true,
              endDate: true,
              creator: {
                select: {
                  id: true,
                  email: true,
                  profile:{
                    select:{
                      profileName:true,
                      activeType:true,
                      imageUrl:true
                    }
                  }
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showProBusiness || showMarketplaceCar || showMarketplaceCarParts || showMarketplacePhotography
        ? this.prisma.businessProfile.findMany({
            select: {
              id: true,
              businessName: true,
              location: true,
              businessCategory: true,
              profile: {
                select: {
                  id: true,
                  profileName: true,
                  imageUrl: true
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showProDriver
        ? this.prisma.proDriverProfile.findMany({
            select: {
              id: true,
              location: true,
              racingDiscipline: true,
              profile: {
                select: {
                  id: true,
                  profileName: true,
                  imageUrl: true
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showContentCreator
        ? this.prisma.contentCreatorProfile.findMany({
            select: {
              id: true,
              creatorCategory: true,
              portfolioWebsite: true,
              youtubeChanel: true,
              profile: {
                select: {
                  id: true,
                  profileName: true,
                  imageUrl: true
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),

      showSimRacing || showMarketplaceSimRacing
        ? this.prisma.simRacingProfile.findMany({
            select: {
              id: true,
              hardwareSetup: true,
              racing: true,
              profile: {
                select: {
                  id: true,
                  profileName: true,
                  imageUrl: true
                },
              },
            },
          })
        : Promise.resolve<any[]>([]),
    ]);

    const filterRegion = <T extends { latitude?: any; longitude?: any }>(items: T[]) => {
      if (!hasRegion || lat == null || lng == null) return items;
      return items.filter((item) =>
        this.withinRadius(lat, lng, item.latitude, item.longitude, radiusKm),
      );
    };

    const filterProfileRegion = <T extends { profile: { latitude?: any; longitude?: any } }>(items: T[]) => {
      if (!hasRegion || lat == null || lng == null) return items;
      return items.filter((item) =>
        this.withinRadius(
          lat,
          lng,
          item.profile?.latitude,
          item.profile?.longitude,
          radiusKm,
        ),
      );
    };

    const filteredPosts = filterRegion(posts);
    const filteredChallenges = filterRegion(challenges);
    const filteredBattles = filterRegion(battles);
    const filteredEvents = filterRegion(events);

    const filteredBusiness = filterProfileRegion(businessProfiles);
    const filteredProDrivers = filterProfileRegion(proDrivers);
    const filteredCreators = filterProfileRegion(contentCreators);
    const filteredSimRacing = filterProfileRegion(simRacingProfiles);

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

      ...filteredBusiness.map((item) => ({
        id: item.id,
        mapType: 'BUSINESS',
        title: item.businessName ?? item.profile?.profileName ?? 'Business',
        image: item.profile?.imageUrl,
        latitude: Number(item.profile.latitude),
        longitude: Number(item.profile.longitude),
        locationName: item.location,
        businessCategory: item.businessCategory,
        profile: item.profile,
      })),

      ...filteredProDrivers.map((item) => ({
        id: item.id,
        mapType: 'PRO_DRIVER',
        title: item.profile?.profileName ?? 'Pro Driver',
        image: item.profile?.imageUrl,
        latitude: Number(item.profile.latitude),
        longitude: Number(item.profile.longitude),
        locationName: item.location,
        racingDiscipline: item.racingDiscipline,
        profile: item.profile,
      })),

      ...filteredCreators.map((item) => ({
        id: item.id,
        mapType: 'CONTENT_CREATOR',
        title: item.profile?.profileName ?? 'Content Creator',
        image: item.profile?.imageUrl,
        latitude: Number(item.profile.latitude),
        longitude: Number(item.profile.longitude),
        locationName: null,
        creatorCategory: item.creatorCategory,
        profile: item.profile,
      })),

      ...filteredSimRacing.map((item) => ({
        id: item.id,
        mapType: 'SIM_RACING',
        title: item.profile?.profileName ?? 'Sim Racing',
        image: item.profile?.imageUrl,
        latitude: Number(item.profile.latitude),
        longitude: Number(item.profile.longitude),
        locationName: null,
        profile: item.profile,
        hardwareSetup: item.hardwareSetup,
        racing: item.racing,
      })),
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

    if (type === 'business') {
      return this.prisma.businessProfile.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
    }

    if (type === 'pro_driver') {
      return this.prisma.proDriverProfile.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
    }

    if (type === 'content_creator') {
      return this.prisma.contentCreatorProfile.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
    }

    if (type === 'sim_racing') {
      return this.prisma.simRacingProfile.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      });
    }

    return null;
  }
}