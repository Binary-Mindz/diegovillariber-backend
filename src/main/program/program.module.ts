import { Module } from "@nestjs/common";

import { EventModule } from "./event/event.module";
import { RawShiftModule } from "./raw-shift/rawshift.module";
import { HeadToHeadModule } from "./head-to-head/head-to-head.module";
import { PrizeModule } from "./prize/prize.module";
import { ChallengeModule } from "./challenge/challenge.module";
import { LabTimeModule } from "./lab-time/lab-time.module";

@Module({
  imports: [PrizeModule,EventModule, RawShiftModule, HeadToHeadModule, ChallengeModule, LabTimeModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}