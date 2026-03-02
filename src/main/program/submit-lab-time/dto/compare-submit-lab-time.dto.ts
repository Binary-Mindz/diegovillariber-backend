import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { CarClass, Circuit, Platform } from 'generated/prisma/enums';

export class CompareSubmitLabTimeDto {
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
}