import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from 'generated/prisma/enums';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    example: 'Toyota Brake Pad',
    description: 'Product title',
  })
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/products/brake-pad.jpg',
    description: 'Product image URL',
  })
  @IsOptional()
  @IsString()
  productImage?: string;

  @ApiPropertyOptional({
    example: 'High quality brake pad suitable for Toyota cars',
    description: 'Product description',
  })
  @IsOptional()
  @IsString()
  description?: string;

   @ApiPropertyOptional({
    example: 'Dhaka,Bangldesh',
    description: 'dhaka, Bangldesh',
  })
  @IsOptional()
  @IsString()
  location?: string;

    @ApiPropertyOptional({ example: 'Purbachal, Dhaka, Bangladesh' })
    @IsOptional()
    @IsString()
    locationAddress?: string;
  
    @ApiPropertyOptional({
      example: 23.8103,
      description: 'Latitude of the event location',
    })
    @IsOptional()
    @Type(() => Number)
    @IsLatitude()
    latitude?: number;
  
    @ApiPropertyOptional({
      example: 90.4125,
      description: 'Longitude of the event location',
    })
    @IsOptional()
    @Type(() => Number)
    @IsLongitude()
    longitude?: number;
  
    @ApiPropertyOptional({
      example: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      description: 'Google place id or map place id',
    })
    @IsOptional()
    @IsString()
    placeId?: string;

  @ApiPropertyOptional({
    enum: ProductCategory,
    example: ProductCategory.CAR,
    description: 'Product category',
  })
  @IsOptional()
  @IsEnum(ProductCategory)
  category?: ProductCategory;

  @ApiPropertyOptional({
    example: ['brake', 'toyota', 'car-parts'],
    description: 'Product tags',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    example: 'Toyota',
    description: 'Car brand',
  })
  @IsOptional()
  @IsString()
  carBrand?: string;

  @ApiPropertyOptional({
    example: 'Corolla',
    description: 'Car model',
  })
  @IsOptional()
  @IsString()
  carModel?: string;

  @ApiProperty({
    example: 8500,
    description: 'Product price',
  })
  @IsInt()
  @Min(0)
  price!: number;

  @ApiProperty({
    example: 12,
    description: 'Available quantity',
  })
  @IsInt()
  @Min(0)
  quantity!: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Show WhatsApp number to buyers',
  })
  @IsOptional()
  @IsBoolean()
  showWhatsappNo?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Highlight product (default false)',
  })
  @IsOptional()
  @IsBoolean()
  highlightProduct?: boolean;
}