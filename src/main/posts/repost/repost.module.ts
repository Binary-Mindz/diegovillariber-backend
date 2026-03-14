import { Module } from '@nestjs/common';
import { RepostController } from './repost.controller';
import { RepostService } from './repost.service';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
  controllers: [RepostController],
  providers: [RepostService, PrismaService],
  exports: [RepostService],
})
export class RepostModule {}