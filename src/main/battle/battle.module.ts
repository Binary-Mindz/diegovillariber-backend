import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { AdminBattleController } from './admin-battle.controller';
import { BattleService } from './battle.service';

@Module({
  controllers: [BattleController, AdminBattleController],
  providers: [BattleService],
})
export class BattleModule {}
