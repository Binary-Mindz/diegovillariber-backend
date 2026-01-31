import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateOfficialPartnerDto {
  @ApiProperty({
    example: 'SpeedX Automotive',
    description: 'Official brand or company name',
  })
  @IsString()
  @Length(2, 120)
  brandName: string;

  @ApiProperty({
    example: 'Rana Miah',
    description: 'Primary contact person name',
  })
  @IsString()
  @Length(2, 120)
  contactName: string;

  @ApiProperty({
    example: 'contact@speedxauto.com',
    description: 'Official contact email address',
  })
  @IsEmail()
  contactEmail: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/logos/speedx.png',
    description: 'Brand logo URL or stored file path',
  })
  @IsOptional()
  @IsString()
  brandLogo?: string;

  @ApiPropertyOptional({
    example:
      'SpeedX Automotive is a premium performance car parts manufacturer.',
    description: 'Short description about the brand',
  })
  @IsOptional()
  @IsString()
  brandDescription?: string;

  @ApiPropertyOptional({
    example: 'https://www.speedxauto.com',
    description: 'Official company website',
  })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({
    example: 'Automotive Performance Parts',
  })
  @IsOptional()
  @IsString()
  industry?: string;

  @ApiPropertyOptional({
    example: 'Bangladesh',
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({
    example: 'RJSC-12345678',
    description: 'Company registration or legal identification number',
  })
  @IsOptional()
  @IsString()
  companyRegistrationNumber?: string;
}
