import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateOfficialPartnerDto {
  @ApiProperty()
  @IsString()
  @Length(2, 120)
  brandName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  contactName: string;

  @ApiProperty()
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandLogo?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brandDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  companyRegistrationNumber?: string;
}
