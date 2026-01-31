import { Controller, Post, Patch, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { BattleService } from './battle.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { Roles } from '@/common/decorator/roles.tdecorator';



@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Admin Battles')
@Controller('admin/battles')
export class AdminBattleController {
  constructor(private readonly battleService: BattleService) { }

  @Post()
  @Roles("ADMIN")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Admin creates a battle' })
  @ApiResponse({ status: 201, description: 'Battle created successfully' })
  async create(@GetUser('userId') adminId: string, @Body() dto: CreateBattleDto) {
    return handleRequest(
      async () => this.battleService.createBattle(adminId, dto),
      'Battle created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch(':id/start')
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin starts battle' })
  @ApiResponse({ status: 200, description: 'Battle started successfully' })
  async start(@GetUser('userId') adminId: string, @Param('id') battleId: string) {
    return handleRequest(
      async () => this.battleService.startBattle(adminId, battleId),
      'Battle started successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id/end')
  @Roles("ADMIN")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Admin ends battle + compute winner' })
  @ApiResponse({ status: 200, description: 'Battle ended successfully' })
  async end(@GetUser('userId') adminId: string, @Param('id') battleId: string) {
    return handleRequest(
      async () => this.battleService.endBattle(adminId, battleId),
      'Battle ended successfully',
      HttpStatus.OK,
    );
  }
}
