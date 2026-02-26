import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePrizeDto } from './dto/create-prize.dto';
import { UpdatePrizeDto } from './dto/update.prize.dto';


@Injectable()
export class PrizeService {
  constructor(private readonly prisma: PrismaService) {}

  async listPrizes() {
    return this.prisma.prize.findMany({
      orderBy: { id: 'desc' },
      include: { createdBy: { select: { id: true, email: true } } },
    });
  }

  async getPrize(id: string) {
    const prize = await this.prisma.prize.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, email: true } } },
    });
    if (!prize) throw new NotFoundException('Prize not found');
    return prize;
  }

  async createPrize(adminUserId: string, dto: CreatePrizeDto) {
    const name = dto.prizeName?.trim();
    if (!name) throw new BadRequestException('prizeName is required');

    return this.prisma.prize.create({
      data: {
        prizeName: name,
        createdById: adminUserId,
      },
    });
  }

  async updatePrize(id: string, dto: UpdatePrizeDto) {
    const existing = await this.prisma.prize.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Prize not found');

    const name = dto.prizeName?.trim();

    return this.prisma.prize.update({
      where: { id },
      data: {
        ...(dto.prizeName !== undefined ? { prizeName: name } : {}),
      },
    });
  }

  async deletePrize(id: string) {
    const existing = await this.prisma.prize.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Prize not found');

    await this.prisma.prize.delete({ where: { id } });
    return true;
  }
}