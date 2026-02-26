import { PartialType } from '@nestjs/swagger';
import { CreateRawShiftBattleDto } from './create-rawshift-battle.dto';

export class UpdateRawShiftBattleDto extends PartialType(CreateRawShiftBattleDto) {}