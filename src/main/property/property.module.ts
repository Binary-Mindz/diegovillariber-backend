import { Module } from "@nestjs/common";
import { GarageModule } from "./garage/garage.module";
import { CarModule } from "./car/car.module";
import { VirtualGarageModule } from "./virtual-garage/virtual-garage.module";

@Module({
  imports: [GarageModule, CarModule, VirtualGarageModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PropertyModule {}