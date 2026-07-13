import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationModule } from '@/main/notification/notification.module';
import { NotificationService } from '@/main/notification/notification.service';
import { Module } from '@nestjs/common';
import { ChallengeCronService } from './challenge-cron.service';
import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';

@Module({
  imports: [NotificationModule],
  controllers: [ChallengeController],
  providers: [
    ChallengeService,
    ChallengeCronService,
    PrismaService,
    NotificationService,
  ],
  exports: [ChallengeService],
})
export class ChallengeModule {}
