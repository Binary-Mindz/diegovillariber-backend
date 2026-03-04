import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { OfficialPartnerRequestStatus } from 'generated/prisma/enums';

export enum OfficialPartnerTab {
  APPLICATIONS = 'APPLICATIONS',
  APPROVED_PARTNERS = 'APPROVED_PARTNERS',
  CAMPAIGNS = 'CAMPAIGNS',
}

export class OfficialPartnerQueryDto {
  @ApiPropertyOptional({ enum: OfficialPartnerTab, default: OfficialPartnerTab.APPLICATIONS })
  @IsOptional()
  @IsEnum(OfficialPartnerTab)
  tab?: OfficialPartnerTab = OfficialPartnerTab.APPLICATIONS;

  @ApiPropertyOptional({ enum: OfficialPartnerRequestStatus, description: 'Filter by requestStatus' })
  @IsOptional()
  @IsEnum(OfficialPartnerRequestStatus)
  status?: OfficialPartnerRequestStatus;

  @ApiPropertyOptional({ example: 'emmcars' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 10;
}