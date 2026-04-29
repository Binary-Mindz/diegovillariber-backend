import { Module } from "@nestjs/common";
import { AdminSimRacingController } from "./admin-sim-racing.controller";
import { AdminSimRacingService } from "./admin-sim-racing.service";

@Module({
  controllers: [AdminSimRacingController],
  providers: [AdminSimRacingService],
  exports: [],
})
export class AdminSimRacingModule {}