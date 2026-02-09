import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
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
  startDate: Date;

  @ApiProperty({ example: '2026-02-15T22:00:00Z' })
  @IsDateString()
  endDate: Date;
}