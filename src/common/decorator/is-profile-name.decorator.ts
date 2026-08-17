import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString, Length, Matches, ValidationOptions } from 'class-validator';

export const PROFILE_NAME_REGEX =
  /^(?!.*[._-]{2})[a-z0-9][a-z0-9._-]{1,28}[a-z0-9]$/;

export const PROFILE_NAME_VALIDATION_MESSAGE =
  'Profile name must be 3-30 characters long, containing only lowercase letters, numbers, underscores (_), periods (.), or hyphens (-). It cannot start or end with a symbol, and cannot contain consecutive symbols or spaces.';

export function IsProfileName(validationOptions?: ValidationOptions) {
  return applyDecorators(
    Transform(({ value }) =>
      typeof value === 'string' ? value.trim().toLowerCase() : value,
    ),
    IsString({
      message: validationOptions?.message ?? PROFILE_NAME_VALIDATION_MESSAGE,
    }),
    Length(3, 30, {
      message: 'Profile name must be between 3 and 30 characters long.',
    }),
    Matches(PROFILE_NAME_REGEX, {
      message: validationOptions?.message ?? PROFILE_NAME_VALIDATION_MESSAGE,
    }),
  );
}
