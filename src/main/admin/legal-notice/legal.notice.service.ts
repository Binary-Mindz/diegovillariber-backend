import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateLegalNoticeDto } from './dto/create-legal-notice.dto';


@Injectable()
export class AdminLegalNoticeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLegalNoticeDto) {
    if (!dto.profileId) {
      throw new ForbiddenException('profileId is required');
    }

    // 1️⃣ Check profile exists
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
      select: { id: true },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    // 2️⃣ Check car exists
    const car = await this.prisma.car.findUnique({
      where: { id: dto.carId },
      select: { id: true, profileId: true },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // 3️⃣ Ensure car belongs to selected profile
    if (car.profileId !== dto.profileId) {
      throw new ForbiddenException(
        'Car does not belong to the provided profile',
      );
    }

    // 4️⃣ Create legal notice
    return this.prisma.legalNotice.create({
      data: {
        profileId: dto.profileId,
        carId: dto.carId,
        location: dto.location,
        date: new Date(dto.date),
        description: dto.description,
        media: dto.media,
        witnessName: dto.witnessName,
        witnessEmail: dto.witnessEmail,
        witnessPhone: dto.witnessPhone,
      },
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
            make: true,
            model: true,
          },
        },
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