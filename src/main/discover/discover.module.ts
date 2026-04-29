import { Module } from '@nestjs/common';
import { DiscoverController } from './discover.controller';
import { DiscoverService } from './discover.service';
import { PrismaService } from '@/common/prisma/prisma.service';


@Module({
  controllers: [DiscoverController],
  providers: [DiscoverService, PrismaService],
  exports: [DiscoverService],
})
export class DiscoverModule {}