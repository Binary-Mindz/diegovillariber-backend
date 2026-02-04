import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateChallengeDto {
  @ApiProperty({ example: 'My Photo Challenge' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiPropertyOptional({ example: 'Rules...' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ example: '2026-02-10T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-02-20T23:59:59.000Z' })
  @IsOptional()
  @IsString()
  endDate?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  participants?: number;

  @ApiPropertyOptional({ example: 'https://cdn.com/banner.jpg' })
  @IsOptional()
  @IsString()
  images?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/video.mp4' })
  @IsOptional()
  @IsString()
  media?: string;

  @ApiPropertyOptional({ example: 'Sony A7' })
  @IsOptional()
  @IsString()
  camera?: string;
}
