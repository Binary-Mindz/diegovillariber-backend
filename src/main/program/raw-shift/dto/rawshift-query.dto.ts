import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { RawShiftStatus } from 'generated/prisma/enums';


export enum RawShiftTab {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
}

export class RawShiftQueryDto {
  @ApiPropertyOptional({
    enum: RawShiftTab,
    example: RawShiftTab.ACTIVE,
    description: 'Tab filter for list screen',
  })
  @IsOptional()
  @IsEnum(RawShiftTab)
  tab?: RawShiftTab;

  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: RawShiftStatus,
    example: RawShiftStatus.PUBLISHED,
    description: 'Optional direct status filter (advanced)',
  })
  @IsOptional()
  @IsEnum(RawShiftStatus)
  status?: RawShiftStatus;
}