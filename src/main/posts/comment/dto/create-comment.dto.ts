import {
  IsUUID,
  IsEnum,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostType } from 'generated/prisma/enums';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Post ID where the comment will be added',
    example: '7e3525f6-a27b-41db-bdaa-e80bd4877af4',
  })
  @IsUUID()
  postId!: string;

  @ApiProperty({
    description: 'Type of the post',
    enum: PostType,
    example: PostType.Spotter_Post,
  })
  @IsEnum(PostType)
  postType!: PostType;

  @ApiProperty({
    description: 'Comment text',
    example: 'Awesome shot! Love the angle 🔥',
  })
  @IsString()
  @MinLength(1)
  content!: string;

  @ApiPropertyOptional({
    description: 'Parent comment ID (only required for reply)',
    example: '9f1c3d21-91e4-4f2c-9c22-ec2cbb9f8a55',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
