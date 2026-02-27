import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLabTimeDto } from './dto/create-lab-time.dto';
import { UpdateLabTimeDto } from './dto/update-lab-time.dto';
import { LabTimeQueryDto } from './dto/lab-time-query.dto';
import { Type } from 'generated/prisma/enums';

@Injectable()
export class LabTimeService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ALLOWED_TYPES = new Set<Type>([
    Type.OWNER,
    Type.PRO_DRIVER,
    Type.CONTENT_CREATOR,
  ]);

  private async getActiveProfileOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId) {
      throw new BadRequestException('Active profile not set');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.activeProfileId },
      select: { id: true, activeType: true, userId: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (!profile.activeType || !this.ALLOWED_TYPES.has(profile.activeType)) {
      throw new ForbiddenException('Only OWNER, PRO_DRIVER, CONTENT_CREATOR can manage lap times');
    }

    return profile;
  }

  async create(userId: string, dto: CreateLabTimeDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const date = new Date(dto.dateSet);
    if (Number.isNaN(date.getTime())) throw new BadRequestException('Invalid dateSet');

    return this.prisma.labTime.create({
      data: {
        profileId: profile.id,

        trackName: dto.trackName,
        trackLayout: dto.trackLayout ?? null,
        carName: dto.carName,

        lapTimeMs: dto.lapTimeMs,
        dateSet: date,

        videoUrl: dto.videoUrl ?? null,
        telemetryMedia: dto.telemetryMedia ?? [],

        transmission: dto.transmission,
        drivetrain: dto.drivetrain,
        timeOfDay: dto.timeOfDay,
        sessionType: dto.sessionType,
        weather: dto.weather,
        trackCondition: dto.trackCondition,

        airTemp: dto.airTemp ?? null,
        trackTemp: dto.trackTemp ?? null,
        humidity: dto.humidity ?? null,

        tireBrand: dto.tireBrand,
        tireModel: dto.tireModel,
        tireCompund: dto.tireCompund,
        tireWear: dto.tireWear ?? null,
        frontTireSize: dto.frontTireSize ?? null,
        frontPressure: dto.frontPressure ?? null,
        rearTireSize: dto.rearTireSize ?? null,

        drivingStyle: dto.drivingStyle,
        fuelLoad: dto.fuelLoad ?? null,
        driverWeight: dto.driverWeight ?? null,

        additionalNotes: dto.additionalNotes,
      },
      include: {
        profile: { select: { id: true, profileName: true, activeType: true } },
      },
    });
  }

  async list(userId: string, query: LabTimeQueryDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      profileId: profile.id, // active profile lap times
      ...(query.trackName ? { trackName: { contains: query.trackName, mode: 'insensitive' } } : {}),
      ...(query.carName ? { carName: { contains: query.carName, mode: 'insensitive' } } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.labTime.findMany({
        where,
        orderBy: [{ dateSet: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.labTime.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async get(userId: string, labTimeId: string) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const lap = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
    });

    if (!lap) throw new NotFoundException('Lap time not found');
    return lap;
  }

  async update(userId: string, labTimeId: string, dto: UpdateLabTimeDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const existing = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Lap time not found');

    const payload: any = {
      ...(dto.trackName !== undefined ? { trackName: dto.trackName } : {}),
      ...(dto.trackLayout !== undefined ? { trackLayout: dto.trackLayout ?? null } : {}),
      ...(dto.carName !== undefined ? { carName: dto.carName } : {}),
      ...(dto.lapTimeMs !== undefined ? { lapTimeMs: dto.lapTimeMs } : {}),
      ...(dto.dateSet !== undefined
        ? (() => {
            const d = new Date(dto.dateSet);
            if (Number.isNaN(d.getTime())) throw new BadRequestException('Invalid dateSet');
            return { dateSet: d };
          })()
        : {}),
      ...(dto.videoUrl !== undefined ? { videoUrl: dto.videoUrl ?? null } : {}),
      ...(dto.telemetryMedia !== undefined ? { telemetryMedia: dto.telemetryMedia ?? [] } : {}),
      ...(dto.transmission !== undefined ? { transmission: dto.transmission } : {}),
      ...(dto.drivetrain !== undefined ? { drivetrain: dto.drivetrain } : {}),
      ...(dto.timeOfDay !== undefined ? { timeOfDay: dto.timeOfDay } : {}),
      ...(dto.sessionType !== undefined ? { sessionType: dto.sessionType } : {}),
      ...(dto.weather !== undefined ? { weather: dto.weather } : {}),
      ...(dto.trackCondition !== undefined ? { trackCondition: dto.trackCondition } : {}),
      ...(dto.airTemp !== undefined ? { airTemp: dto.airTemp ?? null } : {}),
      ...(dto.trackTemp !== undefined ? { trackTemp: dto.trackTemp ?? null } : {}),
      ...(dto.humidity !== undefined ? { humidity: dto.humidity ?? null } : {}),
      ...(dto.tireBrand !== undefined ? { tireBrand: dto.tireBrand } : {}),
      ...(dto.tireModel !== undefined ? { tireModel: dto.tireModel } : {}),
      ...(dto.tireCompund !== undefined ? { tireCompund: dto.tireCompund } : {}),
      ...(dto.tireWear !== undefined ? { tireWear: dto.tireWear ?? null } : {}),
      ...(dto.frontTireSize !== undefined ? { frontTireSize: dto.frontTireSize ?? null } : {}),
      ...(dto.frontPressure !== undefined ? { frontPressure: dto.frontPressure ?? null } : {}),
      ...(dto.rearTireSize !== undefined ? { rearTireSize: dto.rearTireSize ?? null } : {}),
      ...(dto.drivingStyle !== undefined ? { drivingStyle: dto.drivingStyle } : {}),
      ...(dto.fuelLoad !== undefined ? { fuelLoad: dto.fuelLoad ?? null } : {}),
      ...(dto.driverWeight !== undefined ? { driverWeight: dto.driverWeight ?? null } : {}),
      ...(dto.additionalNotes !== undefined ? { additionalNotes: dto.additionalNotes } : {}),
    };

    return this.prisma.labTime.update({
      where: { id: labTimeId },
      data: payload,
    });
  }

  async delete(userId: string, labTimeId: string) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const existing = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Lap time not found');

    await this.prisma.labTime.delete({ where: { id: labTimeId } });
    return { deleted: true };
  }
}