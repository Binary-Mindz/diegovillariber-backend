import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class SubmitSplitScreenDto {
  @ApiProperty({ example: 'https://cdn.example.com/uploads/bmw-front.jpg' })
  @IsString()
  mediaUrl: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/uploads/bmw-front-thumb.jpg' })
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'My competition entry' })
  @IsString()
  caption?: string;
}