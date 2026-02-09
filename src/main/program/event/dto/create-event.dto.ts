import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString, IsEnum, IsString } from 'class-validator';
import { EventType } from 'generated/prisma/enums';


export class CreateEventDto {
  @ApiProperty({
    example: 'Night Drift Session',
  })
  @IsString()
  eventTitle: string;

  @ApiProperty({
    example: 'Professional drift practice session',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Dhaka Race Track',
    required: false,
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    enum: EventType,
    example: EventType.Drift_Session,
  })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({
    example: '2026-02-15T18:00:00Z',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2026-02-15T22:00:00Z',
  })
  @IsDateString()
  endDate: Date;
}
