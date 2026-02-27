import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { CarClass, Platform, Transmission } from 'generated/prisma/enums';

export class CreateVirtualGarageDto {
  @ApiProperty({ enum: Platform, example: Platform.iRacing })
  @IsEnum(Platform)
  simPlatform: Platform;

  @ApiProperty({ example: 'BMW' })
  @IsString()
  @MaxLength(80)
  carMake: string;

  @ApiProperty({ example: 'M4 GT3' })
  @IsString()
  @MaxLength(120)
  carModel: string;

  @ApiProperty({ example: '2024' })
  @IsString()
  @MaxLength(10)
  makeYear: string;

  @ApiProperty({ enum: CarClass, example: CarClass.GT3 })
  @IsEnum(CarClass)
  carClass: CarClass;

  @ApiPropertyOptional({ example: 'https://cdn.com/livery.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  livery?: string;

  @ApiPropertyOptional({ example: 'OnyxSport Racing' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  teamName?: string;

  @ApiPropertyOptional({ example: 46 })
  @IsOptional()
  @IsInt()
  @Min(0)
  carNumber?: number;

  @ApiProperty({ enum: Transmission, example: Transmission.MANUAL })
  @IsEnum(Transmission)
  transmission: Transmission;

  @ApiPropertyOptional({ example: 'Setup: aggressive / TC off' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}