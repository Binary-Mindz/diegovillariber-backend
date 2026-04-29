import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ArrayMaxSize } from 'class-validator';

export class SubmitRawShiftEntryDto {
  @ApiProperty({
    example: 'https://cdn.app.com/raw/123.dng',
    description: 'RAW/Unedited upload URL',
  })
  @IsString()
  rawMediaUrl!: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/raw/thumb-123.jpg' })
  @IsOptional()
  @IsString()
  rawThumbnailUrl?: string;

  @ApiProperty({
    example: 'https://cdn.app.com/edited/123.jpg',
    description: 'Final edited image upload URL',
  })
  @IsString()
  editedMediaUrl!: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/edited/thumb-123.jpg' })
  @IsOptional()
  @IsString()
  editedThumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'My best edit 😄', description: 'Optional caption' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({
    example: ['cars', 'editing', 'rawshift'],
    isArray: true,
    description: 'Optional hashtags array',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  hashtags?: string[];
}