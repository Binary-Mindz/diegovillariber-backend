import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ParticipationScope, RawShiftSoftware } from 'generated/prisma/enums';


export class CreateRawShiftBattleDto {
  @ApiProperty({ example: 'MINI COOPER Edit', description: 'Battle title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Best MINI Cooper edit challenge', description: 'Optional description' })
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

  @ApiPropertyOptional({ enum: RawShiftSoftware, example: RawShiftSoftware.LIGHTROOM })
  @IsOptional()
  @IsEnum(RawShiftSoftware)
  software?: RawShiftSoftware = RawShiftSoftware.ANY;

  @ApiPropertyOptional({
    example: 'Adobe Lightroom Classic',
    description: 'Use when software=OTHER or to show UI label',
  })
  @IsOptional()
  @IsString()
  softwareLabel?: string;

  @ApiPropertyOptional({ example: true, description: 'RawShift always true (keep default true)' })
  @IsOptional()
  @IsBoolean()
  requireRaw?: boolean = true;

  @ApiPropertyOptional({ example: false, description: 'Optional policy rule' })
  @IsOptional()
  @IsBoolean()
  rejectAiEdited?: boolean = false;

  @ApiPropertyOptional({ example: 10, description: 'Participants limit shown in UI' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  participantLimit?: number;

  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope = ParticipationScope.GLOBAL;

  @ApiPropertyOptional({ example: 500, description: 'Used if scope = RADIUS' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50000)
  radiusKm?: number;

  @ApiPropertyOptional({ example: 'Los Angeles' })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiPropertyOptional({ example: 34.052235 })
  @IsOptional()
  latitude?: any;

  @ApiPropertyOptional({ example: -118.243683 })
  @IsOptional()
  longitude?: any;

  @ApiPropertyOptional({ example: 'ChIJ7aVxnOTHwoARxKIntFtakKo' })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({
    example: '2026-03-01T10:00:00.000Z',
    description: 'Start date-time (UTC recommended)',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2026-03-08T10:00:00.000Z',
    description: 'End date-time',
  })
  @IsDateString()
  endDate: string;
}