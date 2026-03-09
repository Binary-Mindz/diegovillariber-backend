import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  Brand,
  ChallengeCategory,
  ChallengeStatus,
  ChallengeType,
  DeviceType,
  ParticipationScope,
  Preference,
  QuickPreset,
} from 'generated/prisma/enums';

export class CreateChallengeDto {
  @ApiProperty({ example: 'Sunset Car Shot Challenge' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Take the best sunset photo of your car.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: ChallengeType, example: ChallengeType.PHOTO })
  @IsEnum(ChallengeType)
  type: ChallengeType;

  @ApiProperty({ enum: ChallengeCategory, example: ChallengeCategory.COMMUNITY })
  @IsEnum(ChallengeCategory)
  category: ChallengeCategory;

  @ApiProperty({ enum: Preference, example: Preference.CAR })
  @IsEnum(Preference)
  preference: Preference;

  @ApiPropertyOptional({ example: 'https://cdn.app/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({ example: 10, description: 'Required when participationScope=RADIUS' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  radiusKm?: number;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiPropertyOptional({ example: 23.8103 })
  @IsOptional()
  @Type(() => Number)
  latitude?: number;

  @ApiPropertyOptional({ example: 90.4125 })
  @IsOptional()
  @Type(() => Number)
  longitude?: number;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-03-10T23:59:59.000Z' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 'Champion Badge + 500 Points' })
  @IsString()
  challengePrize: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  enableDeviceRestriction?: boolean;

  @ApiPropertyOptional({ enum: QuickPreset, example: QuickPreset.NONE_ALL_DEVICE })
  @IsOptional()
  @IsEnum(QuickPreset)
  quickPreset?: QuickPreset;

  @ApiPropertyOptional({ enum: DeviceType, example: DeviceType.MOBILE })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({ enum: Brand, example: Brand.APPLE })
  @IsOptional()
  @IsEnum(Brand)
  brand?: Brand;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requireTrueShotVerification?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  rejectEditedPhotos?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  maxEntriesPerUser?: number;

  @ApiPropertyOptional({ enum: ChallengeStatus, example: ChallengeStatus.UPCOMING })
  @IsOptional()
  @IsEnum(ChallengeStatus)
  status?: ChallengeStatus;
}