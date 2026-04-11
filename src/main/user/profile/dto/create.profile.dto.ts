import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  AccountType,
  Type as ProfileType,
  BusinessCategory,
  ContentCategory,
  Preference,
  VehicleCategory,
  SteeringWheel,
  WheelModel,
  WheelBase,
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
  @ApiPropertyOptional({ enum: VehicleCategory, example: VehicleCategory.MOTOCROSS })
  @IsOptional()
  @IsEnum(VehicleCategory)
  racingDiscipline?: VehicleCategory;

  @ApiProperty({ example: 'Chittagong Circuit' })
  @IsString()
  @IsNotEmpty()
  location!: string;
}

/* ---------------- Sim Racing ---------------- */
export class HardwareSetupDto {
  @ApiPropertyOptional({ enum: SteeringWheel, example: SteeringWheel.FANATEC })
  @IsOptional()
  @IsEnum(SteeringWheel)
  steeringWheel?: SteeringWheel;

  @ApiPropertyOptional({ enum: WheelModel, example: WheelModel.LOGITECH })
  @IsOptional()
  @IsEnum(WheelModel)
  wheelModel?: WheelModel;

  @ApiPropertyOptional({ enum: WheelBase, example: WheelBase.DESK_MOUNT })
  @IsOptional()
  @IsEnum(WheelBase)
  wheelbase?: WheelBase;

  // ---- Pedals ----
  @ApiPropertyOptional({ example: 'Heusinkveld' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  pedals?: string;

  // NOTE: model field is `pedelModel` (typo). DTO keeps same name to match Prisma.
  @ApiPropertyOptional({ example: 'Sprint 3-Pedal Set' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  pedelModel?: string;

  // ---- Other Controls ----
  @ApiPropertyOptional({ example: 'Fanatec SQ 1.5' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  shifter?: string;

  @ApiPropertyOptional({ example: 'Heusinkveld Handbrake' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  handbrake?: string;

  @ApiPropertyOptional({ example: 'Aluminium Profile Rig' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  rig?: string;

  @ApiPropertyOptional({ example: 'Sim-Lab' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  rigBrand?: string;

  @ApiPropertyOptional({ example: 'Sparco' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  seatBrand?: string;

  @ApiPropertyOptional({ example: 'BBJ Sim Racing Button Box' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  buttonBox?: string;

  // ---- Accessories ----
  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  bassShakers?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  windSim?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  racingGloves?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  racingShoes?: boolean;
}

export class DisplayAndPcSetupDto {
  @ApiPropertyOptional({ example: 'Triple 32-inch monitors' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  monitors?: string;

  @ApiPropertyOptional({ example: 'Meta Quest 3 / Valve Index' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  vrHeadset?: string;

  @ApiPropertyOptional({ example: 'PC desk in spare room / sim corner setup' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  pcSpace?: string;
}

export class DrivingAssistantDto {
  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  tractionControl?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  abs?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  stability?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  autoClutch?: boolean;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  racingLine?: boolean;
}

export class RacingDto {
  @ApiPropertyOptional({ example: 'iRacing_12345' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  iRacingId?: string;

  @ApiPropertyOptional({ example: 'ACC_Player_01' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  accId?: string;

  @ApiPropertyOptional({ example: '76561198000000000' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  steamId?: string;

  @ApiPropertyOptional({ example: 'PSN_RacerX' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  psnId?: string;

  @ApiPropertyOptional({ example: 'XboxRacerGT' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  xboxGamertag?: string;
}

export class SetupDescriptionPhotoDto {
  @ApiPropertyOptional({ example: 'Optimized GT3 setup' })
  @IsOptional()
  @IsString()
  setupDescription?: string;

  @ApiPropertyOptional({ example: 'https://cdn.app/setup.png' })
  @IsOptional()
  @IsString()
  setupPhoto?: string;
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

  @ApiPropertyOptional({ example: 'Ash' })
  @IsOptional()
  @IsString()
  profileName?: string;

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

  @ApiPropertyOptional({ enum: Preference, example: Preference.CAR })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiProperty({ enum: ProfileType, example: 'PRO_BUSSINESS' })
  @IsEnum(ProfileType)
  profileType!: ProfileType;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  locationStatus?: boolean;

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
