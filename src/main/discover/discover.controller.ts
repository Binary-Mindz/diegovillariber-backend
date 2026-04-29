import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { handleRequest } from '@/common/helpers/handle.request';
import { DiscoverService } from './discover.service';
import { GlobalSearchDto } from './dto/global-search-query.dto';
import { GetTrendingHashtagsDto } from './dto/get-trending-hashtag.dto';


@ApiTags('Discover')
@Controller('discover')
export class DiscoverController {
  constructor(private readonly discoverService: DiscoverService) {}

  @Get('global-search')
  @ApiOperation({ summary: 'Global search for users, posts and events' })
  async globalSearch(@Query() dto: GlobalSearchDto) {
    const response = await handleRequest(
      () => this.discoverService.globalSearch(dto),
      'Global search fetched successfully',
    );

    return response;
  }

@Get('trending-hashtags')
@ApiOperation({ summary: 'Get trending hashtags with preview media' })
async getTrendingHashtags(@Query() dto: GetTrendingHashtagsDto) {
  return handleRequest(
    () => this.discoverService.getTrendingHashtags(dto),
    'Trending hashtags fetched successfully',
  );
}
}