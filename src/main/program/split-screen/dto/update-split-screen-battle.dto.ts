import { PartialType } from '@nestjs/swagger';
import { CreateSplitScreenBattleDto } from './create-split-screen-battle.dto';

export class UpdateSplitScreenBattleDto extends PartialType(CreateSplitScreenBattleDto) {}