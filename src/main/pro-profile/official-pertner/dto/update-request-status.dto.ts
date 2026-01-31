import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OfficialPartnerRequestStatusDto } from './official-pertner.dto';


export class UpdateOfficialPartnerStatusDto {
  @ApiProperty({ enum: OfficialPartnerRequestStatusDto, example: 'APPROVED' })
  @IsEnum(OfficialPartnerRequestStatusDto)
  requestStatus: OfficialPartnerRequestStatusDto;

  @ApiPropertyOptional({ description: 'Optional admin note' })
  @IsOptional()
  @IsString()
  note?: string;
}
