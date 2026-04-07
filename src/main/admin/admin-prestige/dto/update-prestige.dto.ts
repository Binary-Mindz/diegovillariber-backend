import { PartialType } from '@nestjs/swagger';
import { CreatePrestigeDto } from './create-prestige.dto';

export class UpdatePrestigeDto extends PartialType(CreatePrestigeDto) {}