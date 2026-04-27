import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import {
  CreateWishlistDto,
  RemoveWishlistDto,
  WishlistQueryDto,
} from './dto/create-wishlist.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add post to wishlist' })
  @ApiResponse({ status: 201, description: 'Post added to wishlist successfully' })
  async addToWishlist(
    @GetUser('userId') userId: string,
    @Body() dto: CreateWishlistDto,
  ) {
    return handleRequest(
      async () => {
        return this.wishlistService.addToWishlist(userId, dto);
      },
      'Post added to wishlist successfully',
      HttpStatus.CREATED,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove post from wishlist' })
  @ApiResponse({ status: 200, description: 'Post removed from wishlist successfully' })
  async removeFromWishlist(
    @GetUser('userId') userId: string,
    @Body() dto: RemoveWishlistDto,
  ) {
    return handleRequest(
      async () => {
        return this.wishlistService.removeFromWishlist(userId, dto);
      },
      'Post removed from wishlist successfully',
      HttpStatus.OK,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wishlist posts' })
  async getMyWishlist(
    @GetUser('userId') userId: string,
    @Query() query: WishlistQueryDto,
  ) {
    const result = await this.wishlistService.getMyWishlist(userId, query);

    return {
      success: true,
      ...result,
    };
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all wishlist users for a post' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  async getPostWishlists(
    @Param('postId') postId: string,
    @Query() query: WishlistQueryDto,
  ) {
    const result = await this.wishlistService.getPostWishlists(postId, query);

    return {
      success: true,
      ...result,
    };
  }

  @Get('check/:postId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if logged-in user wishlisted a post' })
  @ApiParam({ name: 'postId', description: 'Post UUID' })
  async checkWishlist(
    @GetUser('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    const result = await this.wishlistService.checkWishlist(userId, postId);

    return {
      success: true,
      data: result,
    };
  }
}