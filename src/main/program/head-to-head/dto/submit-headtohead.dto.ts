import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { SubmissionStatus } from 'generated/prisma/enums';

export class SubmitHeadToHeadDto {
  @ApiProperty({ example: 'https://cdn.app.com/uploads/photo_or_video.mp4' })
  @IsString()
  mediaUrl!: string;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/uploads/thumb.jpg' })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiPropertyOptional({ example: 'Shot on mobile at 1/10s.' })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isTrueShotVerified?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isEditedDetected?: boolean;

  @ApiPropertyOptional({ enum: SubmissionStatus, example: SubmissionStatus.SUBMITTED })
  @IsOptional()
  @IsEnum(SubmissionStatus)
  status?: SubmissionStatus;
}