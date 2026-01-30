import { Body, Controller, Delete, Get, HttpStatus, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SaveService } from "./save.service";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { GetUser } from "@/common/decorator/get-user.decorator";
import { SavePostDto } from "./dto/save-post.dto";
import { handleRequest } from "@/common/helpers/handle.request";
import { UnsavePostDto } from "./dto/unsave-post.dto";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('SavePost')
@Controller('saves')
export class SaveController {
  constructor(private readonly saveService: SaveService) {}


  @ApiOperation({ summary: 'Save a post' })
  @ApiResponse({ status: 201, description: 'Post saved successfully' })
  @Post()
  async savePost(
    @GetUser('userId') userId: string,
    @Body() dto: SavePostDto,
  ) {
    return handleRequest(
      async () => this.saveService.savePost(userId, dto),
      'Post saved successfully',
      HttpStatus.CREATED,
    );
  }


  @ApiOperation({ summary: 'Unsave a post' })
  @ApiResponse({ status: 200, description: 'Post unsaved successfully' })
  @Delete()
  async unsavePost(
    @GetUser('userId') userId: string,
    @Body() dto: UnsavePostDto,
  ) {
    return handleRequest(
      async () => this.saveService.unsavePost(userId, dto),
      'Post unsaved successfully',
      HttpStatus.OK,
    );
  }

  
  @ApiOperation({ summary: 'Get my saved posts' })
  @ApiResponse({ status: 200, description: 'Saved posts fetched successfully' })
  @Get('me')
  async getMySavedPosts(@GetUser('userId') userId: string) {
    return handleRequest(
      async () => this.saveService.getMySavedPosts(userId),
      'Saved posts fetched successfully',
      HttpStatus.OK,
    );
  }

  
  @ApiOperation({ summary: 'Check if post is saved' })
  @ApiResponse({ status: 200 })
  @Get('check')
  async isPostSaved(
    @GetUser('userId') userId: string,
    @Query('postId') postId: string,
  ) {
    return handleRequest(
      async () => this.saveService.isPostSaved(userId, postId),
      'Saved status fetched',
      HttpStatus.OK,
    );
  }

}