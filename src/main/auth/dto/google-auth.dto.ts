import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType, Preference, Role, Type } from 'generated/prisma/enums';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

class CreatorDto {
  @IsOptional()
  @IsString()
  creatorCategory?: string;

  @IsOptional()
  @IsString()
  youtubeChanel?: string;

  @IsOptional()
  @IsString()
  portfolioWebsite?: string;
}

class BusinessDto {
  @IsOptional()
  @IsString()
  businessCategory?: string;

  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}

class ProDriverDto {
  @IsOptional()
  @IsString()
  racingDiscipline?: string;

  @IsString()
  @IsNotEmpty()
  location!: string;
}

export class GoogleAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  idToken!: string;

  @ApiPropertyOptional({ enum: Role })
  @IsOptional()
  @IsEnum(Role)
  loginAs?: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ enum: Type })
  @IsOptional()
  @IsEnum(Type)
  profileType?: Type;

  @ApiPropertyOptional({ enum: Preference })
  @IsOptional()
  @IsEnum(Preference)
  preference?: Preference;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagramHandler?: string;

  @ApiPropertyOptional({ enum: AccountType })
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  locationStatus?: boolean;

  @ApiPropertyOptional({ type: CreatorDto })
  @IsOptional()
  @IsObject()
  creator?: CreatorDto;

  @ApiPropertyOptional({ type: BusinessDto })
  @IsOptional()
  @IsObject()
  business?: BusinessDto;

  @ApiPropertyOptional({ type: ProDriverDto })
  @IsOptional()
  @IsObject()
  proDriver?: ProDriverDto;
}