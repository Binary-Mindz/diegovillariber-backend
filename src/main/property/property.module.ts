import { Module } from "@nestjs/common";
import { GarageModule } from "./garage/garage.module";
import { CarModule } from "./car/car.module";
import { VirtualGarageModule } from "./virtual-garage/virtual-garage.module";
import { BikeModule } from "./bike/bike.module";
import { CarStoryModule } from "./car-story/car-story.module";

@Module({
  imports: [GarageModule, CarModule, BikeModule, VirtualGarageModule, CarStoryModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PropertyModule {}