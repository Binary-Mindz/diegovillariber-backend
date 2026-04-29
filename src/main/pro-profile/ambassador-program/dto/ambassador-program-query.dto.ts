import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export enum AmbassadorStatusDto {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class AmbassadorProgramQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Page number for pagination',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Number of records per page',
    default: 10,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    enum: AmbassadorStatusDto,
    example: AmbassadorStatusDto.PENDING,
  })
  @IsOptional()
  @IsEnum(AmbassadorStatusDto)
  status?: AmbassadorStatusDto;

  @ApiPropertyOptional({
    example: 'Nayem boss',
    description: 'Search by motorspot name, contact name, or email',
  })
  @IsOptional()
  @IsString()
  search?: string;
}