import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SubmitBattlePostDto {
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
