import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateLegalNoticeDto } from './dto/create-legal-notice.dto';
import { LegalNoticeTarget } from 'generated/prisma/enums';


@Injectable()
export class AdminLegalNoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLegalNoticeDto) {
  if (!dto.profileId) throw new ForbiddenException('profileId is required');


  if (dto.targetType === LegalNoticeTarget.CAR) {
    if (!dto.carId) throw new BadRequestException('carId is required for CAR legal notice');
    if (dto.bikeId) throw new BadRequestException('bikeId must be null for CAR legal notice');
  }

  if (dto.targetType === LegalNoticeTarget.BIKE) {
    if (!dto.bikeId) throw new BadRequestException('bikeId is required for BIKE legal notice');
    if (dto.carId) throw new BadRequestException('carId must be null for BIKE legal notice');
  }
  const profile = await this.prisma.profile.findUnique({
    where: { id: dto.profileId },
    select: { id: true },
  });
  if (!profile) throw new NotFoundException('Profile not found');

  if (dto.targetType === LegalNoticeTarget.CAR) {
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId! },
      select: { id: true, profileId: true },
    });
    if (!car) throw new NotFoundException('Car not found');
    if (car.profileId !== dto.profileId) throw new ForbiddenException('Car does not belong to the provided profile');
  }

  if (dto.targetType === LegalNoticeTarget.BIKE) {
    const bike = await this.prisma.bike.findUnique({
      where: { id: dto.bikeId! },
      select: { id: true, profileId: true },
    });
    if (!bike) throw new NotFoundException('Bike not found');
    if (bike.profileId !== dto.profileId) throw new ForbiddenException('Bike does not belong to the provided profile');
  }


  return this.prisma.legalNotice.create({
    data: {
      profileId: dto.profileId,
      targetType: dto.targetType, 

      carId: dto.targetType === LegalNoticeTarget.CAR ? dto.carId! : null,
      bikeId: dto.targetType === LegalNoticeTarget.BIKE ? dto.bikeId! : null,

      location: dto.location,
      date: new Date(dto.date),

      description: dto.description ?? null,
      media: dto.media ?? null,
      witnessName: dto.witnessName ?? null,
      witnessEmail: dto.witnessEmail ?? null,
      witnessPhone: dto.witnessPhone ?? null,
    },
    include: {
      profile: { select: { id: true, profileName: true, activeType: true } },
      car: { select: { id: true, displayName: true, make: true, model: true } },
      bike: { select: { id: true, displayName: true, make: true, model: true } },
    },
  });
}

  async list(profileId?: string) {
    return this.prisma.legalNotice.findMany({
      where: profileId ? { profileId } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        profile: {
          select: {
            id: true,
            profileName: true,
            activeType: true,
          },
        },
        car: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });
  }

  async getByCar(carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return this.prisma.legalNotice.findMany({
      where: { carId },
      orderBy: { createdAt: 'desc' },
      include: {
        profile: true,
      },
    });
  }

  async getOne(id: string) {
    const notice = await this.prisma.legalNotice.findUnique({
      where: { id },
      include: {
        profile: true,
        car: true,
      },
    });

    if (!notice) {
      throw new NotFoundException('Legal notice not found');
    }

    return notice;
  }
}