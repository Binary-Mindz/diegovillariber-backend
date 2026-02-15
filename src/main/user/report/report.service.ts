import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ReportDto } from './dto/report-dto';


@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async createReport(userId: string, dto: ReportDto) {
    const existing = await this.prisma.report.findUnique({
      where: {
        userId_targetId_targetType: {
          userId,
          targetId: dto.targetId,
          targetType: dto.targetType,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('You have already reported this item');
    }

    const report = await this.prisma.report.create({
      data: {
        userId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        description: dto.description ?? null
      },
    });

    return report;
  }

  async removeReport(userId: string, targetId: string, targetType: string) {
    const report = await this.prisma.report.findUnique({
      where: {
        userId_targetId_targetType: {
          userId,
          targetId,
          targetType: targetType as any,
        },
      },
    });

    if (!report) {
      throw new BadRequestException('Report not found');
    }

    await this.prisma.report.delete({
      where: {
        userId_targetId_targetType: {
          userId,
          targetId,
          targetType: targetType as any,
        },
      },
    });

    return { removed: true };
  }

  async getUserReports(userId: string) {
    return this.prisma.report.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
