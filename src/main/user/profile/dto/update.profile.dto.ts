import { ApiPropertyOptional, PickType, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { CreateProfileDto } from './create.profile.dto';
import { AccountType, Preference } from 'generated/prisma/enums';

export class UpdateProfileBaseDto extends PartialType(
  PickType(CreateProfileDto, [
    'profileName',
    'bio',
    'imageUrl',
    'instagramHandler',
    'accountType',
    'preference',
  ] as const),
) {
  @ApiPropertyOptional({ enum: AccountType, example: 'PUBLIC' })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiPropertyOptional({ enum: Preference, example: 'Car' })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;
}
