import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { handleRequest } from 'src/common/helpers/handle.request';
import { NotificationService } from './notification.service';
import { RegisterDeviceTokenDto } from './dto/register-device-token.dto';
import { NotificationQueryDto } from './dto/notification-query.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationPreferenceDto } from './dto/update-notification-preference.dto';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post('device-token')
  @ApiOperation({ summary: 'Register firebase device token' })
  async registerDeviceToken(
    @GetUser('userId') userId: string,
    @Body() dto: RegisterDeviceTokenDto,
  ) {
    return handleRequest(async () => {
      return this.service.registerDeviceToken(userId, dto);
    }, 'Device token registered successfully');
  }

  @Delete('device-token')
  @ApiOperation({ summary: 'Deactivate device token' })
  async removeDeviceToken(
   @GetUser('userId') userId: string,
    @Body('token') token: string,
  ) {
    return handleRequest(async () => {
      return this.service.removeDeviceToken(userId, token);
    }, 'Device token removed successfully');
  }

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  async getMyNotifications(
   @GetUser('userId') userId: string,
    @Query() query: NotificationQueryDto,
  ) {
    return handleRequest(async () => {
      return this.service.getMyNotifications(userId, query);
    }, 'Notifications retrieved successfully');
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(
   @GetUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return handleRequest(async () => {
      return this.service.markAsRead(userId, id);
    }, 'Notification marked as read');
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive notification' })
  async archive(
   @GetUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return handleRequest(async () => {
      return this.service.archive(userId, id);
    }, 'Notification archived successfully');
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@GetUser('userId') userId: string,) {
    return handleRequest(async () => {
      return this.service.markAllAsRead(userId);
    }, 'All notifications marked as read');
  }

  @Get('preferences/me')
  @ApiOperation({ summary: 'Get my notification preferences' })
  async getMyPreference(@GetUser('userId') userId: string,) {
    return handleRequest(async () => {
      return this.service.getMyPreference(userId);
    }, 'Notification preference retrieved successfully');
  }

  @Patch('preferences/me')
  @ApiOperation({ summary: 'Update my notification preferences' })
  async updateMyPreference(
   @GetUser('userId') userId: string,
    @Body() dto: UpdateNotificationPreferenceDto,
  ) {
    return handleRequest(async () => {
      return this.service.updateMyPreference(userId, dto);
    }, 'Notification preference updated successfully');
  }

  @Post('send')
  @ApiOperation({ summary: 'Send notification manually/admin/system use' })
  async sendNotification(@Body() dto: CreateNotificationDto) {
    return handleRequest(async () => {
      return this.service.sendNotification(dto);
    }, 'Notification sent successfully');
  }

  @Post('test/me')
  @ApiOperation({ summary: 'Send test notification to myself' })
  async sendTest(@GetUser('userId') userId: string,) {
    return handleRequest(async () => {
      return this.service.sendNotification({
        userId,
        type: 'SYSTEM',
        title: 'Test Notification',
        message: 'This is a firebase test notification',
        deepLink: '/notifications',
      });
    }, 'Test notification sent successfully');
  }
}