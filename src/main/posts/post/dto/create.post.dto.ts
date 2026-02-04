import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  IsNumberString,
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

  // Optional: formatted location string (you already have it)
  @ApiPropertyOptional({ example: 'Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  postLocation?: string;

  // ✅ NEW: location fields (map picked)
  @ApiPropertyOptional({ example: 'Bashundhara City' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationName?: string;

  @ApiPropertyOptional({ example: 'Panthapath, Dhaka 1205, Bangladesh' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  locationAddress?: string;

  // Prisma Decimal -> best practice: send as string
  @ApiPropertyOptional({ example: '23.751600' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  latitude?: string;

  @ApiPropertyOptional({ example: '90.392700' })
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  longitude?: string;

  @ApiPropertyOptional({ example: 'ChIJ....' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  placeId?: string;

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

  // ✅ enum arrays
  @ApiPropertyOptional({
    isArray: true,
    enum: VisiualStyle,
    example: ['Cinematic', 'Night_Shot', 'Wide_Angle'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(VisiualStyle, { each: true })
  visiualStyle?: VisiualStyle[];

  @ApiPropertyOptional({
    isArray: true,
    enum: ContextActivity,
    example: ['Car_Meet', 'Highway', 'Urban'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(ContextActivity, { each: true })
  contextActivity?: ContextActivity[];

  @ApiPropertyOptional({
    isArray: true,
    enum: Subject,
    example: ['Exterior', 'Wheel', 'Driver_Portrait'],
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Subject, { each: true })
  subject?: Subject[];
}
