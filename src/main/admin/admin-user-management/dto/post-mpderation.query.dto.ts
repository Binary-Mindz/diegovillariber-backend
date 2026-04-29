import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum ModerationMediaFilter {
  ALL = 'ALL',
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export class PostModerationQueryDto {
  @ApiPropertyOptional({ enum: ModerationMediaFilter, default: ModerationMediaFilter.ALL })
  @IsOptional()
  @IsEnum(ModerationMediaFilter)
  media?: ModerationMediaFilter = ModerationMediaFilter.ALL;

  @ApiPropertyOptional({ example: 'bestcar', description: 'search by caption/hashtag/email/name' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)   
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)   
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}