import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsOptional()
  @IsEnum(TimeRangeFilter)
  timeRange?: TimeRangeFilter = TimeRangeFilter.ALLTIME;

  @IsOptional()
  @IsEnum(DeviceCategoryFilter)
  deviceCategory?: DeviceCategoryFilter = DeviceCategoryFilter.ALL;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}