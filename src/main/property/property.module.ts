import { Module } from "@nestjs/common";
import { GarageModule } from "./garage/garage.module";
import { CarModule } from "./car/car.module";
import { VirtualGarageModule } from "./virtual-garage/virtual-garage.module";
import { BikeModule } from "./bike/bike.module";

@Module({
  imports: [GarageModule, CarModule, BikeModule, VirtualGarageModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PropertyModule {}