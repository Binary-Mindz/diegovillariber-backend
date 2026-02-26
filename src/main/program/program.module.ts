import { Module } from "@nestjs/common";

import { EventModule } from "./event/event.module";



@Module({
  imports: [EventModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProgramModule {}