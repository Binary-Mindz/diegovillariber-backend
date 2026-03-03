import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { NotificationChannel, NotificationEntityType, NotificationStatus, NotificationType } from '../notification.types';

export class CreateNotificationDto {
  @ApiProperty({ example: 'receiver-user-uuid' })
  @IsUUID()
  userId: string;

  @ApiPropertyOptional({ example: 'actor-user-uuid' })
  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.LAPTIME_BEATEN })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ enum: NotificationChannel, example: NotificationChannel.IN_APP })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiPropertyOptional({ enum: NotificationStatus, example: NotificationStatus.UNREAD })
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;

  @ApiPropertyOptional({ example: 'Your lap got beaten!' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional({ example: 'Someone beat your lap on Spa (DRIFT).' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'onyx://lap/submit-lap-uuid' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  deepLink?: string;

  @ApiPropertyOptional({ enum: NotificationEntityType, example: NotificationEntityType.SUBMIT_LAB_TIME })
  @IsOptional()
  @IsEnum(NotificationEntityType)
  entityType?: NotificationEntityType;

  @ApiPropertyOptional({ example: 'entity-uuid' })
  @IsOptional()
  @IsString()
  entityId?: string;

  @ApiPropertyOptional({ example: 'LIKE:POST:post-uuid' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  groupKey?: string;

  @ApiPropertyOptional({ example: { circuit: 'Spa_Francorchamps', gapMs: 1200 } })
  @IsOptional()
  @IsObject()
  meta?: Record<string, any>;

  @ApiPropertyOptional({ example: true, description: 'Also send FCM push' })
  @IsOptional()
  @IsBoolean()
  pushAlso?: boolean;
}