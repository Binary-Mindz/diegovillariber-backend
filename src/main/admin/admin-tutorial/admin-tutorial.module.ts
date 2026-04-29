import { Module } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AdminTutorialController } from './admin-tutorial.controller';
import { AdminTutorialService } from './admin-tutorial.service';

@Module({
  controllers: [AdminTutorialController],
  providers: [AdminTutorialService, PrismaService],
  exports: [AdminTutorialService],
})
export class AdminTutorialModule {}