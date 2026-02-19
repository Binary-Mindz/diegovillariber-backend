import { ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { CreateProfileDto } from './create.profile.dto';
import { AccountType } from 'generated/prisma/enums';

export class UpdateProfileBaseDto extends PartialType(
  PickType(CreateProfileDto, [
    'profileName',
    'bio',
    'imageUrl',
    'instagramHandler',
    'accountType',
  ] as const),
) {
  @ApiPropertyOptional({ enum: AccountType, example: 'PUBLIC' })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;
}
