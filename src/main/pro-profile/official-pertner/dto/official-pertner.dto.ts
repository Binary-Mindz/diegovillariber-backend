import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export enum OfficialPartnerRequestStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class OfficialPartnerQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of items per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: OfficialPartnerRequestStatusDto,
    example: OfficialPartnerRequestStatusDto.PENDING,
    description: 'Filter by request status',
  })
  @IsOptional()
  @IsEnum(OfficialPartnerRequestStatusDto)
  status?: OfficialPartnerRequestStatusDto;

  @ApiPropertyOptional({
    example: 'speedx',
    description: 'Search by brand name, contact name, or contact email',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
