import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class CreateBattleEntryDto {
  @ApiProperty({ example: 'https://cdn.example.com/post1.jpg' })
  @IsString()
  mediaUrl: string;

  @ApiPropertyOptional({ example: 'My best shot from trackday!' })
  @IsOptional()
  @IsString()
  @Length(0, 2000)
  caption?: string;
}
