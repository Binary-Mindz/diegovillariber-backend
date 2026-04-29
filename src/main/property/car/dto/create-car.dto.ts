import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { BodyType, DriveCategory, DriveTrain, Transmission } from 'generated/prisma/enums';

export class CreateCarDto {
  @ApiProperty({
    example: '9a6c8e11-9f0e-4e6e-9c4b-cc99d54c0b10',
    description: 'Garage ID where the car will be added (must belong to active profile)',
  })
  @IsUUID()
  garageId!: string;

  @ApiPropertyOptional({ example: 'https://cdn.app/car.jpg', description: 'Car image URL' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({ example: 'BMW', description: 'Car manufacturer' })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiPropertyOptional({ example: 'M4 Competition', description: 'Car model name' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({ enum: BodyType, example: BodyType.CLASSIC })
  @IsOptional()
  @IsEnum(BodyType)
  bodyType?: BodyType;

  @ApiPropertyOptional({ enum: Transmission, example: Transmission.DCT })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @ApiPropertyOptional({ enum: DriveTrain, example: DriveTrain.RWD })
  @IsOptional()
  @IsEnum(DriveTrain)
  driveTrain?: DriveTrain;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Frozen Black' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'Track Beast', description: 'Custom display name' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'Built for Nürburgring performance laps' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: DriveCategory, example: DriveCategory.DAILY_DRIVE })
  @IsOptional()
  @IsEnum(DriveCategory)
  category?: DriveCategory;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  listOnMarketplace?: boolean;

  @ApiPropertyOptional({ example: 95000, description: 'Estimated price' })
  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;
}