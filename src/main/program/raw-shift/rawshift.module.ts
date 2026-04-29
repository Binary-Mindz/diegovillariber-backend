import { Module } from '@nestjs/common';
import { RawShiftController } from './rawshift.controller';
import { RawShiftService } from './rawshift.service';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  controllers: [RawShiftController],
  providers: [RawShiftService, PrismaService],
  exports: [RawShiftService],
})
export class RawShiftModule {}