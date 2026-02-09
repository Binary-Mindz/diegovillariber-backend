import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Length, MaxLength, Min } from 'class-validator';
import { BattleCategory, Preference } from 'generated/prisma/enums';

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
  @ApiProperty({ example: 'My Battle' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({ example: 'Description...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: BattleCategory, example: 'HEAD_TO_HEAD' })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ enum: Preference, example: 'Car' })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(2)
  maxParticipants?: number;

  @ApiPropertyOptional({ example: '2026-02-10T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2026-02-12T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  endTime?: string;
}