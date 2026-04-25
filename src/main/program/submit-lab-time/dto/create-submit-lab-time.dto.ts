import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min, IsDateString } from 'class-validator';
import { CarClass, Circuit, Platform, TelemetrySource } from 'generated/prisma/enums';

export class CreateSubmitLabTimeDto {
  @ApiProperty({ enum: Platform, example: Platform.iRacing })
  @IsEnum(Platform)
  simPlatform!: Platform;

  @ApiProperty({ enum: Circuit, example: Circuit.Spa_Francorchamps })
  @IsEnum(Circuit)
  circuit!: Circuit;

  @ApiPropertyOptional({ example: 'BMW M4 GT3' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  carName?: string;

  @ApiProperty({ enum: CarClass, example: CarClass.GT3 })
  @IsEnum(CarClass)
  carClass!: CarClass;

  @ApiProperty({ example: 118243, description: 'Lap time in milliseconds' })
  @IsInt()
  @Min(1)
  lapTimeMs!: number;

  @ApiProperty({ example: '2026-03-01T18:00:00.000Z' })
  @IsDateString()
  sessionDate!: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xxxx' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoLink?: string;

  @ApiProperty({ enum: TelemetrySource, example: TelemetrySource.iRacing_MoTec })
  @IsEnum(TelemetrySource)
  telemetrySource!: TelemetrySource;

  @ApiPropertyOptional({ example: 'raw telemetry json / link / base64...' })
  @IsOptional()
  @IsString()
  telemetryData?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  tractionControl?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  abs?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  stability?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  autoClutch?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  racingLine?: boolean;
}