import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  BattleAccessType,
  BattleCategory,
  Preference,
  ParticipationScope,
} from 'generated/prisma/enums';

export enum HeadToHeadTab {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

export class HeadToHeadQueryDto {
  @ApiPropertyOptional({ enum: HeadToHeadTab, example: HeadToHeadTab.ACTIVE })
  @IsOptional()
  @IsEnum(HeadToHeadTab)
  tab?: HeadToHeadTab;

  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({ enum: BattleCategory, example: BattleCategory.STYLE_BATTLE })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({
    example: 'bmw',
    description: 'Search by battle title / description / location / brand / creator name / creator email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}