import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

import {
  AdStatus,
  BannerHeight,
  BannerWidth,
  LinkType,
  Placement,
  Preference,
} from 'generated/prisma/enums';

export class CreateAdDto {
  @ApiProperty({
    example: 'Premium Car Care Banner',
    description: 'Advertisement title',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    enum: LinkType,
    example: LinkType.EXTERNAL_LINK,
    description: 'Type of ad link',
  })
  @IsEnum(LinkType)
  link!: LinkType;

  @ApiProperty({
    example: 'https://example.com/landing-page',
    description: 'Primary link URL',
  })
  @IsString()
  linkUrl!: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/banner.jpg',
    description: 'Banner image URL',
  })
  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Local audience ratio',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  localRatio?: number;

  @ApiPropertyOptional({
    example: 30,
    description: 'National audience ratio',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  nationRatio?: number;

  @ApiPropertyOptional({
    example: '50',
    description: 'Worldwide distribution value',
  })
  @IsOptional()
  @IsString()
  worldWide?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/product-details',
    description: 'Target redirect URL',
  })
  @IsOptional()
  @IsString()
  targetUrl?: string;

  @ApiPropertyOptional({
    example: 'Premium ad banner',
    description: 'Alt text for banner',
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({
    example: '2026-03-15T00:00:00.000Z',
    description: 'Ad start date',
  })
  @IsDateString()
  startDate!: string;

  @ApiProperty({
    example: '2026-04-15T23:59:59.000Z',
    description: 'Ad end date',
  })
  @IsDateString()
  endDate!: string;

  @ApiPropertyOptional({
    enum: Preference,
    example: Preference.CAR,
  })
  @IsOptional()
  @IsEnum(Preference)
  vehicleType?: Preference;

  @ApiPropertyOptional({
    enum: Placement,
    example: Placement.ALL,
  })
  @IsOptional()
  @IsEnum(Placement)
  placement?: Placement;

  @ApiPropertyOptional({
    example: 100,
    description: 'Minimum user point required',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumPoint?: number;

  @ApiPropertyOptional({
    example: 10000,
    description: 'Maximum user point allowed',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maximumPoint?: number;

  @ApiPropertyOptional({
    example: 5000,
    description: 'Maximum ad cap',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  cap?: number;

  @ApiPropertyOptional({
    example: '50',
    description: 'Daily budget',
  })
  @IsOptional()
  @IsString()
  dailyBudget?: string;

  @ApiPropertyOptional({
    example: '1000',
    description: 'Total budget',
  })
  @IsOptional()
  @IsString()
  totalBudget?: string;

  @ApiPropertyOptional({
    example: 'BD',
    description: 'Country code',
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({
    example: 'en,bn',
    description: 'Target languages',
  })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({
    example: 'cars,premium,oil',
    description: 'Ad tags',
  })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  spotter?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  proDriver?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  owner?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  proBussiness?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  contentCreator?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  simRacingDriver?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  enableAdGlobally?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Show ad sequence/order',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  showAd?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Maximum ad per page',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAdPerPage?: number;

  @ApiPropertyOptional({
    example: 10,
    description: 'Rotation interval in seconds/minutes based on your app logic',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  rotationIntervel?: number;

  @ApiPropertyOptional({
    enum: BannerWidth,
    example: BannerWidth.FULL_WIDTH,
  })
  @IsOptional()
  @IsEnum(BannerWidth)
  bannerWidth?: BannerWidth;

  @ApiPropertyOptional({
    enum: BannerHeight,
    example: BannerHeight.AUTO_HEIGHT,
  })
  @IsOptional()
  @IsEnum(BannerHeight)
  bannerHeight?: BannerHeight;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  prioritize?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  autoPause?: boolean;

  @ApiPropertyOptional({
    example: 5,
    description: 'Minimum CTR threshold',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  minimumCTR?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  enableBannerAnimation?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  autoRotationEnabled?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  previewMode?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showFeed?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showProfile?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  showMarketPlace?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  showEvent?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  showChallenges?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  showBattle?: boolean;

  @ApiPropertyOptional({
    enum: AdStatus,
    example: AdStatus.PAUSE,
    description: 'Initial ad status',
  })
  @IsOptional()
  @IsEnum(AdStatus)
  adStatus?: AdStatus;
}