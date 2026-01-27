import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  IsBooleanString,
} from 'class-validator';
import { PostType, VisiualStyle, ContextActivity, Subject } from 'generated/prisma/enums';

export class FeedQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;

  // ✅ text search (caption / location)
  @ApiPropertyOptional({ example: 'bmw' })
  @IsOptional()
  @IsString()
  search?: string;

  // ✅ filter by postType
  @ApiPropertyOptional({ enum: PostType, example: 'Spotter_Post' })
  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

  // ✅ filter by location (simple)
  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  location?: string;

  // ✅ boosted only
  @ApiPropertyOptional({ example: 'true', description: 'true হলে শুধু boosted post' })
  @IsOptional()
  @IsBooleanString()
  boostedOnly?: 'true' | 'false';

  // ✅ enum array filters (CSV format in query)
  // example: ?visiualStyle=Cinematic,Night_Shot
  @ApiPropertyOptional({
    example: 'Cinematic,Night_Shot',
    description: 'CSV: Cinematic,Night_Shot',
  })
  @IsOptional()
  @IsString()
  visiualStyle?: string;

  @ApiPropertyOptional({
    example: 'Car_Meet,Urban',
    description: 'CSV: Car_Meet,Urban',
  })
  @IsOptional()
  @IsString()
  contextActivity?: string;

  @ApiPropertyOptional({
    example: 'Exterior,Wheel',
    description: 'CSV: Exterior,Wheel',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  // ✅ sorting
  @ApiPropertyOptional({
    example: 'latest',
    description: 'latest | boosted | topLiked',
  })
  @IsOptional()
  @IsString()
  sort?: 'latest' | 'boosted' | 'topLiked';
}
