import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { CarClass, Circuit, Platform } from 'generated/prisma/enums';
import { Type } from 'class-transformer';

export class SubmitLabTimeLeaderboardDto {
  @ApiProperty({ enum: Platform, example: Platform.iRacing })
  @IsEnum(Platform)
  simPlatform!: Platform;

  @ApiProperty({ enum: Circuit, example: Circuit.Spa_Francorchamps })
  @IsEnum(Circuit)
  circuit!: Circuit;

  @ApiProperty({ enum: CarClass, example: CarClass.DRIFT })
  @IsEnum(CarClass)
  carClass!: CarClass;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @ApiPropertyOptional({ example: 'other-user rank also show করতে চাইলে', description: 'optional' })
  @IsOptional()
  @Type(() => String)
  otherUserId?: string;
}