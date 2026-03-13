import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AdStatus } from 'generated/prisma/enums';

export class ChangeAdStatusDto {
  @ApiProperty({
    enum: AdStatus,
    example: AdStatus.ACTIVE,
    description: 'New ad status',
  })
  @IsEnum(AdStatus)
  adStatus: AdStatus;
}