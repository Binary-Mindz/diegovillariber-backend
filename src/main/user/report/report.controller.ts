import { Controller, Post, Delete, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { ReportService } from './report.service';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { ReportDto } from './dto/report-dto';
import { handleRequest } from '@/common/helpers/handle.request';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Report')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @ApiOperation({ summary: 'Create a report' })
  @Post()
  async createReport(
    @GetUser('userId') userId: string,
    @Body() dto: ReportDto,
  ) {
    return handleRequest(
      async () => this.reportService.createReport(userId, dto),
      'Report created successfully',
    );
  }

  @ApiOperation({ summary: 'Remove a report' })
  @Delete(':targetType/:targetId')
  async removeReport(
    @GetUser('userId') userId: string,
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    return handleRequest(
      async () =>
        this.reportService.removeReport(userId, targetId, targetType),
      'Report removed successfully',
    );
  }

  @ApiOperation({ summary: 'Get my reports' })
  @Get()
  async getUserReports(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.reportService.getUserReports(userId),
      'User reports fetched successfully',
    );
  }
}
