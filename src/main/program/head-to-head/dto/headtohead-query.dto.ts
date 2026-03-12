import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

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

  @ApiPropertyOptional({ enum: BattleCategory, example: BattleCategory.STYLE_BATTLE })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({ example: 'bmw' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}