import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { RegisterFcmTokenDto } from './dto/register-fcm-token.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { MarkReadParamDto } from './dto/mark-read.dto';
import { UpdateNotificationPrefsDto } from './dto/update-prefs.dto';
import { NotificationChannel, NotificationStatus } from './notification.types';
import { NotificationsService } from './notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  // ---------- Token ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('fcm-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register FCM token' })
  registerToken(@GetUser('userId') userId: string, @Body() dto: RegisterFcmTokenDto) {
    return handleRequest(() => this.service.registerFcmToken(userId, dto), 'Token saved');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('fcm-token/:token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unregister FCM token' })
  unregisterToken(@GetUser('userId') userId: string, @Param('token') token: string) {
    return handleRequest(() => this.service.unregisterFcmToken(userId, token), 'Token removed');
  }

  // ---------- Prefs ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('prefs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification preferences' })
  getPrefs(@GetUser('userId') userId: string) {
    return handleRequest(() => this.service.getPrefs(userId), 'Prefs fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('prefs')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update notification preferences' })
  updatePrefs(@GetUser('userId') userId: string, @Body() dto: UpdateNotificationPrefsDto) {
    return handleRequest(() => this.service.updatePrefs(userId, dto), 'Prefs updated');
  }

  // ---------- List / count ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'List notifications (in-app)' })
  list(@GetUser('userId') userId: string, @Query() query: NotificationQueryDto) {
    return handleRequest(() => this.service.list(userId, query), 'Notifications fetched');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unread count' })
  unreadCount(@GetUser('userId') userId: string) {
    return handleRequest(() => this.service.unreadCount(userId), 'Unread count');
  }

  // ---------- Read / archive / delete ----------
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark one notification as read' })
  markRead(@GetUser('userId') userId: string, @Param() param: MarkReadParamDto) {
    return handleRequest(() => this.service.markRead(userId, param.id), 'Marked as read');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllRead(@GetUser('userId') userId: string) {
    return handleRequest(() => this.service.markAllRead(userId), 'All marked as read');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Archive notification' })
  archive(@GetUser('userId') userId: string, @Param() param: MarkReadParamDto) {
    return handleRequest(() => this.service.archive(userId, param.id), 'Archived');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete notification' })
  delete(@GetUser('userId') userId: string, @Param() param: MarkReadParamDto) {
    return handleRequest(() => this.service.delete(userId, param.id), 'Deleted');
  }

  // ---------- Create (internal / admin / test) ----------
  // You can protect this with Admin guard later
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create notification (server-side / testing)' })
  create(@GetUser('userId') _userId: string, @Body() dto: CreateNotificationDto) {
    return handleRequest(
      () =>
        this.service.notify(
          {
            userId: dto.userId,
            actorUserId: dto.actorUserId ?? null,
            type: dto.type,
            channel: dto.channel ?? NotificationChannel.IN_APP,
            status: dto.status ?? NotificationStatus.UNREAD,
            title: dto.title ?? null,
            message: dto.message ?? null,
            deepLink: dto.deepLink ?? null,
            entityType: dto.entityType ?? null,
            entityId: dto.entityId ?? null,
            groupKey: dto.groupKey ?? null,
            meta: dto.meta ?? null,
          },
          dto.pushAlso ?? true,
        ),
      'Notification created',
    );
  }
}