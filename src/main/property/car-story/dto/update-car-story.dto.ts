import { PartialType } from '@nestjs/swagger';
import { CreateCarStoryDto } from './create-car-story.dto';

export class UpdateCarStoryDto extends PartialType(CreateCarStoryDto) {}