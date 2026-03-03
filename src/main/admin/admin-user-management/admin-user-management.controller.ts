import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";
import { Roles } from "@/common/decorator/roles.tdecorator";
import { AdminUserManagementService } from "./admin-user-management.service";
import { PostModerationQueryDto } from "./dto/post-mpderation.query.dto";


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiTags('Admin User Management')
@Controller('admin-user-management')
export class AdminUserManagementController {
  constructor(private readonly adminUserManagementService: AdminUserManagementService) { }
 
  @Get('overview')
  getUsersWithStats() {
    return this.adminUserManagementService.getUserGrowthRetentionDashboard();
  }
  @Get('all-users')
  getUsers(){
    return this.adminUserManagementService.getUsers();
  }

  @Get('moderation')
  @ApiOperation({ summary: 'List posts for moderation (All/Photo/Video + pagination)' })
  async list(@Query() query: PostModerationQueryDto) {
    return this.adminUserManagementService.listPostsForModeration(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a post (moderation action)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminUserManagementService.deletePost(id);
  }

  
}