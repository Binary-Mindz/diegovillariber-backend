import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import {
  BikeBodyType,
  DriveCategoryBike,
  DriveTrainBike,
  Transmission,
} from 'generated/prisma/enums';

export class CreateBikeDto {
  @ApiProperty({ example: 'garage-uuid' })
  @IsUUID()
  garageId!: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/bike.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;

  @ApiPropertyOptional({ example: 'Yamaha' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  make?: string;

  @ApiPropertyOptional({ example: 'R1' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  model?: string;

  @ApiProperty({ enum: BikeBodyType, example: BikeBodyType.SPORT })
  @IsOptional()
  @IsEnum(BikeBodyType)
  bodyType?: BikeBodyType; // schema has default(SPORT)

  @ApiProperty({ enum: Transmission, example: Transmission.MANUAL })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission; // schema has default(MANUAL)

  @ApiProperty({ enum: DriveTrainBike, example: DriveTrainBike.CHAIN })
  @IsOptional()
  @IsEnum(DriveTrainBike)
  driveTrain?: DriveTrainBike; // schema has default(CHAIN)

  @ApiPropertyOptional({ example: 'Japan' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  country?: string;

  @ApiPropertyOptional({ example: 'Blue' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 'My Track Bike' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;

  @ApiPropertyOptional({ example: 'Upgraded exhaust, track focused build' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: DriveCategoryBike, example: DriveCategoryBike.DAILY_RIDER })
  @IsOptional()
  @IsEnum(DriveCategoryBike)
  category?: DriveCategoryBike; // schema has default(DAILY_RIDER)

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  listOnMarketplace?: boolean; // schema has default(false)

  @ApiPropertyOptional({ example: 950000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}