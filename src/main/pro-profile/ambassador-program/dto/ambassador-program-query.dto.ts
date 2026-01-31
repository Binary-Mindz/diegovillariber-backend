import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export enum AmbassadorStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class AmbassadorProgramQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Number of records per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    enum: AmbassadorStatusDto,
    example: AmbassadorStatusDto.PENDING,
  })
  @IsOptional()
  @IsEnum(AmbassadorStatusDto)
  status?: AmbassadorStatusDto;

  @ApiPropertyOptional({
    example: 'rana',
    description: 'Search by motorspot name, contact name, or email',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
