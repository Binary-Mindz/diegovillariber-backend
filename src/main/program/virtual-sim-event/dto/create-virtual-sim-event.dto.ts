import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { EventType, Platform, Visibility } from 'generated/prisma/enums';

export class CreateVirtualSimEventDto {
  @ApiProperty({ example: 'Sunday GT3 League Race' })
  @IsString()
  @MaxLength(150)
  eventTitle: string;

  @ApiProperty({ enum: Platform, example: Platform.iRacing })
  @IsEnum(Platform)
  simPlatform: Platform;

  @ApiProperty({ example: 'Spa Francorchamps' })
  @IsString()
  @MaxLength(150)
  circuit: string;

  @ApiProperty({ enum: EventType, example: EventType.Race })
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({ example: '2026-03-01T18:00:00.000Z' })
  @IsDateString()
  dateAndTime: string;

  @ApiProperty({ example: 60, description: 'Duration in minutes' })
  @Min(1)
  duration: number;

  @ApiPropertyOptional({ example: 24 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxGridSize?: number;

  @ApiProperty({ enum: Visibility, example: Visibility.Public })
  @IsEnum(Visibility)
  visibility: Visibility;

  @ApiPropertyOptional({ example: 'Onyx GT3 Server' })
  @IsOptional()
  @IsString()
  serverName?: string;

  @ApiPropertyOptional({ example: 'secret123' })
  @IsOptional()
  @IsString()
  serverPassword?: string;

  @ApiPropertyOptional({ example: 'https://discord.gg/xyz' })
  @IsOptional()
  @IsString()
  discordLink?: string;

  @ApiPropertyOptional({ example: 'Mandatory pit stop' })
  @IsOptional()
  @IsString()
  notes?: string;
}