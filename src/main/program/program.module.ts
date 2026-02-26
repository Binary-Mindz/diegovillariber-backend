import { Module } from "@nestjs/common";

import { EventModule } from "./event/event.module";
import { RawShiftModule } from "./raw-shift/rawshift.module";
import { HeadToHeadModule } from "./head-to-head/head-to-head.module";

@Module({
  imports: [EventModule, RawShiftModule, HeadToHeadModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}