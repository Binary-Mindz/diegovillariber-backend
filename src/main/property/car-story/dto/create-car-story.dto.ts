import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CarWhereFound } from 'generated/prisma/enums';

export class CreateCarStoryDto {
  @ApiProperty({
    example: '2f4a8f15-3c10-4d1a-9821-111111111111',
    description: 'Car id for this story',
  })
  @IsUUID()
  @IsNotEmpty()
  carId!: string;

  @ApiProperty({ example: 'Ford Mustang' })
  @IsString()
  @IsNotEmpty()
  carName!: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/day1.jpg' })
  @IsOptional()
  @IsUrl()
  firstDayPhotoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/current.jpg' })
  @IsOptional()
  @IsUrl()
  currentPhotoUrl?: string;

  @ApiPropertyOptional({ example: '2025-12-19T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiPropertyOptional({ enum: CarWhereFound, example: CarWhereFound.DEALER })
  @IsOptional()
  @IsEnum(CarWhereFound)
  whereFound?: CarWhereFound;

  @ApiPropertyOptional({ example: 10000 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  purchaseMileage?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  currentMileage?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isDreamCar?: boolean;

  @ApiPropertyOptional({ example: 'This was my dream car!' })
  @IsOptional()
  @IsString()
  purchaseStory?: string;

  @ApiPropertyOptional({ example: 'I want to upgrade the exhaust and wheels.' })
  @IsOptional()
  @IsString()
  futurePlans?: string;
}