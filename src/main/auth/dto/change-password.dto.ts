import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'secret123',
    description: 'Current password',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    example: 'newSecret123',
    minLength: 6,
    description: 'New password (min 6 characters)',
  })
  @MinLength(6)
  newPassword: string;
}
