import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

// your DB uses string: 'ACTIVE' | 'INACTIVE' (based on your checks)
export class UpdateChallengeStatusDto {
  @ApiProperty({ example: 'ACTIVE', enum: ['ACTIVE', 'INACTIVE'] })
  @IsIn(['ACTIVE', 'INACTIVE'])
  isActive: 'ACTIVE' | 'INACTIVE';
}