import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import {
  BattleAccessType,
  BattleStatus,
  BattleCategory,
  Preference,
} from 'generated/prisma/enums';

export class HeadToHeadQueryDto {
  @ApiPropertyOptional({ enum: BattleStatus, example: BattleStatus.RUNNING })
  @IsOptional()
  @IsEnum(BattleStatus)
  status?: BattleStatus;

  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({
    enum: BattleCategory,
    example: BattleCategory.STYLE_BATTLE,
  })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({
    example: 'bmw',
    description: 'Search by battle title / description / location / brand filter / creator name / creator email',
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