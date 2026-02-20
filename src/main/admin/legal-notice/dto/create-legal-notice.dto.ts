import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLegalNoticeDto {
  // ADMIN only (optional for admin; required if not using activeProfileId)
  @ApiPropertyOptional({ example: 'profile-uuid' })
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @ApiProperty({ example: 'car-uuid' })
  @IsUUID()
  carId: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  location: string;

  @ApiProperty({ example: '2026-02-21T10:30:00.000Z' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ example: 'Speed limit violation...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.../notice.png' })
  @IsOptional()
  @IsString()
  media?: string;

  @ApiPropertyOptional({ example: 'Mr. X' })
  @IsOptional()
  @IsString()
  witnessName?: string;

  @ApiPropertyOptional({ example: 'witness@mail.com' })
  @IsOptional()
  @IsString()
  witnessEmail?: string;

  @ApiPropertyOptional({ example: '+8801XXXXXXXXX' })
  @IsOptional()
  @IsString()
  witnessPhone?: string;
}