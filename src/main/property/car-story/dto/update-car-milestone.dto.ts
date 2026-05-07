import { PartialType } from '@nestjs/swagger';
import { CreateCarMilestoneDto } from './create-car-milestone.dto';

export class UpdateCarMilestoneDto extends PartialType(CreateCarMilestoneDto) {}