import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { LegalNoticeTarget } from 'generated/prisma/enums';

export class CreateLegalNoticeDto {
  @ApiPropertyOptional({ example: 'profile-uuid' })
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @ApiProperty({ enum: LegalNoticeTarget, example: LegalNoticeTarget.CAR })
  @IsEnum(LegalNoticeTarget)
  targetType!: LegalNoticeTarget;

  @ApiPropertyOptional({ example: 'car-uuid' })
  @IsOptional()
  @IsUUID()
  carId?: string;

  @ApiPropertyOptional({ example: 'bike-uuid' })
  @IsOptional()
  @IsUUID()
  bikeId?: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @MaxLength(255)
  location!: string;

  @ApiProperty({ example: '2026-02-21T10:30:00.000Z' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ example: 'Speed limit violation...' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://cdn.../notice.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
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