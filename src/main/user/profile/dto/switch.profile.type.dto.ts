// dto/switch-profile-type.dto.ts

import { IsEnum } from 'class-validator';
import { Type } from 'generated/prisma/enums';

export class SwitchProfileTypeDto {
  @IsEnum(Type)
  type: Type;
}