import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min, ValidateNested } from 'class-validator';
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
  @ApiPropertyOptional({
    isArray: true,
    example: [
      '4d9c8f3b-1b2a-4d2f-9c41-6f8a4a2b3c10',
      '8b1b9d1a-2a1f-4d2a-9b11-9a8a7a6b5c44',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  hashtagIds?: string[];

  @ApiProperty({ type: [SubmissionMediaItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmissionMediaItemDto)
  media!: SubmissionMediaItemDto[];
}