import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class SubmitChallengePostDto {
  @ApiProperty({ example: 'challenge-uuid-here' })
  @IsUUID('4')
  challengeId: string;

  @ApiPropertyOptional({ example: 'caption...' })
  @IsOptional()
  @IsString()
  @MaxLength(2200)
  caption?: string;

  @ApiPropertyOptional({ example: 'https://cdn.com/img.jpg' })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
