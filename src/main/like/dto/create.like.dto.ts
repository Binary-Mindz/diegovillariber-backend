
import { IsUUID, IsNotEmpty, IsEnum, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum PostType {
  SPOTTER_POST = 'Spotter_Post',
  OWNER_POST = 'Owner_Post',
  BATTLE_POST = 'Battle_Post',
  CHALLENGE_POST = 'Challenge_Post'
}

export class CreateLikeDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Post ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ enum: PostType, description: 'Post type' })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;
}

export class UnlikeDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Post ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @ApiProperty({ enum: PostType, description: 'Post type' })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;
}

export class LikesQueryDto {
  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ enum: PostType, description: 'Filter by post type' })
  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;
}

 