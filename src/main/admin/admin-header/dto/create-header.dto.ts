import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';
import { HeaderName } from 'generated/prisma/enums';

export class CreateHeaderDto {
  @ApiProperty({
    enum: HeaderName,
    example: HeaderName.CHALLEGE,
    description: 'Header type',
  })
  @IsEnum(HeaderName)
  selectHeader!: HeaderName;

  @ApiProperty({
    example: 'Challenge Main Banner',
    description: 'Unique header name',
  })
  @IsString()
  headerName!: string;

  @ApiPropertyOptional({
    example: 'Ferrari',
    description: 'Optional brand name',
  })
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/banner.png',
    description: 'Optional banner image URL',
  })
  @IsOptional()
  @IsString()
  bannerImage?: string;
}