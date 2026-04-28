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
  Res,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';

import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { handleRequest } from '@/common/helpers/handle.request';

import { CreateHashtagDto } from './dto/create-hashtag.dto';
import { UpdateHashtagDto } from './dto/update-hashtag.dto';
import { HashtagQueryDto } from './dto/hashtag-query.dto';
import { HashtagService } from './hashtag.service';
import { GetUser } from '../../../common/decorator/get-user.decorator';

@ApiTags('Hashtags')
@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create hashtag' })
  async createHashtag(
    @Body() dto: CreateHashtagDto,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => this.hashtagService.createHashtag(dto, userId),
      'Hashtag created successfully',
      HttpStatus.CREATED,
    );

    res.status(response.statusCode);
    return response;
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update hashtag' })
  async updateHashtag(
    @Param('id') id: string,
    @Body() dto: UpdateHashtagDto,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => this.hashtagService.updateHashtag(id, dto, userId),
      'Hashtag updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete hashtag ' })
  async deleteHashtag(
  @Param('id') id: string,
  @GetUser('userId') userId: string,
  @Res({ passthrough: true }) res: Response,
) {
  const response = await handleRequest(
    async () => this.hashtagService.deleteHashtag(id, userId),
    'Hashtag deleted successfully',
  );

  res.status(response.statusCode);
  return response;
}

  @Get()
  @ApiOperation({ summary: 'Get active hashtags' })
  async getHashtags(
    @Query() query: HashtagQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      async () => this.hashtagService.getHashtags(query),
      'Hashtags fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('trending')
  @ApiOperation({ summary: 'Get trending hashtags' })
  async getTrending(@Res({ passthrough: true }) res: Response) {
    const response = await handleRequest(
      async () => this.hashtagService.getTrendingHashtags(),
      'Trending hashtags fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}