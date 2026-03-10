import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { SplitScreenBattleCategory, SplitScreenDivision, SplitScreenLeagueCode, SplitScreenMatchmakingMode, SplitScreenPreferenceMode } from 'generated/prisma/enums';


export class CreateSplitScreenMatchDto {
  @ApiProperty({
    example: '8ff9c6d8-34d8-4fe3-96b8-6d2c4ed33b90',
    description: 'Selected profile id',
  })
  @IsUUID()
  profileId: string;

  @ApiProperty({
    example: 'b6c9d69a-df89-456d-b8e2-45d6c9c6a9f2',
    description: 'Selected car id from profile cars',
  })
  @IsUUID()
  carId: string;

  @ApiProperty({
    enum: SplitScreenBattleCategory,
    example: SplitScreenBattleCategory.STYLES,
  })
  @IsEnum(SplitScreenBattleCategory)
  battleCategory: SplitScreenBattleCategory;

  @ApiProperty({
    enum: SplitScreenMatchmakingMode,
    example: SplitScreenMatchmakingMode.ANYONE,
  })
  @IsEnum(SplitScreenMatchmakingMode)
  matchmakingMode: SplitScreenMatchmakingMode;

  @ApiProperty({
    enum: SplitScreenPreferenceMode,
    example: SplitScreenPreferenceMode.ANY_CAR_BRAND,
  })
  @IsEnum(SplitScreenPreferenceMode)
  preferenceMode: SplitScreenPreferenceMode;

  @ApiProperty({
    enum: SplitScreenLeagueCode,
    example: SplitScreenLeagueCode.WORLD,
  })
  @IsEnum(SplitScreenLeagueCode)
  league: SplitScreenLeagueCode;

  @ApiProperty({
    enum: SplitScreenDivision,
    example: SplitScreenDivision.D1,
  })
  @IsEnum(SplitScreenDivision)
  division: SplitScreenDivision;

  @ApiPropertyOptional({
    example: 'BMW',
    description: 'Required when preferenceMode is SPECIFIC_BRAND',
  })
  @IsOptional()
  @IsString()
  preferredBrand?: string;
}