import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum TimeRangeFilter {
  TODAY = 'today',
  WEEK = 'week',
  MONTH = 'month',
  ALLTIME = 'alltime',
}

export enum DeviceCategoryFilter {
  ALL = 'all',
  CAMERA = 'camera',
  MOBILE = 'mobile',
}

export class TopBrandsQueryDto {
  @ApiPropertyOptional({
    enum: TimeRangeFilter,
    example: TimeRangeFilter.ALLTIME,
    default: TimeRangeFilter.ALLTIME,
    description: 'Filter brands by time range.',
  })
  @IsOptional()
  @IsEnum(TimeRangeFilter)
  timeRange?: TimeRangeFilter = TimeRangeFilter.ALLTIME;

  @ApiPropertyOptional({
    enum: DeviceCategoryFilter,
    example: DeviceCategoryFilter.ALL,
    default: DeviceCategoryFilter.ALL,
    description: 'Filter by device category.',
  })
  @IsOptional()
  @IsEnum(DeviceCategoryFilter)
  deviceCategory?: DeviceCategoryFilter = DeviceCategoryFilter.ALL;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    minimum: 1,
    description: 'Maximum number of brands to return.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}