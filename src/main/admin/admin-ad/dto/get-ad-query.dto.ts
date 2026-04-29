import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { AdStatus, Placement, Preference } from 'generated/prisma/enums';

export class GetAdsQueryDto {
  @ApiPropertyOptional({
    example: '1',
    description: 'Page number',
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({
    example: '10',
    description: 'Items per page',
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({
    example: 'Premium',
    description: 'Search by title',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: AdStatus,
    example: AdStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(AdStatus)
  adStatus?: AdStatus;

  @ApiPropertyOptional({
    enum: Placement,
    example: Placement.WEB,
  })
  @IsOptional()
  @IsEnum(Placement)
  placement?: Placement;

  @ApiPropertyOptional({
    enum: Preference,
    example: Preference.CAR,
  })
  @IsOptional()
  @IsEnum(Preference)
  vehicleType?: Preference;
}