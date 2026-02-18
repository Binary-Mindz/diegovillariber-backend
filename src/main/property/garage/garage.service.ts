import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateGarageDto } from './dto/create-garage.dto';
import { UpdateGarageDto } from './dto/update-garage.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class GarageService {
  constructor(private prisma: PrismaService) {}

  async createGarage(userId: string, dto: CreateGarageDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.garage.create({
      data: {
        ...dto,
        profileId: profile.id,
      },
    });
  }

  async getUserGarages(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.garage.findMany({
      where: { profileId: profile.id },
      orderBy: { id: 'desc' },
    });
  }

  async getGarage(garageId: string) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: garageId },
      include: {
        cars: true,
      },
    });

    if (!garage) {
      throw new NotFoundException('Garage not found');
    }

    return garage;
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
