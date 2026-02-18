import {
  
} from '@prisma/client';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BodyType, DriveCategory, DriveTrain, Transmission } from 'generated/prisma/enums';

export class CreateCarDto {
  @ApiProperty({
    example: '9a6c8e11-9f0e-4e6e-9c4b-cc99d54c0b10',
    description: 'Garage ID where the car will be added',
  })
  @IsUUID()
  garageId: string;

  @ApiPropertyOptional({
    example: 'BMW',
    description: 'Car manufacturer',
  })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({
    example: 'M4 Competition',
    description: 'Car model name',
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    enum: BodyType,
    example: BodyType.Coupe,
    description: 'Vehicle body type',
  })
  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @ApiPropertyOptional({
    enum: Transmission,
    example: Transmission.DCT,
    description: 'Transmission type',
  })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @ApiPropertyOptional({
    enum: DriveTrain,
    example: DriveTrain.RWD,
    description: 'Drive train configuration',
  })
  @IsOptional()
  @IsEnum(DriveTrain)
  driveTrain?: DriveTrain;

  @ApiPropertyOptional({
    example: 'Frozen Black',
    description: 'Car color',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({
    example: 'Track Beast',
    description: 'Custom display name for the car',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    example: 'Built for Nürburgring performance laps',
    description: 'Detailed description about the car',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: DriveCategory,
    example: DriveCategory.Track_Tool,
    description: 'Usage category of the car',
  })
  @IsOptional()
  @IsEnum(DriveCategory)
  category?: DriveCategory;

  @ApiPropertyOptional({
    example: 95000,
    description: 'Estimated price of the car',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}
