import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfficialPartnerRequestStatus } from 'generated/prisma/enums';


export class UpdateOfficialPartnerStatusDto {
  @ApiProperty({
    enum: OfficialPartnerRequestStatus,
    example: OfficialPartnerRequestStatus.APPROVED,
    description: 'Admin decision on the partner request',
  })
  @IsEnum(OfficialPartnerRequestStatus)
  requestStatus!: OfficialPartnerRequestStatus;

  @ApiPropertyOptional({
    example: 'Approved after verification of company documents',
    description: 'Optional admin note or reason',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
