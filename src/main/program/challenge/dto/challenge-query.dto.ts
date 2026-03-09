import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  ChallengeCategory,
  ChallengeType,
  Preference,
  ParticipationScope,
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

  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({ example: 'sunset' })
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