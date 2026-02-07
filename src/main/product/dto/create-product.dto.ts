import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from 'generated/prisma/enums';

export class CreateProductDto {
  @ApiProperty({
    example: 'Toyota Brake Pad',
    description: 'Product title',
  })
  @IsString()
  title: string;

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
    enum: ProductCategory,
    example: ProductCategory.Car_Parts,
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
  price: number;

  @ApiProperty({
    example: 12,
    description: 'Available quantity',
  })
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Show WhatsApp number to buyers',
  })
  @IsOptional()
  @IsBoolean()
  showWhatsappNo?: boolean;
}