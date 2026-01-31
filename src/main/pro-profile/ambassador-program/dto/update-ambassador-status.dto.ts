import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AmbassadorStatusDto } from './ambassador-program-query.dto';

export class UpdateAmbassadorStatusDto {
  @ApiProperty({ enum: AmbassadorStatusDto, example: 'APPROVED' })
  @IsEnum(AmbassadorStatusDto)
  status: AmbassadorStatusDto;
}
