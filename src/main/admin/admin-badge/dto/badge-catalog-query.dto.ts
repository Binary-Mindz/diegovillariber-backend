import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { BadgeRarity, BadgeStatus, BadgeTargetType } from 'generated/prisma/enums';

export class BadgeCatalogQueryDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 9, default: 9 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 9;

  @ApiPropertyOptional({ example: 'spotter' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: BadgeStatus })
  @IsOptional()
  @IsEnum(BadgeStatus)
  status?: BadgeStatus;

  @ApiPropertyOptional({ enum: BadgeRarity })
  @IsOptional()
  @IsEnum(BadgeRarity)
  rarity?: BadgeRarity;

  @ApiPropertyOptional({ enum: BadgeTargetType })
  @Transform(({ value }) => value?.toUpperCase())
  @IsOptional()
  @IsEnum(BadgeTargetType)
  targetType?: BadgeTargetType;
}