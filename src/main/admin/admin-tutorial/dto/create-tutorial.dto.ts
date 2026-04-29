import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTutorialDto {
  @ApiProperty({
    example: 'feed',
    description: 'Section code of the tutorial, e.g. feed, map, arena',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sectionCode!: string;

  @ApiProperty({
    example: 'How to create a feed post',
    description: 'Tutorial title',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({
    example: 'This tutorial explains how users can create a new feed post.',
    description: 'Tutorial description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=abcd1234',
    description: 'Tutorial video URL',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  videoUrl!: string;

  @ApiProperty({
    example: 1,
    description: 'Display order within a section and version',
  })
  @IsInt()
  @Min(1)
  order!: number;

  @ApiProperty({
    example: 10,
    description: 'Learn app version',
  })
  @IsInt()
  @Min(1)
  learnVersion!: number;
}