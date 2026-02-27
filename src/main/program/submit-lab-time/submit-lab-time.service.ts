import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateSubmitLabTimeDto } from './dto/create-submit-lab-time.dto';
import { UpdateSubmitLabTimeDto } from './dto/update-submit-lab-time.dto';
import { SubmitLabTimeQueryDto } from './dto/submit-lab-time-query.dto';
import { Type } from 'generated/prisma/enums';

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
      select: { id: true, activeType: true },
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
}