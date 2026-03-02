import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { CarClass, Circuit, Platform } from 'generated/prisma/enums';
import { Type } from 'class-transformer';

export class CompareHistoryDto {
  @ApiProperty({ example: 'other-user-uuid' })
  @IsUUID()
  otherUserId: string;

  @ApiProperty({ enum: Platform, example: Platform.iRacing })
  @IsEnum(Platform)
  simPlatform: Platform;

  @ApiProperty({ enum: Circuit, example: Circuit.Spa_Francorchamps })
  @IsEnum(Circuit)
  circuit: Circuit;

  @ApiProperty({ enum: CarClass, example: CarClass.DRIFT })
  @IsEnum(CarClass)
  carClass: CarClass;

  @ApiPropertyOptional({ example: 20, description: 'How many recent laps to return (max 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;
}