import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangedPasswordDto {
  @ApiProperty({ example: 'strongPassword123' })
  @IsString()
  currentPassword: string;
}
