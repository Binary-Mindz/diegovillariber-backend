import { Module } from "@nestjs/common";

import { EventModule } from "./event/event.module";
import { RawShiftModule } from "./raw-shift/rawshift.module";
import { HeadToHeadModule } from "./head-to-head/head-to-head.module";
import { PrizeModule } from "./prize/prize.module";
import { ChallengeModule } from "./challenge/challenge.module";
import { LabTimeModule } from "./lab-time/lab-time.module";
import { SubmitLabTimeModule } from "./submit-lab-time/submit-lab-time.module";
import { VirtualSimEventModule } from "./virtual-sim-event/virtual-sim-event.module";

@Module({
  imports: [PrizeModule,EventModule, RawShiftModule, HeadToHeadModule, ChallengeModule, LabTimeModule, SubmitLabTimeModule, VirtualSimEventModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}