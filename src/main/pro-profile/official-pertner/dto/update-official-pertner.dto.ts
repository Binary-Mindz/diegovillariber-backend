import { PartialType } from '@nestjs/swagger';
import { CreateOfficialPartnerDto } from './create-official-pertner.dto';


export class UpdateOfficialPartnerDto extends PartialType(CreateOfficialPartnerDto) {}
