import { IsString, IsOptional, IsEnum, IsUUID, IsNotEmpty, IsBoolean, IsInt, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Media {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO'
}

export enum PostType {
  SPOTTER_POST = 'Spotter_Post',
  OWNER_POST = 'Owner_Post',
  BATTLE_POST = 'Battle_Post',
  CHALLENGE_POST = 'Challenge_Post'
}
export class CreatePostDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ enum: PostType, default: PostType.SPOTTER_POST })
  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  @ApiPropertyOptional({ description: 'Post caption' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ enum: Media, default: Media.PHOTO })
  @IsEnum(Media)
  @IsOptional()
  media?: Media;

  @ApiPropertyOptional({ description: 'Content booster flag', default: false })
  @IsBoolean()
  @IsOptional()
  contentBooster?: boolean;

  @ApiPropertyOptional({ description: 'Points for post', default: 300 })
  @IsInt()
  @Min(0)
  @IsOptional()
  point?: number;

  @ApiPropertyOptional({ description: 'Array of hashtag IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  hashtagIds?: string[];
}

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Post caption' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiPropertyOptional({ enum: Media })
  @IsEnum(Media)
  @IsOptional()
  media?: Media;

  @ApiPropertyOptional({ description: 'Content booster flag' })
  @IsBoolean()
  @IsOptional()
  contentBooster?: boolean;

  @ApiPropertyOptional({ description: 'Array of hashtag IDs', type: [String] })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  hashtagIds?: string[];
}

export class PostQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiPropertyOptional({ enum: PostType, description: 'Filter by post type' })
  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsUUID()
  @IsOptional()
  userId?: string;
}