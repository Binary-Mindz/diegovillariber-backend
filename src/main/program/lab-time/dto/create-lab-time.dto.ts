import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { DriveStyle, DriveTrain, SessionType, TireCompound, TrackCondition, Transmission, Weather } from 'generated/prisma/enums';

export class CreateLabTimeDto {
  @ApiProperty({ example: 'Nürburgring Nordschleife' })
  @IsString()
  @MaxLength(255)
  trackName: string;

  @ApiPropertyOptional({ example: 'GP Circuit' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  trackLayout?: string;

  @ApiProperty({ example: 'Porsche 911 GT3 RS' })
  @IsString()
  @MaxLength(255)
  carName: string;

  @ApiProperty({ example: 118243, description: 'Lap time in milliseconds' })
  @IsInt()
  @Min(1)
  lapTimeMs: number;

  @ApiProperty({ example: '2025-12-15T00:00:00.000Z' })
  @IsString()
  dateSet: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xxxx' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoUrl?: string;

  @ApiPropertyOptional({ example: ['https://cdn.com/telemetry1.json'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  telemetryMedia?: string[];

  @ApiProperty({ enum: Transmission, example: Transmission.MANUAL })
  @IsEnum(Transmission)
  transmission: Transmission;

  @ApiProperty({ enum: DriveTrain, example: DriveTrain.RWD })
  @IsEnum(DriveTrain)
  drivetrain: DriveTrain;

  @ApiProperty({ example: 'Morning', description: 'Free text for now (you used String in schema)' })
  @IsString()
  @MaxLength(50)
  timeOfDay: string;

  @ApiProperty({ enum: SessionType, example: SessionType.TRACK_DAY })
  @IsEnum(SessionType)
  sessionType: SessionType;

  @ApiProperty({ enum: Weather, example: Weather.Sunny })
  @IsEnum(Weather)
  weather: Weather;

  @ApiProperty({ enum: TrackCondition, example: TrackCondition.Dry })
  @IsEnum(TrackCondition)
  trackCondition: TrackCondition;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @IsInt()
  airTemp?: number;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @IsInt()
  trackTemp?: number;

  @ApiPropertyOptional({ example: 60, description: 'Humidity %' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  humidity?: number;

  @ApiProperty({ example: 'Michelin' })
  @IsString()
  @MaxLength(100)
  tireBrand: string;

  @ApiProperty({ example: 'Pilot Sport Cup 2' })
  @IsString()
  @MaxLength(100)
  tireModel: string;

  @ApiProperty({ enum: TireCompound, example: TireCompound.Slick })
  @IsEnum(TireCompound)
  tireCompund: TireCompound;

  @ApiPropertyOptional({ example: 20, description: 'Tire wear %' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  tireWear?: number;

  @ApiPropertyOptional({ example: 265 })
  @IsOptional()
  @IsInt()
  frontTireSize?: number;

  @ApiPropertyOptional({ example: '32psi' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  frontPressure?: string;

  @ApiPropertyOptional({ example: 305 })
  @IsOptional()
  @IsInt()
  rearTireSize?: number;

  @ApiProperty({ enum: DriveStyle, example: DriveStyle.Moderate_Balanced_Approach })
  @IsEnum(DriveStyle)
  drivingStyle: DriveStyle;

  @ApiPropertyOptional({ example: 40, description: 'Fuel load % or liters (your choice)' })
  @IsOptional()
  @IsInt()
  @Min(0)
  fuelLoad?: number;

  @ApiPropertyOptional({ example: 75, description: 'Driver weight in kg' })
  @IsOptional()
  @IsInt()
  @Min(0)
  driverWeight?: number;

  @ApiProperty({ example: 'Felt stable. Best lap on soft push lap.' })
  @IsString()
  additionalNotes: string;
}