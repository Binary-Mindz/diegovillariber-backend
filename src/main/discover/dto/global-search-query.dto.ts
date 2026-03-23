import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export enum GlobalSearchType {
  ALL = 'ALL',
  USER = 'USER',
  POST = 'POST',
  EVENT = 'EVENT',
}

export class GlobalSearchDto {
  @ApiPropertyOptional({
    example: 'lamborghini',
    description: 'Global search keyword',
  })
  @IsOptional()
@IsString()
@Transform(({ value }) => value?.trim())
@MinLength(1)
keyword?: string;

  @ApiPropertyOptional({
    enum: GlobalSearchType,
    example: GlobalSearchType.ALL,
    description: 'Search target type',
    default: GlobalSearchType.ALL,
  })
  @IsOptional()
  @IsEnum(GlobalSearchType)
  type?: GlobalSearchType = GlobalSearchType.ALL;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Items per section',
    default: 10,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}