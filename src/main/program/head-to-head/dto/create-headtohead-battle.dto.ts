// src/main/program/head-to-head/dto/create-headtohead-battle.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  AutoInviteScope,
  BattleAccessType,
  BattleCategory,
  CameraRequirement,
  ParticipationScope,
  Preference,
} from 'generated/prisma/enums';

export class CreateHeadToHeadBattleDto {
  @ApiProperty({ example: 'STANCE Battle - BMW vs Audi' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({ example: 'Show your best stance shot' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/covers/h2h.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: BattleCategory, example: BattleCategory.STYLE_BATTLE })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ example: 'BMW,AUDI', description: 'optional brand filter' })
  @IsOptional()
  @IsString()
  brandFilter?: string;

  @ApiProperty({ example: 'Free Car Wash Coupon', description: 'required in schema' })
  @IsString()
  winPrize!: string;

  @ApiProperty({ example: 'IMAGE', description: 'required in schema. Example: IMAGE / VIDEO / BOTH' })
  @IsString()
  uploadImageOrVideo!: string;

  // Requirements
  @ApiPropertyOptional({ enum: CameraRequirement, example: CameraRequirement.ANY })
  @IsOptional()
  @IsEnum(CameraRequirement)
  cameraRequirement?: CameraRequirement;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requireTrueShotVerified?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  rejectEditedPhotos?: boolean;

  // Access
  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({ enum: AutoInviteScope, example: AutoInviteScope.SAME_CITY })
  @IsOptional()
  @IsEnum(AutoInviteScope)
  autoInviteScope?: AutoInviteScope;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 2000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2000)
  autoInviteCount?: number;

  // Location
  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Max(20000)
  radiusKm?: number;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiPropertyOptional({ example: 23.8103 })
  @IsOptional()
  latitude?: any;

  @ApiPropertyOptional({ example: 90.4125 })
  @IsOptional()
  longitude?: any;

  @ApiPropertyOptional({ example: 'ChIJ...' })
  @IsOptional()
  @IsString()
  placeId?: string;

  // Timing
  @ApiProperty({ example: '2026-03-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate!: Date;

  @ApiProperty({ example: '2026-03-08T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  endDate!: Date;
}