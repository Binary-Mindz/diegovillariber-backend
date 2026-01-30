import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';
import { Preference, Type } from 'generated/prisma/enums';

export class SignUpDto {
  @ApiProperty({ example: 'John deo' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'ranarasul21@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', minLength: 6 })
  @MinLength(6)
  password: string;

  @ApiProperty({
    enum: Preference,
    example: Preference.Car,
  })
  @IsEnum(Preference)
  preference: Preference;

  @ApiProperty({
    enum: Type,
    example: Type.SPOTTER,
  })
  @IsEnum(Type)
  profileType: Type;
}
