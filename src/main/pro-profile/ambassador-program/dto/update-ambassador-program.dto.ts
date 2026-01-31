import { PartialType } from '@nestjs/swagger';
import { CreateAmbassadorProgramDto } from './create-ambassador-program.dto';

export class UpdateAmbassadorProgramDto extends PartialType(CreateAmbassadorProgramDto) {}
