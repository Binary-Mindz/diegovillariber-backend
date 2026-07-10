import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class ProvideTokenDto {
  @ApiProperty({ example: 'id-of-user' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 15 })
  @IsNumber()
  @Min(1)
  points!: number;
}
