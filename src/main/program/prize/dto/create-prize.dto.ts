import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreatePrizeDto {
  @ApiProperty({ example: 'Gold Trophy', description: 'Prize name' })
  @IsString()
  @MinLength(2)
  prizeName!: string;
}