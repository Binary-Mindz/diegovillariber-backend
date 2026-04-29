import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DriverLevel, UsageCategory, UsageMode } from 'generated/prisma/enums';

export class UpdateUsageNotesDto {
  @ApiPropertyOptional({ enum: UsageCategory, example: UsageCategory.Trackday })
  @IsOptional()
  @IsEnum(UsageCategory)
  category?: UsageCategory;

  @ApiPropertyOptional({ enum: DriverLevel, example: DriverLevel.Amateur })
  @IsOptional()
  @IsEnum(DriverLevel)
  driverLevel?: DriverLevel;

  @ApiPropertyOptional({ enum: UsageMode, example: UsageMode.Weekend })
  @IsOptional()
  @IsEnum(UsageMode)
  usageMode?: UsageMode;

  @ApiPropertyOptional({ example: 'Front camber -2.5°, rear -1.8°' })
  @IsOptional()
  @IsString()
  alignmentNotes?: string;
}