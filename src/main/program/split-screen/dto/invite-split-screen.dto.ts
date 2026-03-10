import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsUUID, Max, Min } from 'class-validator';

export class InviteSplitScreenDto {
  @ApiProperty({ example: '7c954a6e-65f2-4cca-a7f2-0cf370e18e30' })
  @IsUUID()
  inviteeId: string;

  @ApiPropertyOptional({ example: 48 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(168)
  expiresInHours?: number;
}