import {
  ApiProperty,
  IntersectionType,
  PickType,
  PartialType,
} from '@nestjs/swagger';

import { CreateProfileDto } from './create.profile.dto';
import { Type as ProfileType } from 'generated/prisma/enums';
import { IsEnum } from 'class-validator';

class ChangeTypeRequiredDto extends PickType(CreateProfileDto, [
  'profileType',
] as const) {
  @ApiProperty({ enum: ProfileType, example: 'PRO_BUSSINESS' })
  @IsEnum(ProfileType)
  profileType!: ProfileType;
}

class ChangeTypeOptionalPayloadDto extends PartialType(
  PickType(CreateProfileDto, [
    'spotter',
    'owner',
    'creator',
    'business',
    'proDriver',
    'simRacing',
  ] as const),
) {}

export class ChangeProfileTypeDto extends IntersectionType(
  ChangeTypeRequiredDto,
  ChangeTypeOptionalPayloadDto,
) {}
