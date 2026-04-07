import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { UserPointSourceType } from 'generated/prisma/enums';


@Injectable()
export class UserPointService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyPointSummary(userId: string) {
    if (!userId) {
      throw new BadRequestException('User id is missing from request');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        totalPoints: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      userId: user.id,
      totalPoints: user.totalPoints,
    };
  }

  async getMyPointHistory(userId: string, page = 1, limit = 10) {
    if (!userId) {
      throw new BadRequestException('User id is missing from request');
    }

    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1');
    }

    if (limit < 1 || limit > 50) {
      throw new BadRequestException('limit must be between 1 and 50');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const skip = (page - 1) * limit;
    const where = { userId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.userPoint.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          userId: true,
          sourceType: true,
          sourceId: true,
          earnBy: true,
          points: true,
          note: true,
          createdAt: true,
        },
      }),
      this.prisma.userPoint.count({ where }),
    ]);

    const mapped = items.map((item) => ({
      id: item.id,
      userId: item.userId,
      points: item.points,
      sourceType: item.sourceType as UserPointSourceType,
      sourceId: item.sourceId,
      earnBy: item.earnBy,
      note: item.note,
      createdAt: item.createdAt,
    }));

    return {
      data: mapped,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}