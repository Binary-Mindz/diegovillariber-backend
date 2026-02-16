import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { CreateAmbassadorProgramDto } from './dto/create-ambassador-program.dto';
import { UpdateAmbassadorProgramDto } from './dto/update-ambassador-program.dto';
import { AmbassadorProgramQueryDto } from './dto/ambassador-program-query.dto';
import { UpdateAmbassadorStatusDto } from './dto/update-ambassador-status.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AmbassadorStatus } from 'generated/prisma/enums';

@Injectable()
export class AmbassadorProgramService {
  constructor(private readonly prisma: PrismaService) { }

  /** USER */

  async apply(userId: string, dto: CreateAmbassadorProgramDto) {
    const existing = await this.prisma.ambassadorProgram.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('You already submitted an ambassador application.');
    }

    return this.prisma.ambassadorProgram.create({
      data: {
        userId,
        status: AmbassadorStatus.PENDING,

        motorspotName: dto.motorspotName,
        contactName: dto.contactName,
        email: dto.email,
        country: dto.country,

        instagramProfile: dto.instagramProfile ?? null,
        tiktokProfile: dto.tiktokProfile ?? null,
        youTubeChanel: dto.youTubeChanel ?? null,

        totalFollower: dto.totalFollower,
        mainCar: dto.mainCar ?? null,

        whyDoYouWant: dto.whyDoYouWant,
        releventExperience: dto.releventExperience ?? null,
        profilePhoto: dto.profilePhoto ?? null,
      },
      include: { user: true },
    });
  }

  async getMine(userId: string) {
    const app = await this.prisma.ambassadorProgram.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!app) throw new NotFoundException('Ambassador application not found.');
    return app;
  }

  async updateMine(userId: string, dto: UpdateAmbassadorProgramDto) {
    const app = await this.prisma.ambassadorProgram.findUnique({
      where: { userId },
    });

    if (!app) throw new NotFoundException('Ambassador application not found.');

    if (app.status !== AmbassadorStatus.PENDING) {
      throw new ForbiddenException('You can update only while status is PENDING.');
    }

    return this.prisma.ambassadorProgram.update({
      where: { userId },
      data: {
        motorspotName: dto.motorspotName ?? undefined,
        contactName: dto.contactName ?? undefined,
        email: dto.email ?? undefined,
        country: dto.country ?? undefined,

        instagramProfile: dto.instagramProfile ?? undefined,
        tiktokProfile: dto.tiktokProfile ?? undefined,
        youTubeChanel: dto.youTubeChanel ?? undefined,

        totalFollower: dto.totalFollower ?? undefined,
        mainCar: dto.mainCar ?? undefined,

        whyDoYouWant: dto.whyDoYouWant ?? undefined,
        releventExperience: dto.releventExperience ?? undefined,
        profilePhoto: dto.profilePhoto ?? undefined,
      },
    });
  }

  async deleteMine(userId: string) {
    const app = await this.prisma.ambassadorProgram.findUnique({
      where: { userId },
    });

    if (!app) throw new NotFoundException('Ambassador application not found.');

    await this.prisma.ambassadorProgram.delete({ where: { userId } });
    return { deleted: true };
  }

  /** ADMIN */

  async list(query: AmbassadorProgramQueryDto) {
    const page = Math.max(parseInt(query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit ?? '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) where.status = query.status;

    if (query.search?.trim()) {
      const s = query.search.trim();
      where.OR = [
        { motorspotName: { contains: s, mode: 'insensitive' } },
        { contactName: { contains: s, mode: 'insensitive' } },
        { email: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ambassadorProgram.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true },
      }),
      this.prisma.ambassadorProgram.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async getById(id: string) {
    const app = await this.prisma.ambassadorProgram.findUnique({
      where: { id },
      include: { user: true }, // optional
    });

    if (!app) throw new NotFoundException('Ambassador application not found.');
    return app;
  }

  async updateStatus(id: string, dto: UpdateAmbassadorStatusDto) {
    const app = await this.prisma.ambassadorProgram.findUnique({
      where: { id },
    });

    if (!app) {
      throw new NotFoundException('Ambassador application not found.');
    }

    const updated = await this.prisma.ambassadorProgram.update({
      where: { id },
      data: {
        status: dto.status as AmbassadorStatus,
      },
    });

    if (dto.status === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: app.userId },
        data: { role: 'AMBASSADOR' },
      });
    }

    if (dto.status === 'REJECTED') {
      await this.prisma.user.update({
        where: { id: app.userId },
        data: { role: 'USER' },
      });
    }

    return updated;
  }


}
