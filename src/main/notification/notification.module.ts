import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [BullModule.registerQueue({ name: 'notification' })],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService, BullModule],
})
export class NotificationModule {}
