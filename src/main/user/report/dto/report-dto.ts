import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ReportReason, ReportType} from 'generated/prisma/enums';

export class ReportDto {
  @IsEnum(ReportType)
  @ApiProperty({ example: 'POST', enum: ReportType })
  targetType!: ReportType;

  @IsUUID()
  @ApiProperty({ example: 'uuid-of-post-or-comment' })
  targetId!: string;

  @IsEnum(ReportReason) 
  @ApiProperty({ example: 'FALSE_INFORMATION', enum: ReportReason })
  reason!: ReportReason;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'This post is inappropriate' })
  description?: string;
}
