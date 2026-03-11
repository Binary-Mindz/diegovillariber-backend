import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { EventType } from 'generated/prisma/enums';

export class CreateEventDto {
  @ApiProperty({ example: 'https://cdn.site.com/event-cover.jpg' })
  @IsString()
  coverImage: string;

  @ApiProperty({ example: 'Night Drift Session' })
  @IsString()
  eventTitle: string;

  @ApiPropertyOptional({ example: 'Professional drift practice session' })
  @IsOptional()
  @IsString()
  description?: string;

 
  @ApiPropertyOptional({ example: 'Dhaka Race Track' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'Purbachal, Dhaka, Bangladesh' })
  @IsOptional()
  @IsString()
  locationAddress?: string;

  @ApiPropertyOptional({
    example: 23.8103,
    description: 'Latitude of the event location',
  })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({
    example: 90.4125,
    description: 'Longitude of the event location',
  })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({
    example: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
    description: 'Google place id or map place id',
  })
  @IsOptional()
  @IsString()
  placeId?: string;
  @ApiPropertyOptional({ example: 'https://example.com/event' })
  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @ApiProperty({ example: 500 })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    enum: EventType,
    example: EventType.Drift_Session,
    description: 'Optional. Default is Race (Prisma model).',
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiProperty({ example: '2026-02-15T18:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-02-15T22:00:00Z' })
  @IsDateString()
  endDate: string;
}