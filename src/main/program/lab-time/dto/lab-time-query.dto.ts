import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { LabVehicleType } from '../enum/lab-vehicle-type.enum';

export class LabTimeQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackLayout?: string;

@ApiPropertyOptional({ example: 10 })
@IsOptional()
@Type(() => Number)
@IsInt()
@Min(1)
telemetryLimit?: number = 10;

  @ApiPropertyOptional({ enum: LabVehicleType })
  @IsOptional()
  @IsEnum(LabVehicleType)
  vehicleType?: LabVehicleType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleName?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}