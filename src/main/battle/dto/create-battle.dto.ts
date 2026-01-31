import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export enum BattleStatusDto {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
}

export enum BattleCategoryDto {
  HEAD_TO_HEAD = 'HEAD_TO_HEAD',
  RAW_SHIFT = 'RAW_SHIFT',
  SPLIT_SCREEN = 'SPLIT_SCREEN'
}

export enum PreferenceDto {
  Car = 'Car',
  Motorbike = 'Motorbike',
  Both = 'Both'

}

export class CreateBattleDto {
  @ApiProperty({ example: 'Supercar Battle Season 1' })
  @IsString()
  @Length(2, 120)
  title: string;

  @ApiPropertyOptional({ example: 'Post your best supercar shot and win!' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/battle-cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: BattleCategoryDto, example: BattleCategoryDto.HEAD_TO_HEAD })
  @IsOptional()
  @IsEnum(BattleCategoryDto)
  battleCategory?: BattleCategoryDto;

  @ApiPropertyOptional({ enum: PreferenceDto, example: PreferenceDto.Car })
  @IsOptional()
  @IsEnum(PreferenceDto)
  preference?: PreferenceDto;

  @ApiPropertyOptional({ example: 10, description: 'Default 10, max 10 allowed' })
  @IsOptional()
  @IsInt()
  @Min(2)
  maxParticipants?: number;

  @ApiPropertyOptional({ example: '2026-02-05T12:00:00.000Z' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2026-02-10T12:00:00.000Z' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ example: '7d', description: 'duration text (optional)' })
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional({ example: 'BDT 5000 + Trophy' })
  @IsOptional()
  @IsString()
  prize?: string;
}
