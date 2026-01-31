import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export enum AmbassadorStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class AmbassadorProgramQueryDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ enum: AmbassadorStatusDto })
  @IsOptional()
  @IsEnum(AmbassadorStatusDto)
  status?: AmbassadorStatusDto;

  @ApiPropertyOptional({ description: 'Search motorspotName/contactName/email' })
  @IsOptional()
  @IsString()
  search?: string;
}
