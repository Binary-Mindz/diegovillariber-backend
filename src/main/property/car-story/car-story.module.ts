import { Module } from '@nestjs/common';
import { CarStoryController } from './car-story.controller';
import { CarStoryService } from './car-story.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [CarStoryController],
  providers: [CarStoryService, PrismaService],
  exports: [CarStoryService],
})
export class CarStoryModule {}