import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventStatusJob } from './event-status.job';


@Module({
  controllers: [EventController],
  providers: [EventService, EventStatusJob],
})
export class EventModule {}