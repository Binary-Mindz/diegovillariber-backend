import { Module } from "@nestjs/common";
import { OfficialPartnerModule } from "./official-pertner/official-pertner.module";
import { AmbassadorProgramModule } from "./ambassador-program/ambassador-program.module";


@Module({
  imports: [OfficialPartnerModule, AmbassadorProgramModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class ProProfileModule {}
