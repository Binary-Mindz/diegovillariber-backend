import { Module } from '@nestjs/common';
import { AdminEventManagementController } from './admin-event-management.controller';
import { AdminEventManagementervice } from './admin-event-service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [ 
    CacheModule.register({
      isGlobal: false,
      ttl: 60,
    }),],
  controllers: [AdminEventManagementController],
  providers: [AdminEventManagementervice],
  exports: [],
})
export class AdminEventManagementModule {}