import { Module } from "@nestjs/common";
import { BattleModule } from "./battle/battle.module";
import { ChallengeModule } from "./challenge/challenge.module";
import { EventModule } from "./event/event.module";



@Module({
  imports: [BattleModule, ChallengeModule, EventModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}