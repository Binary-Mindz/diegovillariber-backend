import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateAmbassadorProgramDto {
  @ApiProperty({
    example: 'Dhaka Super Cars',
    description: 'Name of the motorsport community or brand',
  })
  @IsString()
  @Length(2, 120)
  motorspotName: string;

  @ApiProperty({
    example: 'Rana Miah',
    description: 'Primary contact person name',
  })
  @IsString()
  @Length(2, 120)
  contactName: string;

  @ApiProperty({
    example: 'rana.miah@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Bangladesh',
  })
  @IsString()
  @Length(2, 80)
  country: string;

  @ApiPropertyOptional({
    example: 'https://www.instagram.com/dhakasupercars',
  })
  @IsOptional()
  @IsString()
  instagramProfile?: string;

  @ApiPropertyOptional({
    example: 'https://www.tiktok.com/@dhakasupercars',
  })
  @IsOptional()
  @IsString()
  tiktokProfile?: string;

  @ApiPropertyOptional({
    example: 'https://www.youtube.com/@dhakasupercars',
  })
  @IsOptional()
  @IsString()
  youTubeChanel?: string;

  @ApiProperty({
    example: 125000,
    description: 'Total followers across all social platforms',
  })
  @IsInt()
  @Min(0)
  totalFollower: number;

  @ApiPropertyOptional({
    example: 'Nissan GTR R35',
  })
  @IsOptional()
  @IsString()
  mainCar?: string;

  @ApiProperty({
    example:
      'I want to represent the brand, promote motorsport culture, and engage the community through events and social media.',
  })
  @IsString()
  @Length(10, 2000)
  whyDoYouWant: string;

  @ApiPropertyOptional({
    example:
      '3+ years of experience organizing car meets and collaborating with automotive brands.',
  })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  releventExperience?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/uploads/profile/rana.jpg',
    description: 'Profile photo URL or stored file path',
  })
  @IsOptional()
  @IsString()
  profilePhoto?: string;
}
