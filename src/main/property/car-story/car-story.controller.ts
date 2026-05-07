import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';
import { CarStoryService } from './car-story.service';
import { CreateCarStoryDto } from './dto/create-car-story.dto';
import { UpdateCarStoryDto } from './dto/update-car-story.dto';
import { CreateCarMilestoneDto } from './dto/create-car-milestone.dto';
import { UpdateCarMilestoneDto } from './dto/update-car-milestone.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Car Story')
@Controller('car-stories')
export class CarStoryController {
  constructor(private readonly carStoryService: CarStoryService) {}

  @ApiOperation({ summary: 'Create car story' })
  @Post()
  async createStory(
    @GetUser('userId') userId: string,
    @Body() dto: CreateCarStoryDto,
  ) {
    return handleRequest(
      async () => this.carStoryService.createStory(userId, dto),
      'Car story created successfully',
    );
  }

  @ApiOperation({ summary: 'Get my car stories' })
  @Get()
  async getMyStories(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.carStoryService.getMyStories(userId),
      'Car stories fetched successfully',
    );
  }

  @ApiOperation({ summary: 'Get car story details' })
  @ApiParam({ name: 'storyId', type: String })
  @Get(':storyId')
  async getStoryDetails(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
  ) {
    return handleRequest(
      async () => this.carStoryService.getStoryDetails(userId, storyId),
      'Car story details fetched successfully',
    );
  }

  @ApiOperation({ summary: 'Update car story' })
  @Patch(':storyId')
  async updateStory(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
    @Body() dto: UpdateCarStoryDto,
  ) {
    return handleRequest(
      async () => this.carStoryService.updateStory(userId, storyId, dto),
      'Car story updated successfully',
    );
  }

  @ApiOperation({ summary: 'Delete car story' })
  @Delete(':storyId')
  async deleteStory(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
  ) {
    return handleRequest(
      async () => this.carStoryService.deleteStory(userId, storyId),
      'Car story deleted successfully',
    );
  }

  @ApiOperation({ summary: 'Create car milestone' })
  @Post(':storyId/milestones')
  async createMilestone(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
    @Body() dto: CreateCarMilestoneDto,
  ) {
    return handleRequest(
      async () => this.carStoryService.createMilestone(userId, storyId, dto),
      'Milestone created successfully',
    );
  }

  @ApiOperation({ summary: 'Update car milestone' })
  @Patch(':storyId/milestones/:milestoneId')
  async updateMilestone(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
    @Param('milestoneId') milestoneId: string,
    @Body() dto: UpdateCarMilestoneDto,
  ) {
    return handleRequest(
      async () =>
        this.carStoryService.updateMilestone(
          userId,
          storyId,
          milestoneId,
          dto,
        ),
      'Milestone updated successfully',
    );
  }

  @ApiOperation({ summary: 'Delete car milestone' })
  @Delete(':storyId/milestones/:milestoneId')
  async deleteMilestone(
    @GetUser('userId') userId: string,
    @Param('storyId') storyId: string,
    @Param('milestoneId') milestoneId: string,
  ) {
    return handleRequest(
      async () =>
        this.carStoryService.deleteMilestone(userId, storyId, milestoneId),
      'Milestone deleted successfully',
    );
  }
}