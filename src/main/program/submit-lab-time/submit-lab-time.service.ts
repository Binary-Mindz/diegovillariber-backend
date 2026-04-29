import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateSubmitLabTimeDto } from './dto/create-submit-lab-time.dto';
import { UpdateSubmitLabTimeDto } from './dto/update-submit-lab-time.dto';
import { SubmitLabTimeQueryDto } from './dto/submit-lab-time-query.dto';
import { Type } from 'generated/prisma/enums';
import { CompareSubmitLabTimeDto } from './dto/compare-submit-lab-time.dto';
import { CompareHistoryDto } from './dto/compare-history.dto';
import { SubmitLabTimeLeaderboardDto } from './dto/submit-lab-time-leaderboard.dto';
import { ListSimRacingUsersDto } from './dto/list-sim-racing-users.dto';

@Injectable()
export class SubmitLabTimeService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveSimProfileOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId) throw new BadRequestException('Active profile not set');

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.activeProfileId },
      select: { id: true, activeType: true, profileName: true, imageUrl:true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (profile.activeType !== Type.SIM_RACING_DRIVER) {
      throw new ForbiddenException('Only SIM_RACING_DRIVER can submit lap times');
    }

    return profile;
  }

  async create(userId: string, dto: CreateSubmitLabTimeDto) {
    const profile = await this.getActiveSimProfileOrThrow(userId);

    const date = new Date(dto.sessionDate);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid sessionDate');

    return this.prisma.submitLabTime.create({
      data: {
        profileId: profile.id,

        simPlatform: dto.simPlatform,
        circuit: dto.circuit,

        carName: dto.carName ?? null,
        carClass: dto.carClass,

        lapTimeMs: dto.lapTimeMs,
        sessionDate: date,

        videoLink: dto.videoLink ?? null,
        telemetrySource: dto.telemetrySource,
        telemetryData: dto.telemetryData ?? null,

        tractionControl: dto.tractionControl ?? false,
        abs: dto.abs ?? false,
        stability: dto.stability ?? false,
        autoClutch: dto.autoClutch ?? false,
        racingLine: dto.racingLine ?? false,
      },
      include: {
        profile: { select: { id: true, profileName: true, activeType: true } },
      },
    });
  }

  async list(userId: string, query: SubmitLabTimeQueryDto) {
    const profile = await this.getActiveSimProfileOrThrow(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      profileId: profile.id,
      ...(query.simPlatform ? { simPlatform: query.simPlatform } : {}),
      ...(query.circuit ? { circuit: query.circuit } : {}),
      ...(query.carClass ? { carClass: query.carClass } : {}),
      ...(query.q ? { carName: { contains: query.q, mode: 'insensitive' } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.submitLabTime.findMany({
        where,
        orderBy: [{ sessionDate: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.submitLabTime.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async get(userId: string, id: string) {
    const profile = await this.getActiveSimProfileOrThrow(userId);

    const lap = await this.prisma.submitLabTime.findFirst({
      where: { id, profileId: profile.id },
    });

    if (!lap) throw new NotFoundException('SubmitLabTime not found');
    return lap;
  }

  async update(userId: string, id: string, dto: UpdateSubmitLabTimeDto) {
    const profile = await this.getActiveSimProfileOrThrow(userId);

    const existing = await this.prisma.submitLabTime.findFirst({
      where: { id, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('SubmitLabTime not found');

    const payload: any = {
      ...(dto.simPlatform !== undefined ? { simPlatform: dto.simPlatform } : {}),
      ...(dto.circuit !== undefined ? { circuit: dto.circuit } : {}),
      ...(dto.carName !== undefined ? { carName: dto.carName ?? null } : {}),
      ...(dto.carClass !== undefined ? { carClass: dto.carClass } : {}),
      ...(dto.lapTimeMs !== undefined ? { lapTimeMs: dto.lapTimeMs } : {}),
      ...(dto.sessionDate !== undefined
        ? (() => {
            const d = new Date(dto.sessionDate);
            if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid sessionDate');
            return { sessionDate: d };
          })()
        : {}),
      ...(dto.videoLink !== undefined ? { videoLink: dto.videoLink ?? null } : {}),
      ...(dto.telemetrySource !== undefined ? { telemetrySource: dto.telemetrySource } : {}),
      ...(dto.telemetryData !== undefined ? { telemetryData: dto.telemetryData ?? null } : {}),
      ...(dto.tractionControl !== undefined ? { tractionControl: dto.tractionControl } : {}),
      ...(dto.abs !== undefined ? { abs: dto.abs } : {}),
      ...(dto.stability !== undefined ? { stability: dto.stability } : {}),
      ...(dto.autoClutch !== undefined ? { autoClutch: dto.autoClutch } : {}),
      ...(dto.racingLine !== undefined ? { racingLine: dto.racingLine } : {}),
    };

    return this.prisma.submitLabTime.update({
      where: { id },
      data: payload,
    });
  }

  async delete(userId: string, id: string) {
    const profile = await this.getActiveSimProfileOrThrow(userId);

    const existing = await this.prisma.submitLabTime.findFirst({
      where: { id, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('SubmitLabTime not found');

    await this.prisma.submitLabTime.delete({ where: { id } });
    return { deleted: true };
  }

  async compareBest(userId: string, dto: CompareSubmitLabTimeDto) {
  if (dto.otherUserId === userId) {
    throw new BadRequestException('Cannot compare with yourself');
  }

  const me = await this.getActiveSimProfileOrThrow(userId);
  const other = await this.getActiveSimProfileOrThrow(dto.otherUserId);

  const candidates = [
    {
      ...(dto.simPlatform ? { simPlatform: dto.simPlatform } : {}),
      ...(dto.circuit ? { circuit: dto.circuit } : {}),
      ...(dto.carClass ? { carClass: dto.carClass } : {}),
    },
    {
      ...(dto.simPlatform ? { simPlatform: dto.simPlatform } : {}),
      ...(dto.circuit ? { circuit: dto.circuit } : {}),
    },
    {
      ...(dto.simPlatform ? { simPlatform: dto.simPlatform } : {}),
    },
    {},
  ].filter((item, index, arr) => {
    const key = JSON.stringify(item);
    return arr.findIndex((x) => JSON.stringify(x) === key) === index;
  });

  for (const whereCommon of candidates) {
    const [myBest, otherBest] = await this.prisma.$transaction([
      this.prisma.submitLabTime.findFirst({
        where: { profileId: me.id, ...whereCommon },
        orderBy: [{ lapTimeMs: 'asc' }, { sessionDate: 'desc' }],
      }),
      this.prisma.submitLabTime.findFirst({
        where: { profileId: other.id, ...whereCommon },
        orderBy: [{ lapTimeMs: 'asc' }, { sessionDate: 'desc' }],
      }),
    ]);

    if (myBest && otherBest) {
      return {
        filter: whereCommon,
        fallbackUsed: JSON.stringify(whereCommon) !== JSON.stringify({
          ...(dto.simPlatform ? { simPlatform: dto.simPlatform } : {}),
          ...(dto.circuit ? { circuit: dto.circuit } : {}),
          ...(dto.carClass ? { carClass: dto.carClass } : {}),
        }),
        me: {
          profileId: me.id,
          profileName: me.profileName ?? null,
          best: myBest,
        },
        other: {
          profileId: other.id,
          profileName: other.profileName ?? null,
          best: otherBest,
        },
        gapMs: otherBest.lapTimeMs - myBest.lapTimeMs,
      };
    }
  }

  throw new NotFoundException('No comparable lap found for both users');
}

  // -------------------------
  // 2) Compare history (trend)
  // -------------------------
  // async compareHistory(userId: string, dto: CompareHistoryDto) {
  //   if (dto.otherUserId === userId) throw new BadRequestException('Cannot compare with yourself');

  //   const take = dto.take ?? 20;

  //   const me = await this.getActiveSimProfileOrThrow(userId);
  //   const other = await this.getActiveSimProfileOrThrow(dto.otherUserId);

  //   const whereCommon: any = {
  //     simPlatform: dto.simPlatform,
  //     circuit: dto.circuit,
  //     carClass: dto.carClass,
  //   };

  //   const [myLaps, otherLaps] = await this.prisma.$transaction([
  //     this.prisma.submitLabTime.findMany({
  //       where: { profileId: me.id, ...whereCommon },
  //       orderBy: [{ sessionDate: 'desc' }, { createdAt: 'desc' }],
  //       take,
  //     }),
  //     this.prisma.submitLabTime.findMany({
  //       where: { profileId: other.id, ...whereCommon },
  //       orderBy: [{ sessionDate: 'desc' }, { createdAt: 'desc' }],
  //       take,
  //     }),
  //   ]);

  //   return {
  //     filter: whereCommon,
  //     take,
  //     me: { profileId: me.id, profileName: me.profileName ?? null, laps: myLaps },
  //     other: { profileId: other.id, profileName: other.profileName ?? null, laps: otherLaps },
  //   };
  // }

  // async leaderboard(userId: string, dto: SubmitLabTimeLeaderboardDto) {
  //   const limit = dto.limit ?? 50;

  //   const me = await this.getActiveSimProfileOrThrow(userId);
  //   const otherProfile = dto.otherUserId ? await this.getActiveSimProfileOrThrow(dto.otherUserId) : null;
  //   const rows = await this.prisma.$queryRaw<
  //     Array<{
  //       id: string;
  //       profileId: string;
  //       lapTimeMs: number;
  //       sessionDate: Date;
  //       carName: string | null;
  //     }>
  //   >`
  //     SELECT DISTINCT ON ("profileId")
  //       "id", "profileId", "lapTimeMs", "sessionDate", "carName"
  //     FROM "SubmitLabTime"
  //     WHERE "simPlatform" = ${dto.simPlatform}
  //       AND "circuit" = ${dto.circuit}
  //       AND "carClass" = ${dto.carClass}
  //     ORDER BY "profileId", "lapTimeMs" ASC, "sessionDate" DESC
  //   `;

  //   // Now sort globally by best lap
  //   const bestSorted = rows
  //     .sort((a, b) => a.lapTimeMs - b.lapTimeMs)
  //     .slice(0, limit);

  //   const profileIds = bestSorted.map((r) => r.profileId);

  //   const profiles = await this.prisma.profile.findMany({
  //     where: { id: { in: profileIds } },
  //     select: { id: true, profileName: true, imageUrl: true },
  //   });

  //   const profileMap = new Map(profiles.map((p) => [p.id, p]));

  //   const items = bestSorted.map((r, idx) => ({
  //     rank: idx + 1,
  //     profile: profileMap.get(r.profileId) ?? { id: r.profileId, profileName: null, imageUrl: null },
  //     best: r,
  //   }));

  //   const myRank = items.find((x) => x.profile.id === me.id)?.rank ?? null;
  //   const otherRank =
  //     otherProfile ? items.find((x) => x.profile.id === otherProfile.id)?.rank ?? null : null;

  //   return {
  //     filter: { simPlatform: dto.simPlatform, circuit: dto.circuit, carClass: dto.carClass },
  //     limit,
  //     myRank,
  //     otherRank,
  //     items,
  //   };
  // }

   async getSimRacingUsers(currentUserId: string, query: ListSimRacingUsersDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const skip = (page - 1) * limit;
  const q = query.q?.trim();

  const where: any = {
    activeType: Type.SIM_RACING_DRIVER,
    suspend: false,
    userId: {
      not: currentUserId,
    },
    simRacing: {
      isNot: null,
    },
    ...(q
      ? {
          OR: [
            {
              profileName: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              user: {
                email: {
                  contains: q,
                  mode: 'insensitive',
                },
              },
            },
          ],
        }
      : {}),
  };

  const [items, total] = await this.prisma.$transaction([
    this.prisma.profile.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ profileName: 'asc' }],
      select: {
        id: true,
        profileName: true,
        imageUrl: true,
        activeType: true,
        preference: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        simRacing: {
          select: {
            id: true,
            profileType: true,
            hardwareSetup: true,
            displayAndPcSetup: true,
            drivingAssistant: true,
            racing: true,
            setupDescription: true,
          },
        },
      },
    }),
    this.prisma.profile.count({ where }),
  ]);

  return {
    page,
    limit,
    total,
    items: items.map((item) => ({
      userId: item.user.id,
      email: item.user.email,
      profileId: item.id,
      profileName: item.profileName,
      imageUrl: item.imageUrl,
      activeType: item.activeType,
      preference: item.preference,
      simRacing: item.simRacing,
    })),
  };
}

}