import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SplitScreenBattleCategory, SplitScreenBattleStatus } from 'generated/prisma/enums';


export class SplitScreenQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    enum: SplitScreenBattleStatus,
    example: SplitScreenBattleStatus.LIVE,
    description: 'Filter by battle status',
  })
  @IsOptional()
  @IsEnum(SplitScreenBattleStatus)
  status?: SplitScreenBattleStatus;

  @ApiPropertyOptional({
    enum: SplitScreenBattleCategory,
    example: SplitScreenBattleCategory.STYLES,
  })
  @IsOptional()
  @IsEnum(SplitScreenBattleCategory)
  category?: SplitScreenBattleCategory;

  @ApiPropertyOptional({
    example: 'bmw',
    description: 'Search by title, description, brand, model',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'UI tabs: active | upcoming | finished',
  })
  @IsOptional()
  @IsString()
  tab?: string;
}