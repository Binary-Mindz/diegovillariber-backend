import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type as TransformType } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'generated/prisma/enums';

export class LabTimeQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @TransformType(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;

  @ApiPropertyOptional({ example: 'Nürburgring' })
  @IsOptional()
  @IsString()
  trackName?: string;

  @ApiPropertyOptional({ example: 'Porsche' })
  @IsOptional()
  @IsString()
  carName?: string;

  @ApiPropertyOptional({
    enum: Type,
    example: Type.OWNER,
    description: 'Filter by profile type',
  })
  @IsOptional()
  @IsEnum(Type)
  profileType?: Type;
}