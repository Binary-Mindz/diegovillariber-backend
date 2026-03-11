import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { MotorsportRankingService } from './motorsport-ranking.service';
import { MotorsportRankingQueryDto } from './dto/motorsport-ranking-query.dto';


@ApiTags('Motorsport Rankings')
@ApiBearerAuth()
@Controller('motorsport-rankings')
@UseGuards(JwtAuthGuard)
export class MotorsportRankingController {
  constructor(
    private readonly motorsportRankingService: MotorsportRankingService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get motorsport rankings' })
  async getRankings(@Query() query: MotorsportRankingQueryDto) {
    return this.motorsportRankingService.getRankings(query);
  }

  @Get('summary')
 @ApiOperation({ summary: 'Get top ranking summary' })
  async getRankingSummary(@Query() query: MotorsportRankingQueryDto) {
    return this.motorsportRankingService.getRankingSummary(query);
  }
}