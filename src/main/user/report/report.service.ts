import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ReportDto } from './dto/report-dto';
import { NotificationEntityType, NotificationType, ReportType, Role } from '../../../../prisma/generated/prisma/enums';
import { NotificationService } from '../../notification/notification.service';
@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) { }

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
        reason: dto.reason,
        description: dto.description ?? null
      },
    });

    try {
      const admin = await this.prisma.user.findFirst({
        where: { role: Role.ADMIN },
        select: { id: true },
      });

      if (admin) {
        await this.notificationService.sendNotification({
          userId: admin.id,
          actorUserId: userId,
          type: NotificationType.ADMIN,
          title: `New Report: ${dto.targetType}`,
          message: `A user has reported a ${dto.targetType.toLowerCase()} for: ${dto.reason}.`,
          entityType: dto.targetType === ReportType.POST ? NotificationEntityType.POST : NotificationEntityType.PROFILE,
          entityId: dto.targetId,
        });
      }
    } catch (error) {
      console.error('Failed to send admin report notification:', error);
    }

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