import { Module } from "@nestjs/common";
import { VirtualSimEventController } from "./virtual-sim-event.controller";
import { VirtualSimEventService } from "./virtual-sim-event.service";
import { PrismaService } from "@/common/prisma/prisma.service";

@Module({
  controllers: [VirtualSimEventController],
  providers: [VirtualSimEventService, PrismaService],
})
export class VirtualSimEventModule {}