import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { SplitScreenDivision, SplitScreenLeagueCode } from 'generated/prisma/enums';


export class LeagueRankingQueryDto {
  @ApiPropertyOptional({
    enum: SplitScreenLeagueCode,
    example: SplitScreenLeagueCode.WORLD,
  })
  @IsOptional()
  @IsEnum(SplitScreenLeagueCode)
  league?: SplitScreenLeagueCode;

  @ApiPropertyOptional({
    enum: SplitScreenDivision,
    example: SplitScreenDivision.D1,
  })
  @IsOptional()
  @IsEnum(SplitScreenDivision)
  division?: SplitScreenDivision;

  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '20' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}