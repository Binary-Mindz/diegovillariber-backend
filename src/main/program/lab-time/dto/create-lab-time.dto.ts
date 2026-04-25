import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  IsNumber,
} from 'class-validator';
import {
  DriveStyle,
  DriveTrain,
  SessionType,
  TireCompound,
  TrackCondition,
  Transmission,
  Weather,
} from 'generated/prisma/enums';
import { LabVehicleType } from '../enum/lab-vehicle-type.enum';

export class CreateLabTimeDto {
  @ApiProperty({ example: 'Nürburgring' })
  @IsString()
  @MaxLength(255)
  trackName!: string;

  @ApiPropertyOptional({ example: 'GP Circuit' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  trackLayout?: string;

  @ApiPropertyOptional({ example: 50.3356 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 6.9475 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 'a0f7aab2-676e-4f18-bf8c-9f0f7c70f101' })
  @IsUUID()
  garageId!: string;

  @ApiProperty({ enum: LabVehicleType, example: LabVehicleType.CAR })
  @IsEnum(LabVehicleType)
  vehicleType!: LabVehicleType;

  @ApiProperty({ example: 'b5c6c2f2-52e8-4c96-a7f9-26cbb2bbf001' })
  @IsUUID()
  vehicleId!: string;

  @ApiProperty({ example: 118243 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lapTimeMs!: number;

  @ApiProperty({ example: '2025-12-15T00:00:00.000Z' })
  @IsString()
  dateSet!: string;

  @ApiPropertyOptional({ example: 'https://youtube.com/watch?v=xxxx' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  videoUrl?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Telemetry CSV file',
  })
  @IsOptional()
  @Allow()
  telemetryFile?: any;

  @ApiProperty({ enum: Transmission, example: Transmission.MANUAL })
  @IsEnum(Transmission)
  transmission!: Transmission;

  @ApiProperty({ enum: DriveTrain, example: DriveTrain.RWD })
  @IsEnum(DriveTrain)
  drivetrain!: DriveTrain;

  @ApiProperty({ example: 'Morning' })
  @IsString()
  @MaxLength(50)
  timeOfDay!: string;

  @ApiProperty({ enum: SessionType, example: SessionType.TRACK_DAY })
  @IsEnum(SessionType)
  sessionType!: SessionType;

  @ApiProperty({ enum: Weather, example: Weather.Sunny })
  @IsEnum(Weather)
  weather!: Weather;

  @ApiProperty({ enum: TrackCondition, example: TrackCondition.Dry })
  @IsEnum(TrackCondition)
  trackCondition!: TrackCondition;

  @ApiPropertyOptional({ example: 22 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  airTemp?: number;

  @ApiPropertyOptional({ example: 35 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  trackTemp?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  humidity?: number;

  @ApiProperty({ example: 'Michelin' })
  @IsString()
  @MaxLength(100)
  tireBrand!: string;

  @ApiProperty({ example: 'Pilot Sport Cup 2' })
  @IsString()
  @MaxLength(100)
  tireModel!: string;

  @ApiProperty({ enum: TireCompound, example: TireCompound.SOFT })
  @IsEnum(TireCompound)
  tireCompund!: TireCompound;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(100)
  tireWear?: number;

  @ApiPropertyOptional({ example: 265 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  frontTireSize?: number;

  @ApiPropertyOptional({ example: '32psi' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  frontPressure?: string;

  @ApiPropertyOptional({ example: 305 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  rearTireSize?: number;

  @ApiPropertyOptional({ example: '32psi' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  rearPressure?: string;

  @ApiProperty({
    enum: DriveStyle,
    example: DriveStyle.Moderate_Balanced_Approach,
  })
  @IsEnum(DriveStyle)
  drivingStyle!: DriveStyle;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fuelLoad?: number;

  @ApiPropertyOptional({ example: 75 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  driverWeight?: number;

  @ApiProperty({ example: 'Felt stable. Best lap on soft push lap.' })
  @IsString()
  additionalNotes!: string;
}