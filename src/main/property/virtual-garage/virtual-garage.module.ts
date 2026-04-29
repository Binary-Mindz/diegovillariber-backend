import { Module } from '@nestjs/common';
import { VirtualGarageController } from './virtual-garage.controller';
import { PrismaService } from '@/common/prisma/prisma.service';
import { VirtualGarageService } from './dto/virtual-garage.service';

@Module({
  controllers: [VirtualGarageController],
  providers: [VirtualGarageService, PrismaService],
  exports: [VirtualGarageService],
})
export class VirtualGarageModule {}