import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { BattleCategory, Preference } from 'generated/prisma/enums';
import { IsEnum } from 'class-validator';

export class UpdateBattleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: BattleCategory })
  @IsOptional()
  @IsEnum(BattleCategory)
  battleCategory?: BattleCategory;

  @ApiPropertyOptional({ enum: Preference })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(2)
  maxParticipants?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endTime?: string;
}