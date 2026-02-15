// report.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportType } from 'generated/prisma/enums';

export class ReportDto {
  @IsEnum(ReportType)
  @ApiProperty({ example: 'POST', enum: ReportType })
  targetType: ReportType;

  @IsUUID()
  @ApiProperty({ example: 'uuid-of-post-or-comment' })
  targetId: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'This post is inappropriate' })
  description?: string;
}
