import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePrestigeDto {
  @ApiProperty({
    example: 'get_comment',
    description: 'Unique event key for prestige earning',
  })
  @IsString()
  @IsNotEmpty()
  earnBy!: string;

  @ApiProperty({ example: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  point!: number;

  @ApiPropertyOptional({
    example: 0,
    description: '0 means unlimited',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dailyCap?: number;

  @ApiPropertyOptional({
    example: 0,
    description: '0 means unlimited',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  weeklyCap?: number;

  @ApiPropertyOptional({
    example: 60,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cooldownSeconds?: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;
}