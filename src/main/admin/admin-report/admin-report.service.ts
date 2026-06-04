import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminReportQueryDto } from './dto/admin-report.query.dto';
import { NotificationEntityType, NotificationType, Prisma, ReportType } from 'generated/prisma/client';
import { NotificationService } from '../../notification/notification.service';




@Injectable()
export class AdminReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async getReports(query: AdminReportQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ReportWhereInput = {
      ...(query.targetType && { targetType: query.targetType }),
      ...(query.userId && { userId: query.userId }),
      ...(query.targetId && { targetId: query.targetId }),
      ...(query.search && {
        description: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),
    };

    const [reports, total] = await this.prisma.$transaction([
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              posts:{
                select:{
                  mediaUrl:true,
                  caption:true,
                  postType:true,
                }
              },
              profile:{
                select:{
                  profileName:true,
                  imageUrl:true
                }
              }
            },
          },
        },
      }),
      this.prisma.report.count({ where }),
    ]);

    return {
      data: reports,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSingleReport(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      include: {
          user: {
            select: {
              id: true,
              email: true,
              posts:{
                select:{
                  mediaUrl:true,
                  caption:true,
                  postType:true,
                }
              },
              profile:{
                select:{
                  profileName:true,
                  imageUrl:true
                }
              }
            },
          },
        },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }

  async deleteReport(id: string) {
    const report = await this.prisma.report.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    await this.prisma.report.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }

  async resolveCopyrightPost(targetId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: targetId },
      select: { userId: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const deleteResult = await this.prisma.report.deleteMany({
      where: {
        targetId,
        targetType: ReportType.POST,
        reason: 'COPYRIGHT',
      },
    });

    if (deleteResult.count === 0) {
      throw new NotFoundException('No copyright reports found for this post');
    }

    try {
      await this.notificationService.sendNotification({
        userId: post.userId,
        type: NotificationType.SYSTEM,
        title: 'Post Restored',
        message: 'Great news! Your post has been reviewed by the admin and successfully restored to the feed.',
        entityType: NotificationEntityType.POST,
        entityId: targetId,
      });
    } catch (error) {
      console.error('Failed to send post restoration notification:', error);
    }

    return { restored: true, totalReportsRemoved: deleteResult.count };
  }
}