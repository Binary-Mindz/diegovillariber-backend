import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CarClass, Platform } from 'generated/prisma/enums';

export class VirtualGarageQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ enum: Platform, example: Platform.iRacing })
  @IsOptional()
  @IsEnum(Platform)
  simPlatform?: Platform;

  @ApiPropertyOptional({ enum: CarClass, example: CarClass.GT3 })
  @IsOptional()
  @IsEnum(CarClass)
  carClass?: CarClass;

  @ApiPropertyOptional({ example: 'BMW' })
  @IsOptional()
  @IsString()
  q?: string; // search by make/model
}