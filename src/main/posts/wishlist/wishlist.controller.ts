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
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({
    status: 201,
    description: 'Product added to wishlist successfully',
  })
  async addToWishlist(
    @GetUser('userId') userId: string,
    @Body() dto: CreateWishlistDto,
  ) {
    return handleRequest(
      async () => {
        return this.wishlistService.addToWishlist(userId, dto);
      },
      'Product added to wishlist successfully',
      HttpStatus.CREATED,
    );
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Product removed from wishlist successfully',
  })
  async removeFromWishlist(
    @GetUser('userId') userId: string,
    @Body() dto: RemoveWishlistDto,
  ) {
    return handleRequest(
      async () => {
        return this.wishlistService.removeFromWishlist(userId, dto);
      },
      'Product removed from wishlist successfully',
      HttpStatus.OK,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get my wishlist products' })
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

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all wishlist users for a product' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  async getProductWishlists(
    @Param('productId') productId: string,
    @Query() query: WishlistQueryDto,
  ) {
    const result = await this.wishlistService.getProductWishlists(
      productId,
      query,
    );

    return {
      success: true,
      ...result,
    };
  }

  @Get('check/:productId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check if logged-in user wishlisted a product' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  async checkWishlist(
    @GetUser('userId') userId: string,
    @Param('productId') productId: string,
  ) {
    const result = await this.wishlistService.checkWishlist(userId, productId);

    return {
      success: true,
      data: result,
    };
  }
}