import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatus, EventType } from 'generated/prisma/enums';


export class GetEventsQueryDto {
  @ApiPropertyOptional({
    enum: EventStatus,
    example: EventStatus.APPROVED,
    description: 'Filter by event status',
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    enum: EventType,
    example: EventType.Race,
    description: 'Filter by event type',
  })
  @IsOptional()
  @IsEnum(EventType)
  type?: EventType;

  @ApiPropertyOptional({
    example: '3f8a6c9e-9e1b-4b1e-8fcb-2a1e9bcb5f11',
    description: 'Filter by owner id (UUID)',
  })
  @IsOptional()
  @IsUUID()
  ownerId?: string;

  @ApiPropertyOptional({
    example: 'dhaka',
    description: 'Search by title, location, description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: '2026-02-01T00:00:00.000Z',
    description: 'Start date >= from',
  })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({
    example: '2026-03-01T00:00:00.000Z',
    description: 'End date <= to',
  })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Page number (default = 1)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page (default = 20)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}