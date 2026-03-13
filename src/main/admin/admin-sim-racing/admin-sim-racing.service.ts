import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminSimRacingService {
  constructor(private readonly prisma: PrismaService) {}

  private formatSimPlatform(platform: string): string {
  const map: Record<string, string> = {
    iRacing: 'iRacing',
    Assetto_Corsa: 'Assetto Corsa',
    Assetto_Corsa_Competizione: 'ACC',
    Gran_Turismo_7: 'GT7',
    rFactor_2: 'rFactor 2',
    Automobilista_2: 'Automobilista 2',
    F1_23: 'F1 23',
    Richard_Burns_Rally: 'Richard Burns Rally',
    Dirt_Rally_2: 'DiRT Rally 2',
    RaceRoom: 'RaceRoom',
  };

  return map[platform] ?? platform.replace(/_/g, ' ');
}

  async getSimRacingStatistics() {
  const [
    virtualCircuits,
    simRacers,
    lapTimes,
    leagueMembersRaw,
  ] = await this.prisma.$transaction([
    this.prisma.virtualSimRacingEvent.count(),
    this.prisma.simRacingProfile.count(),
    this.prisma.submitLabTime.count(),
    this.prisma.simRacingProfile.findMany({
      select: {
        profile: {
          select: {
            userId: true,
          },
        },
      },
    }),
  ]);

  const uniqueLeagueMembers = new Set(
    leagueMembersRaw.map((item) => item.profile.userId),
  ).size;

  return {
    section: 'Sim Racing Statistics',
    description: 'Total sim racers & active users',
    metrics: {
      virtualCircuits: {
        label: 'Virtual Circuits',
        value: virtualCircuits,
      },
      simRacers: {
        label: 'Sim Racers',
        value: simRacers,
      },
      lapTimes: {
        label: 'Lap Times',
        value: lapTimes,
      },
      leagueMembers: {
        label: 'League Members',
        value: uniqueLeagueMembers,
      },
    },
    generatedAt: new Date(),
  };
}

async getPopularSims() {
  const [eventPlatforms, lapTimePlatforms] = await this.prisma.$transaction([
    this.prisma.virtualSimRacingEvent.groupBy({
      by: ['simPlatform'],
      orderBy: {
        simPlatform: 'asc',
      },
      _count: {
        _all: true,
      },
    }),
    this.prisma.submitLabTime.groupBy({
      by: ['simPlatform'],
      orderBy: {
        simPlatform: 'asc',
      },
      _count: {
        _all: true,
      },
    }),
  ]);

  const getGroupCount = (count: unknown): number => {
    if (count && typeof count === 'object' && '_all' in count) {
      return (count as { _all?: number })._all ?? 0;
    }
    return 0;
  };

  const platformMap = new Map<string, number>();

  eventPlatforms.forEach((item) => {
    const current = platformMap.get(item.simPlatform) ?? 0;
    platformMap.set(item.simPlatform, current + getGroupCount(item._count));
  });

  lapTimePlatforms.forEach((item) => {
    const current = platformMap.get(item.simPlatform) ?? 0;
    platformMap.set(item.simPlatform, current + getGroupCount(item._count));
  });

  const items = Array.from(platformMap.entries())
    .map(([platform, total]) => ({
      label: this.formatSimPlatform(platform),
      value: total,
      description: `${total} racers`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return {
    section: 'Popular Sims',
    items,
    generatedAt: new Date(),
  };
}



}