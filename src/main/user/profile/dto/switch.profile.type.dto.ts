// dto/switch-profile-type.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Type } from 'generated/prisma/enums';

export class SwitchProfileTypeDto {
   @ApiPropertyOptional({ enum: Type, example: Type.SPOTTER })
  @IsEnum(Type)
  type: Type;
}