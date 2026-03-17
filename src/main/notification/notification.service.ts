import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { NotificationChannel, NotificationStatus, NotificationType, Prisma } from 'generated/prisma/client';
import { handlePrismaError } from '@/common/utils/error.handler';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly firebase: FirebaseService,
  ) {}

  async registerDeviceToken(userId: string, dto: RegisterDeviceTokenDto) {
  const { token, platform } = dto;

  return this.prisma.deviceToken.upsert({
    where: {
      token,
    },
    update: {
      platform: platform ?? null,
      isActive: true,
      user: {
        connect: { id: userId },
      },
    },
    create: {
      token,
      platform: platform ?? null,
      isActive: true,
      user: {
        connect: { id: userId },
      },
    },
  });
}

  async removeDeviceToken(userId: string, token: string) {
    const existing = await this.prisma.deviceToken.findUnique({
      where: { token },
    });

    if (!existing) {
      throw new NotFoundException('Device token not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('Not your device token');
    }

    return this.prisma.deviceToken.update({
      where: { token },
      data: { isActive: false },
    });
  }

  async getMyNotifications(userId: string, query: NotificationQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {
      userId,
      ...(query.status ? { status: query.status } : {}),
    };

    const [data, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, status: NotificationStatus.UNREAD },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    };
  }

  async markAsRead(userId: string, id: string) {
    const existing = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('Not your notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });
  }

  async archive(userId: string, id: string) {
    const existing = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Notification not found');
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException('Not your notification');
    }

    return this.prisma.notification.update({
      where: { id },
      data: {
        status: NotificationStatus.ARCHIVED,
      },
    });
  }

  async deleteNotification(userId: string, id: string) {
  const existing = await this.prisma.notification.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new NotFoundException('Notification not found');
  }

  if (existing.userId !== userId) {
    throw new ForbiddenException('Not your notification');
  }

  await this.prisma.notification.delete({
    where: { id },
  });

  return {
    id,
    deleted: true,
  };
} 

  async markAllAsRead(userId: string) {
    const res = await this.prisma.notification.updateMany({
      where: {
        userId,
        status: NotificationStatus.UNREAD,
      },
      data: {
        status: NotificationStatus.READ,
        readAt: new Date(),
      },
    });

    return res;
  }

  async getMyPreference(userId: string) {
    try{  
      let pref = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!pref) {
      pref = await this.prisma.notificationPreference.create({
        data: { userId },
      });
    }

    return pref;}catch(error){
      handlePrismaError(error)
    }
  }

  async updateMyPreference(
    userId: string,
    dto: UpdateNotificationPreferenceDto,
  ) {
    await this.getMyPreference(userId);

    return this.prisma.notificationPreference.update({
      where: { userId },
      data: {
        ...(dto.inAppEnabled !== undefined && { inAppEnabled: dto.inAppEnabled }),
        ...(dto.pushEnabled !== undefined && { pushEnabled: dto.pushEnabled }),
        ...(dto.emailEnabled !== undefined && { emailEnabled: dto.emailEnabled }),
        ...(dto.mutedTypes !== undefined && { mutedTypes: dto.mutedTypes }),
        ...(dto.quietStart !== undefined && { quietStart: dto.quietStart }),
        ...(dto.quietEnd !== undefined && { quietEnd: dto.quietEnd }),
        ...(dto.timezone !== undefined && { timezone: dto.timezone }),
      },
    });
  }

  private isMutedType(
    mutedTypes: NotificationType[],
    type: NotificationType,
  ): boolean {
    return mutedTypes.includes(type);
  }

  private isWithinQuietHours(
    quietStart?: string | null,
    quietEnd?: string | null,
  ): boolean {
    if (!quietStart || !quietEnd) return false;

    const now = new Date();
    const current = now.getHours() * 60 + now.getMinutes();

    const [startHour, startMinute] = quietStart.split(':').map(Number);
    const [endHour, endMinute] = quietEnd.split(':').map(Number);

    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

    if (start < end) {
      return current >= start && current < end;
    }

    return current >= start || current < end;
  }

  async sendNotification(dto: CreateNotificationDto) {
    const pref = await this.getMyPreference(dto.userId);

    if (this.isMutedType(pref.mutedTypes, dto.type)) {
      return {
        skipped: true,
        reason: 'Notification type muted by user',
      };
    }

    const shouldCreateInApp =
      dto.channel === NotificationChannel.PUSH
        ? pref.inAppEnabled
        : pref.inAppEnabled;

    const shouldPush =
      (dto.channel === NotificationChannel.PUSH ||
        dto.channel === NotificationChannel.IN_APP ||
        dto.channel === undefined) &&
      pref.pushEnabled &&
      !this.isWithinQuietHours(pref.quietStart, pref.quietEnd);

    let notification = null;

    if (shouldCreateInApp) {
      notification = await this.prisma.notification.create({
        data: {
          userId: dto.userId,
          actorUserId: dto.actorUserId ?? null,
          type: dto.type,
          channel: dto.channel ?? NotificationChannel.IN_APP,
          status: NotificationStatus.UNREAD,
          title: dto.title ?? null,
          message: dto.message ?? null,
          deepLink: dto.deepLink ?? null,
          entityType: dto.entityType ?? null,
          entityId: dto.entityId ?? null,
          meta: dto.meta ?? Prisma.JsonNull,
          groupKey: dto.groupKey ?? null,
        },
      });
    }

    let pushResult: {
      sent: number;
      failed: number;
      note?: string;
    } | null = null;

    if (shouldPush) {
      const tokens = await this.prisma.deviceToken.findMany({
        where: {
          userId: dto.userId,
          isActive: true,
        },
        select: { token: true },
      });

      if (tokens.length === 0) {
        pushResult = {
          sent: 0,
          failed: 0,
          note: 'No active device token',
        };
      } else {
        const res = await this.firebase.messaging().sendEachForMulticast({
          tokens: tokens.map((item) => item.token),
          notification: {
            title: dto.title ?? 'Notification',
            body: dto.message ?? '',
          },
          data: {
            type: dto.type,
            userId: dto.userId,
            actorUserId: dto.actorUserId ?? '',
            entityType: dto.entityType ?? '',
            entityId: dto.entityId ?? '',
            deepLink: dto.deepLink ?? '',
            notificationId: notification?.id ?? '',
          },
        });

        const invalidTokens: string[] = [];

        res.responses.forEach((response, index) => {
          if (!response.success) {
            const errorCode =
              response.error instanceof Error && 'code' in response.error
                ? String((response.error as Error & { code?: string }).code)
                : undefined;

            if (
              errorCode === 'messaging/registration-token-not-registered' ||
              errorCode === 'messaging/invalid-registration-token'
            ) {
              invalidTokens.push(tokens[index].token);
            }
          }
        });

        if (invalidTokens.length > 0) {
          await this.prisma.deviceToken.updateMany({
            where: {
              token: { in: invalidTokens },
            },
            data: {
              isActive: false,
            },
          });
        }

        pushResult = {
          sent: res.successCount,
          failed: res.failureCount,
        };
      }
    }

    return {
      notification,
      push: pushResult,
    };
  }

  async sendSystemNotification(userId: string, title: string, message: string) {
    return this.sendNotification({
      userId,
      type: NotificationType.SYSTEM,
      title,
      message,
      channel: NotificationChannel.IN_APP,
    });
  }
}