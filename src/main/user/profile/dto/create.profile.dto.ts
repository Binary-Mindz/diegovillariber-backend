import { IsString, IsOptional, IsEnum, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AccountType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export enum ProfileType {
  SPOTTER = 'SPOTTER',
  OWNER = 'OWNER',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  BUSINESS = 'BUSINESS',
  PRO_DRIVER = 'PRO_DRIVER',
  SIM_RACING = 'SIM_RACING'
}
export class CreateProfileDto {
  @ApiProperty({ description: 'User ID (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Username' })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiPropertyOptional({ description: 'Bio' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({ description: 'Profile image URL' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
  @ApiPropertyOptional({ description: 'Instagram handler' })
  @IsString()
  @IsOptional()
  instagramHandler?: string;

  @ApiPropertyOptional({ enum: AccountType, default: AccountType.PUBLIC })
  @IsEnum(AccountType)
  @IsOptional()
  accountType?: AccountType;

  @ApiProperty({ enum: ProfileType, description: 'Profile type' })
  @IsEnum(ProfileType)
  @IsNotEmpty()
  profileType: ProfileType;
}