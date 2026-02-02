import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateHashtagDto {
  @ApiProperty({ example: 'carmeet' })
  @IsString()
  tag: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
