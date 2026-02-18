import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGarageDto {
  @ApiProperty({
    example: 'Rana Performance Garage',
    description: 'Name of the garage',
  })
  @IsString()
  @MaxLength(100)
  garageName: string;

  @ApiPropertyOptional({
    example: 'High performance tuning and engine rebuild specialist.',
    description: 'Garage description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Dhaka, Bangladesh',
    description: 'Garage location',
  })
  @IsOptional()
  @IsString()
  location?: string;
}
