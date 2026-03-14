import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MapController } from './map.controller';
import { MapService } from './map.service';

@Module({
  controllers: [MapController],
  providers: [MapService, PrismaService],
  exports: [MapService],
})
export class MapModule {}