import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsEnum } from 'class-validator';
import { Preference, Type } from 'generated/prisma/enums';
import { IsProfileName } from '@/common/decorator/is-profile-name.decorator';

export class SignUpDto {
  @ApiProperty({ example: 'john_doe' })
  @IsProfileName()
  username!: string;

  @ApiProperty({ example: 'ranarasul21@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @MinLength(6)
  password!: string;

  @ApiProperty({
    enum: Preference,
    example: Preference.CAR,
  })
  @IsEnum(Preference)
  preference!: Preference;

  @ApiProperty({
    enum: Type,
    example: Type.SPOTTER,
  })
  @IsEnum(Type)
  profileType!: Type;
}
