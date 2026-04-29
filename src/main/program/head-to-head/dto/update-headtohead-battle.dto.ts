import { PartialType } from '@nestjs/swagger';
import { CreateHeadToHeadBattleDto } from './create-headtohead-battle.dto';

export class UpdateHeadToHeadBattleDto extends PartialType(CreateHeadToHeadBattleDto) {}