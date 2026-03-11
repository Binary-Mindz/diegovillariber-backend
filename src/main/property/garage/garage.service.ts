import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetAllGaragesQueryDto } from './dto/get-all-garage-query.dto';

@Injectable()
export class GarageService {
  constructor(private prisma: PrismaService) {}

  async getUserGarages(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.garage.findMany({
      where: { profileId: profile.id },
      include:{cars: true, bikes: true},
      orderBy: { id: 'desc' },
    });
  }

  async getGarage(garageId: string) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: garageId },
      include: {
        cars: true,
        bikes: true
      },
    });

    if (!garage) {
      throw new NotFoundException('Garage not found');
    }

    return garage;
  }

  async getAllGarages(query: GetAllGaragesQueryDto) {
  const { page = 1, limit = 10 } = query;

  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const [items, total] = await this.prisma.$transaction([
    this.prisma.garage.findMany({
      skip,
      take: safeLimit,
      orderBy: { id: 'desc' },
      include: {
        profile: true,
        cars: true,
        bikes: true,
      },
    }),
    this.prisma.garage.count(),
  ]);

  return {
    items,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

  async updateGarage(userId: string, garageId: string, dto: UpdateGarageDto) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: garageId },
      include: { profile: true },
    });

    if (!garage) {
      throw new NotFoundException('Garage not found');
    }

    if (garage.profile.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this garage');
    }

    return this.prisma.garage.update({
      where: { id: garageId },
      data: dto,
    });
  }

  async deleteGarage(userId: string, garageId: string) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: garageId },
      include: { profile: true },
    });

    if (!garage) {
      throw new NotFoundException('Garage not found');
    }

    if (garage.profile.userId !== userId) {
      throw new ForbiddenException('You are not the owner of this garage');
    }

    return this.prisma.garage.delete({
      where: { id: garageId },
    });
  }
}
