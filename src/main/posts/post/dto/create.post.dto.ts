import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  PostType,
  VisiualStyle,
  ContextActivity,
  Subject,
} from 'generated/prisma/enums';

export class CreatePostDto {
  @ApiPropertyOptional({ enum: PostType, example: 'Spotter_Post' })
  @IsOptional()
  @IsEnum(PostType)
  postType?: PostType;

  @ApiPropertyOptional({ example: 'caption...' })
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/img.jpg' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;

  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  postLocation?: string;

  @ApiPropertyOptional({ example: 'PUBLIC' })
  @IsOptional()
  @IsString()
  locationVisibility?: string;

  @ApiPropertyOptional({
    example: false,
    description:
      'If true, user will be charged 300 points (requires totalPoints >= 300).',
  })
  @IsOptional()
  @IsBoolean()
  contentBooster?: boolean;

  // ✅ NEW: enum arrays
  @ApiPropertyOptional({
    isArray: true,
    enum: VisiualStyle,
    example: ['Cinematic', 'Night_Shot', 'Wide_Angle'],
    description: 'Visual style tags for the post',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(VisiualStyle, { each: true })
  visiualStyle?: VisiualStyle[];

  @ApiPropertyOptional({
    isArray: true,
    enum: ContextActivity,
    example: ['Car_Meet', 'Highway', 'Urban'],
    description: 'Context or activity where the post was created',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ContextActivity, { each: true })
  contextActivity?: ContextActivity[];

  @ApiPropertyOptional({
    isArray: true,
    enum: Subject,
    example: ['Exterior', 'Wheel', 'Driver_Portrait'],
    description: 'Main subjects shown in the post',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Subject, { each: true })
  subject?: Subject[];
}
