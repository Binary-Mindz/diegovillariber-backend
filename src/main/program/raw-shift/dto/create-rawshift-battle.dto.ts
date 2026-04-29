// src/main/program/raw-shift/dto/create-rawshift-battle.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { RawShiftStatus } from 'generated/prisma/enums';

export class CreateRawShiftBattleDto {
  @ApiProperty({ example: 'MINI COOPER Edit', description: 'Battle title' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: 'Best MINI Cooper edit challenge',
    description: 'Optional description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/covers/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/banners/banner.jpg' })
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Participants limit shown in UI',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  participantLimit?: number;

  @ApiProperty({
    example: 'RAW+EDIT (2 uploads)',
    description: 'RawShift rule/info (required in schema)',
  })
  @IsString()
  rawShiftPrice!: string;

  @ApiPropertyOptional({
    example: 'Los Angeles',
    description: 'Simple location string (schema field)',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    example: '2026-03-01T10:00:00.000Z',
    description: 'Start date-time (UTC recommended)',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: '2026-03-08T10:00:00.000Z',
    description: 'End date-time',
  })
  @IsDateString()
  endDate!: string;
}