import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { BikeController } from './bike.controller';
import { BikeService } from './bike.service';

@Module({
  controllers: [BikeController],
  providers: [BikeService, PrismaService],
  exports: [BikeService],
})
export class BikeModule {}