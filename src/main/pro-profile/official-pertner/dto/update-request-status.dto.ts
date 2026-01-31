import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfficialPartnerRequestStatusDto } from './official-pertner.dto';

export class UpdateOfficialPartnerStatusDto {
  @ApiProperty({
    enum: OfficialPartnerRequestStatusDto,
    example: OfficialPartnerRequestStatusDto.APPROVED,
    description: 'Admin decision on the partner request',
  })
  @IsEnum(OfficialPartnerRequestStatusDto)
  requestStatus: OfficialPartnerRequestStatusDto;

  @ApiPropertyOptional({
    example: 'Approved after verification of company documents',
    description: 'Optional admin note or reason',
  })
  @IsOptional()
  @IsString()
  note?: string;
}
