import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { PostAssetType } from 'generated/prisma/enums';

export class CreateSpottingRequestDto {
  @ApiProperty({
    example: PostAssetType.CAR,
    required: false,
    enum: PostAssetType,
  })
  @IsOptional()
  @IsEnum(PostAssetType)
  vehicleType?: PostAssetType;

  @ApiProperty({ example: 'Lamborghini', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ example: 'F40', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({
    example: '2f15e7e2-2a6b-4b0b-9f14-f4f4034979b1',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  profileId?: string;

  @ApiProperty({
    example: 'f82f0c45-8d4e-4950-b2cf-51d30f631dbe',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  carId?: string;

  @ApiProperty({ example: 23.8103 })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 90.4125 })
  @IsNumber()
  longitude!: number;

  @ApiProperty({ example: 100, required: false, default: 100 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  radiusKm?: number;

  @ValidateIf((o) => !o.carId)
  @IsOptional()
  @IsString()
  __brandOrModelValidation?: string;
}
