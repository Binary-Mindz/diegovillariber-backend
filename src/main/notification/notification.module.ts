import { Module } from '@nestjs/common';
import { NotificationsController } from './notificaton.controller';
import { NotificationsService } from './notification.service';


@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}