import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CarMilestoneType } from 'generated/prisma/enums';


export class CreateCarMilestoneDto {
  @ApiProperty({ example: 'First track day' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ enum: CarMilestoneType, example: CarMilestoneType.PURCHASE })
  @IsEnum(CarMilestoneType)
  type!: CarMilestoneType;

  @ApiPropertyOptional({ example: '2025-12-19T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: 'View and manage your personal car details.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/milestone.jpg' })
  @IsOptional()
  @IsUrl()
  photoUrl?: string;

  @ApiPropertyOptional({ example: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  mileageAtTime?: number;

  @ApiPropertyOptional({ example: 'Dealer' })
  @IsOptional()
  @IsString()
  shopOrMechanic?: string;
}