import { IsUUID, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateFollowDto {
  @ApiProperty({ description: 'Follower User ID (UUID)' })
  @IsUUID()
  followerId: string;

  @ApiProperty({ description: 'Following User ID (UUID)' })
  @IsUUID()
  followingId: string;
}

export class UnfollowDto {
  @ApiProperty({ description: 'Follower User ID (UUID)' })
  @IsUUID()
  followerId: string;

  @ApiProperty({ description: 'Following User ID (UUID)' })
  @IsUUID()
  followingId: string;
}

export class FollowersQueryDto {
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
}

     