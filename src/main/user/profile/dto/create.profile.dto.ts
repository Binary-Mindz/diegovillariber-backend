import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  AccountType,
  Type as ProfileType,
  BusinessCategory,
  RacingType,
  ContentCategory,
} from 'generated/prisma/enums';

/* ---------------- Sub Profiles ---------------- */

export class SpotterProfileDto {}

export class OwnerProfileDto {}

export class ContentCreatorProfileDto {
  @ApiPropertyOptional({ enum: ContentCategory, example: 'PHOTOGRAPHY' })
  @IsOptional()
  @IsEnum(ContentCategory)
  creatorCategory?: ContentCategory;

  @ApiPropertyOptional({ example: 'https://youtube.com/@mychannel' })
  @IsOptional()
  @IsString()
  youtubeChanel?: string;

  @ApiPropertyOptional({ example: 'https://myportfolio.com' })
  @IsOptional()
  @IsString()
  portfolioWebsite?: string;
}

export class BusinessProfileDto {
  @ApiPropertyOptional({ enum: BusinessCategory, example: 'Detailling_Care' })
  @IsOptional()
  @IsEnum(BusinessCategory)
  businessCategory?: BusinessCategory;

  @ApiProperty({ example: 'Rana Auto Care' })
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @ApiProperty({ example: 'Dhaka, Bangladesh' })
  @IsString()
  @IsNotEmpty()
  location!: string;
}

export class ProDriverProfileDto {
  @ApiPropertyOptional({ enum: RacingType, example: 'GT_Racing' })
  @IsOptional()
  @IsEnum(RacingType)
  racingDiscipline?: RacingType;

  @ApiProperty({ example: 'Chittagong Circuit' })
  @IsString()
  @IsNotEmpty()
  location!: string;
}

/* ---------------- Sim Racing ---------------- */

export class HardwareSetupDto {
  @ApiPropertyOptional({ example: 'Fanatec DD Pro' })
  @IsOptional() @IsString() steeringWheel?: string;

  @ApiPropertyOptional({ example: 'Heusinkveld Sprint' })
  @IsOptional() @IsString() pedals?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean() bassShakers?: boolean;
}

export class DisplayAndPcSetupDto {
  @ApiPropertyOptional({ example: 'Triple 32-inch monitors' })
  @IsOptional() @IsString() monitors?: string;

  @ApiPropertyOptional({ example: 'RTX 4090 PC' })
  @IsOptional() @IsString() pcSpace?: string;
}

export class DrivingAssistantDto {
  @ApiPropertyOptional({ example: true })
  @IsOptional() @IsBoolean() tractionControl?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional() @IsBoolean() abs?: boolean;
}

export class RacingDto {
  @ApiPropertyOptional({ example: 'iRacing_12345' })
  @IsOptional() @IsString() iRacingId?: string;
}

export class SetupDescriptionPhotoDto {
  @ApiPropertyOptional({ example: 'Optimized GT3 setup' })
  @IsOptional() @IsString() setupDescription?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app/setup.png' })
  @IsOptional() @IsString() setupPhoto?: string;
}

export class SimRacingProfileDto {
  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => HardwareSetupDto)
  hardwareSetup?: HardwareSetupDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => DisplayAndPcSetupDto)
  displayAndPcSetup?: DisplayAndPcSetupDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => DrivingAssistantDto)
  drivingAssistant?: DrivingAssistantDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => RacingDto)
  racing?: RacingDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SetupDescriptionPhotoDto)
  setupDescription?: SetupDescriptionPhotoDto;
}

/* ---------------- Main DTO ---------------- */

export class CreateProfileDto {
  @ApiPropertyOptional({ example: 'rana_gt3' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ example: 'Car enthusiast & sim racer' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app/avatar.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: '@rana_cars' })
  @IsOptional()
  @IsString()
  instagramHandler?: string;

  @ApiPropertyOptional({ enum: AccountType, example: 'PUBLIC' })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiProperty({ enum: ProfileType, example: 'PRO_BUSSINESS' })
  @IsEnum(ProfileType)
  profileType!: ProfileType;

  /* -------- type-specific payload -------- */

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SpotterProfileDto)
  spotter?: SpotterProfileDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => OwnerProfileDto)
  owner?: OwnerProfileDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => ContentCreatorProfileDto)
  creator?: ContentCreatorProfileDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => BusinessProfileDto)
  business?: BusinessProfileDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => ProDriverProfileDto)
  proDriver?: ProDriverProfileDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SimRacingProfileDto)
  simRacing?: SimRacingProfileDto;
}
