import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
}
