import { Module } from "@nestjs/common";

import { EventModule } from "./event/event.module";
import { RawShiftModule } from "./raw-shift/rawshift.module";



@Module({
  imports: [EventModule, RawShiftModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}