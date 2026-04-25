import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Prisma } from 'generated/prisma/client';
import { NotificationChannel, NotificationEntityType, NotificationType } from 'generated/prisma/enums';

export class CreateNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  userId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  actorUserId?: string;

  @ApiPropertyOptional({ enum: NotificationType })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiPropertyOptional({ enum: NotificationChannel })
  @IsOptional()
  @IsEnum(NotificationChannel)
  channel?: NotificationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deepLink?: string;

  @ApiPropertyOptional({ enum: NotificationEntityType })
  @IsOptional()
  @IsEnum(NotificationEntityType)
  entityType?: NotificationEntityType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  entityId?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  meta?: Prisma.InputJsonValue;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupKey?: string;
}