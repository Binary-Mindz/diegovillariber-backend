import { PartialType } from '@nestjs/swagger';
import { CreateVirtualGarageDto } from './create-virtual-garage.dto';

export class UpdateVirtualGarageDto extends PartialType(CreateVirtualGarageDto) {}