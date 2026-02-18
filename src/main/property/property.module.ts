import { Module } from "@nestjs/common";
import { GarageModule } from "./garage/garage.module";
import { CarModule } from "./car/car.module";

@Module({
  imports: [GarageModule, CarModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PropertyModule {}