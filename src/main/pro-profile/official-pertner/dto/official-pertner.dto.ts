import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export enum OfficialPartnerRequestStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class OfficialPartnerQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ enum: OfficialPartnerRequestStatusDto })
  @IsOptional()
  @IsEnum(OfficialPartnerRequestStatusDto)
  status?: OfficialPartnerRequestStatusDto;

  @ApiPropertyOptional({ description: 'Search by brandName/contactName/contactEmail' })
  @IsOptional()
  @IsString()
  search?: string;
}
