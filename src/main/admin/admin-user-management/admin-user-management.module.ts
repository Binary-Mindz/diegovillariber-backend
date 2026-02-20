import { Module } from '@nestjs/common';
import { AdminUserManagementController } from './admin-user-management.controller';
import { AdminUserManagementService } from './admin-user-management.service';


@Module({
  imports: [],
  controllers: [AdminUserManagementController],
  providers: [AdminUserManagementService],
  exports: [],
})
export class AdminUserManagementModule {}