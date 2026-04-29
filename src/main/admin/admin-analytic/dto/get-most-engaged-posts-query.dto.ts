import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PostType } from 'generated/prisma/enums';

export class GetMostEngagedPostsQueryDto {
  @ApiPropertyOptional({
    example: 'emma',
    description: 'Search by user name, email, phone, or post caption',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: PostType,
    example: PostType.ContentCretor_Post,
  })
  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

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