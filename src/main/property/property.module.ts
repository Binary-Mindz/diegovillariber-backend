import { Module } from "@nestjs/common";
import { GarageModule } from "./garage/garage.module";

@Module({
  imports: [GarageModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class PropertyModule {}