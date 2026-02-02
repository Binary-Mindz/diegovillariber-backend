import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { handleRequest } from '@/common/helpers/handle.request';
import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { HashtagQueryDto } from './dto/hashtag-query.dto';
import { HashtagService } from './hashtag.service';

@ApiTags('Hashtags')
@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create hashtag (Admin)' })
  async createHashtag(@Body() dto: CreateHashtagDto) {
    return handleRequest(
      async () => this.hashtagService.createHashtag(dto),
      'Hashtag created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update hashtag (Admin)' })
  async updateHashtag(
    @Param('id') id: string,
    @Body() dto: UpdateHashtagDto,
  ) {
    return handleRequest(
      async () => this.hashtagService.updateHashtag(id, dto),
      'Hashtag updated successfully',
    );
  }


  @Get()
  @ApiOperation({ summary: 'Get active hashtags (User)' })
  async getHashtags(@Query() query: HashtagQueryDto) {
    return handleRequest(
      async () => this.hashtagService.getHashtags(query),
      'Hashtags fetched successfully',
    );
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending hashtags' })
  async getTrending() {
    return handleRequest(
      async () => this.hashtagService.getTrendingHashtags(),
      'Trending hashtags fetched successfully',
    );
  }
}
