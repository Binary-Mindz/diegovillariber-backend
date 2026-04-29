import { PartialType } from '@nestjs/swagger';
import { CreateVirtualSimEventDto } from './create-virtual-sim-event.dto';

export class UpdateVirtualSimEventDto extends PartialType(CreateVirtualSimEventDto) {}