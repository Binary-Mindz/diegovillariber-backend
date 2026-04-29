import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FuelType } from 'generated/prisma/enums';

export class UpdateEnginePowerDto {
  @ApiPropertyOptional({ example: 503 })
  @IsOptional()
  @IsInt()
  @Min(0)
  horsepowerHp?: number;

  @ApiPropertyOptional({ example: 650 })
  @IsOptional()
  @IsInt()
  @Min(0)
  torqueNm?: number;

  @ApiPropertyOptional({ example: 1600 })
  @IsOptional()
  @IsInt()
  @Min(0)
  weightKg?: number;

  @ApiPropertyOptional({ example: '3.0L Inline-6 Twin Turbo' })
  @IsOptional()
  @IsString()
  engineDescription?: string;

  @ApiPropertyOptional({ enum: FuelType, example: FuelType.Gasoline })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiPropertyOptional({ example: 'Pure Turbos Stage 2' })
  @IsOptional()
  @IsString()
  turboOrSupercharger?: string;

  @ApiPropertyOptional({ example: 'Wagner EVO 2 Intercooler' })
  @IsOptional()
  @IsString()
  intercooler?: string;

  @ApiPropertyOptional({ example: 'Akrapovic Titanium Exhaust' })
  @IsOptional()
  @IsString()
  exhaustSystem?: string;

  @ApiPropertyOptional({ example: 'Eventuri Carbon Intake' })
  @IsOptional()
  @IsString()
  intakeSystem?: string;

  @ApiPropertyOptional({ example: 'Upgraded HPFP + Injectors' })
  @IsOptional()
  @IsString()
  fuelSystemMods?: string;

  @ApiPropertyOptional({ example: 'CSF Radiator + Oil Cooler' })
  @IsOptional()
  @IsString()
  coolingUpgrades?: string;

  @ApiPropertyOptional({ example: 1550 })
  @IsOptional()
  @IsInt()
  @Min(0)
  dynoWeightKg?: number;

  @ApiPropertyOptional({ example: 7600 })
  @IsOptional()
  @IsInt()
  @Min(0)
  rpmLimiter?: number;
}