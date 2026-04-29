import { PartialType } from '@nestjs/swagger';
import { CreateSubmitLabTimeDto } from './create-submit-lab-time.dto';

export class UpdateSubmitLabTimeDto extends PartialType(CreateSubmitLabTimeDto) {}