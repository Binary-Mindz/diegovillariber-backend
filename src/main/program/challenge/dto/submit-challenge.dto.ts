import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { MediaType } from 'generated/prisma/enums';

export class SubmissionMediaItemDto {
  @ApiProperty({ enum: MediaType, example: MediaType.IMAGE })
  @IsEnum(MediaType)
  type!: MediaType;

  @ApiProperty({ example: 'https://cdn.app/media.jpg' })
  @IsString()
  url!: string;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(36000)
  durationSec?: number;

  @ApiPropertyOptional({ example: 'https://cdn.app/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ example: 'raw_1', description: 'Use same pairKey for RAW+EDITED pairing if needed' })
  @IsOptional()
  @IsString()
  pairKey?: string;
}

export class SubmitChallengeDto {
  @ApiPropertyOptional({ example: 'My best shot!' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: ['#sunset', '#car'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  hashtags?: string[];

  @ApiProperty({ type: [SubmissionMediaItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionMediaItemDto)
  media!: SubmissionMediaItemDto[];
}