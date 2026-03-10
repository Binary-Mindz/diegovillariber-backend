import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { BattleAccessType, SplitScreenBattleCategory, SplitScreenMatchmakingMode, SplitScreenPreferenceMode } from 'generated/prisma/enums';
export class CreateSplitScreenBattleDto {
  @ApiPropertyOptional({ example: 'Split Screen Arena - Styles' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Best street build wins' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: SplitScreenBattleCategory, example: SplitScreenBattleCategory.STYLES })
  @IsEnum(SplitScreenBattleCategory)
  category: SplitScreenBattleCategory;

  @ApiPropertyOptional({ enum: SplitScreenMatchmakingMode, example: SplitScreenMatchmakingMode.ANYONE })
  @IsOptional()
  @IsEnum(SplitScreenMatchmakingMode)
  matchmakingMode?: SplitScreenMatchmakingMode;

  @ApiPropertyOptional({ enum: SplitScreenPreferenceMode, example: SplitScreenPreferenceMode.ANY_CAR_BRAND })
  @IsOptional()
  @IsEnum(SplitScreenPreferenceMode)
  preferenceMode?: SplitScreenPreferenceMode;

  @ApiPropertyOptional({ example: 'BMW', description: 'Required when preferenceMode = SPECIFIC_BRAND' })
  @IsOptional()
  @IsString()
  preferredBrand?: string;

  @ApiPropertyOptional({ example: 30, description: 'Required when preferenceMode = SIMILAR_PRESTIGE' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  similarPrestigeRange?: number;

  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  entryCost?: number;

  @ApiPropertyOptional({ example: 450 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  winnerPointReward?: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(168)
  votingDurationHours?: number;

  @ApiPropertyOptional({ example: '2026-03-15T10:00:00.000Z' })
  @IsOptional()
  startsAt?: Date;

  @ApiPropertyOptional({ example: 'e1f1a167-4d5f-4cf9-a82a-8d95a20721f4' })
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @ApiPropertyOptional({ example: 'BMW' })
  @IsOptional()
  @IsString()
  carBrand?: string;

  @ApiPropertyOptional({ example: 'M4' })
  @IsOptional()
  @IsString()
  carModel?: string;

  @ApiPropertyOptional({ example: 2020 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  @Max(2100)
  carYear?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/car.jpg' })
  @IsOptional()
  @IsString()
  carImageUrl?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prestigePoints?: number;
}