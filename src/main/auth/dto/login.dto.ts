import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Role } from 'generated/prisma/enums';

export class LoginDto {
  @ApiProperty({
    example: 'ranarasul21@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secret123',
    description: 'User password',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsEnum(Role)
  @ApiPropertyOptional({
    example: 'USER',
    description: 'Login as specific role',
  })
  loginAs?: Role;
}
