import { PartialType } from '@nestjs/swagger';
import { CreateLabTimeDto } from './create-lab-time.dto';

export class UpdateLabTimeDto extends PartialType(CreateLabTimeDto) {}  