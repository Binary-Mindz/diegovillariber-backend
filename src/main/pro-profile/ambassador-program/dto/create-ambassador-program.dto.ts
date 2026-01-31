import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateAmbassadorProgramDto {
  @ApiProperty()
  @IsString()
  @Length(2, 120)
  motorspotName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 120)
  contactName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @Length(2, 80)
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instagramProfile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tiktokProfile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  youTubeChanel?: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  totalFollower: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  mainCar?: string;

  @ApiProperty()
  @IsString()
  @Length(10, 2000)
  whyDoYouWant: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  releventExperience?: string;

  @ApiPropertyOptional({ description: 'Profile photo URL or stored path' })
  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
