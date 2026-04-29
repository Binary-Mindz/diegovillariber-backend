import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { NotificationType } from 'generated/prisma/enums';

export class UpdateNotificationPreferenceDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ enum: NotificationType, isArray: true })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(NotificationType, { each: true })
  mutedTypes?: NotificationType[];

  @ApiPropertyOptional({ example: '22:00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  quietStart?: string;

  @ApiPropertyOptional({ example: '07:00' })
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/)
  quietEnd?: string;

  @ApiPropertyOptional({ example: 'Asia/Dhaka' })
  @IsOptional()
  @IsString()
  timezone?: string;
}