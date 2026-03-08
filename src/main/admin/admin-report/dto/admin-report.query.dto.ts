// src/main/admin/report/dto/admin-report-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ReportType } from 'generated/prisma/enums';


export class AdminReportQueryDto {
  @ApiPropertyOptional({ enum: ReportType, example: ReportType.POST })
  @IsOptional()
  @IsEnum(ReportType)
  targetType?: ReportType;

  @ApiPropertyOptional({ example: '0d4b0b5f-1b3d-4d77-b8b8-5c6cfcb8f111' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ example: 'b52aa8c2-7db0-43f5-b3c2-34f1d2f9e111' })
  @IsOptional()
  @IsUUID()
  targetId?: string;

  @ApiPropertyOptional({
    example: 'spam',
    description: 'Search inside description',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10, maximum: 100 })
  @Transform(({ value }) => Number(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}