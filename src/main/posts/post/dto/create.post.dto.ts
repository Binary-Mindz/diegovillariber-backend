import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PostType } from 'generated/prisma/enums';


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
}
