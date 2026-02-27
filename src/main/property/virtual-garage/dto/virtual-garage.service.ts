import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { Type } from 'generated/prisma/enums';
import { CreateVirtualGarageDto } from './create-virtual-garage.dto';
import { VirtualGarageQueryDto } from './virtual-garage-query.dto';
import { UpdateVirtualGarageDto } from './update-virtual-garage.dto';

@Injectable()
export class VirtualGarageService {
  constructor(private readonly prisma: PrismaService) {}

  private async getActiveSimRacingProfileOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId) throw new BadRequestException('Active profile not set');

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.activeProfileId },
      select: { id: true, activeType: true, userId: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (profile.activeType !== Type.SIM_RACING_DRIVER) {
      throw new ForbiddenException('Only SIM_RACING_DRIVER can manage virtual garage');
    }

    return profile;
  }

  async create(userId: string, dto: CreateVirtualGarageDto) {
    const profile = await this.getActiveSimRacingProfileOrThrow(userId);

    return this.prisma.virtualGarage.create({
      data: {
        profileId: profile.id,
        simPlatform: dto.simPlatform,
        carMake: dto.carMake,
        carModel: dto.carModel,
        makeYear: dto.makeYear,
        carClass: dto.carClass,
        livery: dto.livery ?? null,
        teamName: dto.teamName ?? null,
        carNumber: dto.carNumber ?? null,
        transmission: dto.transmission,
        notes: dto.notes ?? null,
      },
      include: {
        profile: { select: { id: true, profileName: true, activeType: true } },
      },
    });
  }

  async list(userId: string, query: VirtualGarageQueryDto) {
    const profile = await this.getActiveSimRacingProfileOrThrow(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      profileId: profile.id,
      ...(query.simPlatform ? { simPlatform: query.simPlatform } : {}),
      ...(query.carClass ? { carClass: query.carClass } : {}),
      ...(query.q
        ? {
            OR: [
              { carMake: { contains: query.q, mode: 'insensitive' } },
              { carModel: { contains: query.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.virtualGarage.findMany({
        where,
        orderBy: [{ carMake: 'asc' }, { carModel: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.virtualGarage.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async get(userId: string, id: string) {
    const profile = await this.getActiveSimRacingProfileOrThrow(userId);

    const garage = await this.prisma.virtualGarage.findFirst({
      where: { id, profileId: profile.id },
    });

    if (!garage) throw new NotFoundException('Virtual garage car not found');
    return garage;
  }

  async update(userId: string, id: string, dto: UpdateVirtualGarageDto) {
    const profile = await this.getActiveSimRacingProfileOrThrow(userId);

    const existing = await this.prisma.virtualGarage.findFirst({
      where: { id, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Virtual garage car not found');

    const payload: any = {
      ...(dto.simPlatform !== undefined ? { simPlatform: dto.simPlatform } : {}),
      ...(dto.carMake !== undefined ? { carMake: dto.carMake } : {}),
      ...(dto.carModel !== undefined ? { carModel: dto.carModel } : {}),
      ...(dto.makeYear !== undefined ? { makeYear: dto.makeYear } : {}),
      ...(dto.carClass !== undefined ? { carClass: dto.carClass } : {}),
      ...(dto.livery !== undefined ? { livery: dto.livery ?? null } : {}),
      ...(dto.teamName !== undefined ? { teamName: dto.teamName ?? null } : {}),
      ...(dto.carNumber !== undefined ? { carNumber: dto.carNumber ?? null } : {}),
      ...(dto.transmission !== undefined ? { transmission: dto.transmission } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes ?? null } : {}),
    };

    return this.prisma.virtualGarage.update({
      where: { id },
      data: payload,
    });
  }

  async delete(userId: string, id: string) {
    const profile = await this.getActiveSimRacingProfileOrThrow(userId);

    const existing = await this.prisma.virtualGarage.findFirst({
      where: { id, profileId: profile.id },
      select: { id: true },
    });
    if (!existing) throw new NotFoundException('Virtual garage car not found');

    await this.prisma.virtualGarage.delete({ where: { id } });
    return { deleted: true };
  }
}