import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { AutoInviteScope, BattleAccessType, BattleMediaType, BattleStatus, CameraRequirement, ParticipationScope } from 'generated/prisma/enums';


export class CreateHeadToHeadBattleDto {
  @ApiProperty({ example: 'Night Street Photography Battle' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Shoot the best night street photo. No heavy edits.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: BattleMediaType, example: BattleMediaType.PHOTO })
  @IsEnum(BattleMediaType)
  mediaType: BattleMediaType;

  @ApiPropertyOptional({ example: 'https://cdn.app.com/covers/cover.jpg' })
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ enum: CameraRequirement, example: CameraRequirement.ANY })
  @IsOptional()
  @IsEnum(CameraRequirement)
  cameraRequirement?: CameraRequirement;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  requireTrueShotVerified?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  rejectEditedPhotos?: boolean;

  @ApiPropertyOptional({ enum: BattleAccessType, example: BattleAccessType.OPEN })
  @IsOptional()
  @IsEnum(BattleAccessType)
  accessType?: BattleAccessType;

  @ApiPropertyOptional({ enum: AutoInviteScope, example: AutoInviteScope.SAME_CITY })
  @IsOptional()
  @IsEnum(AutoInviteScope)
  autoInviteScope?: AutoInviteScope;

  @ApiPropertyOptional({ example: 50, minimum: 1, maximum: 2000 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(2000)
  autoInviteCount?: number;

  @ApiPropertyOptional({ enum: ParticipationScope, example: ParticipationScope.GLOBAL })
  @IsOptional()
  @IsEnum(ParticipationScope)
  participationScope?: ParticipationScope;

  @ApiPropertyOptional({ example: 25, description: 'Used when scope = RADIUS' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20000)
  radiusKm?: number;

  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  locationName?: string;

  @ApiPropertyOptional({ example: 23.8103 })
  @IsOptional()
  latitude?: any;

  @ApiPropertyOptional({ example: 90.4125 })
  @IsOptional()
  longitude?: any;

  @ApiPropertyOptional({ example: 'ChIJ...' })
  @IsOptional()
  @IsString()
  placeId?: string;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2026-03-08T00:00:00.000Z' })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @ApiPropertyOptional({ enum: BattleStatus, example: BattleStatus.DRAFT })
  @IsOptional()
  @IsEnum(BattleStatus)
  status?: BattleStatus;
}