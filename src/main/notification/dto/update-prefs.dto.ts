import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { NotificationType } from '../notification.types';

export class UpdateNotificationPrefsDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ example: ['ADMIN', 'SYSTEM'], isArray: true })
  @IsOptional()
  @IsArray()
  mutedTypes?: NotificationType[];

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  quietStart?: string;

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  quietEnd?: string;

  @ApiPropertyOptional({ example: 'Asia/Dhaka' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  timezone?: string;
}