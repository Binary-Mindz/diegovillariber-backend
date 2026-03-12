import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { RawShiftStatus } from 'generated/prisma/enums';

export enum RawShiftTab {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

export class RawShiftQueryDto {
  @ApiPropertyOptional({ enum: RawShiftTab, default: RawShiftTab.ALL })
  @IsOptional()
  @IsEnum(RawShiftTab)
  tab?: RawShiftTab = RawShiftTab.ALL;

  // optional: direct status filter (overrides tab)
  @ApiPropertyOptional({ enum: RawShiftStatus })
  @IsOptional()
  @IsEnum(RawShiftStatus)
  status?: RawShiftStatus;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}