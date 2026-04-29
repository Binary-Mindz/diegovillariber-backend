import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
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
  ChallengeType,
  DeviceType,
  ParticipationScope,
  Preference,
  QuickPreset,
} from 'generated/prisma/enums';

export enum ChallengeTab {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

export class ChallengeQueryDto {
  @ApiPropertyOptional({ enum: ChallengeTab, example: ChallengeTab.ACTIVE })
  @IsOptional()
  @IsEnum(ChallengeTab)
  tab?: ChallengeTab;

  @ApiPropertyOptional({ enum: ChallengeCategory, example: ChallengeCategory.DAILY })
  @IsOptional()
  @IsEnum(ChallengeCategory)
  category?: ChallengeCategory;

  @ApiPropertyOptional({ enum: ChallengeType, example: ChallengeType.PHOTO })
  @IsOptional()
  @IsEnum(ChallengeType)
  type?: ChallengeType;

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({
    enum: ParticipationScope,
    example: ParticipationScope.GLOBAL,
  })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({ enum: DeviceType, example: DeviceType.MOBILE })
  @IsOptional()
  @IsEnum(DeviceType)
  deviceType?: DeviceType;

  @ApiPropertyOptional({ enum: QuickPreset, example: QuickPreset.NONE_ALL_DEVICE })
  @IsOptional()
  @IsEnum(QuickPreset)
  quickPreset?: QuickPreset;

  @ApiPropertyOptional({ enum: Brand, example: Brand.APPLE })
  @IsOptional()
  @IsEnum(Brand)
  brand?: Brand;

  @ApiPropertyOptional({
    example: 'true',
    description: 'Filter only challenges with device restriction enabled',
  })
  @IsOptional()
  @IsBooleanString()
  enableDeviceRestriction?: string;

  @ApiPropertyOptional({
    example: 'sunset',
    description: 'Search by challenge title / description / location / prize / creator name / creator email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}