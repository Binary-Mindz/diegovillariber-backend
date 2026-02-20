import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminUserManagementService } from "./admin-user-management.service";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags('Admin User Management')
@Controller('admin-user-management')
export class AdminUserManagementController {
  constructor(private readonly adminUserManagementService: AdminUserManagementService) { }
 
  @Get('stats')
  getUsersWithStats() {
    return this.adminUserManagementService.getAllUsersWithStats();
  }
  
}