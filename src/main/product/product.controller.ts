import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { GetUser } from '@/common/decorator/get-user.decorator';
import { handleRequest } from '@/common/helpers/handle.request';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

import { CreateHighlightDto } from './dto/create-highlight.dto';
import { ProductFeedQueryDto } from './dto/product-feed-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  // =========================
  // Product CRUD
  // =========================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product listing' })
  async createProduct(
    @GetUser('userId') userId: string,
    @Body() dto: CreateProductDto,
  ) {
    return handleRequest(async () => {
      const product = await this.productsService.createProduct(userId, dto);
      return product;
    }, 'Product created successfully');
  }

  @Get('feed')
  @ApiOperation({ summary: 'Get product feed (search, filters, sorting, pagination)' })
  async feed(@Query() query: ProductFeedQueryDto) {
    return this.productsService.getFeed(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my products' })
  async myProducts(@GetUser('userId') userId: string) {
    return handleRequest(async () => {
      const data = await this.productsService.getMyProducts(userId);
      return data;
    }, 'My products fetched successfully');
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single product by id' })
  @ApiResponse({ status: 200 })
  async getSingleProduct(@Param('id') id: string) {
    return handleRequest(async () => {
      const product = await this.productsService.getSingleProduct(id);
      return product;
    }, 'Product fetched successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update product (only owner can update)' })
  async updateProduct(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Body() dto: UpdateProductDto,
  ) {
    return handleRequest(async () => {
      const product = await this.productsService.updateProduct(id, userId, dto);
      return product;
    }, 'Product updated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product (only owner can delete)' })
  @ApiResponse({ status: 200 })
  async deleteProduct(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const result = await this.productsService.deleteProduct(id, userId);
      return result;
    }, 'Product deleted successfully');
  }

  // =========================
  // Highlight (Paid Boost)
  // =========================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/highlight')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Request highlight (creates PENDING highlight entry for this product)',
  })
  async requestHighlight(
    @Param('id') productId: string,
    @GetUser('userId') userId: string,
    @Body() dto: CreateHighlightDto,
  ) {
    return handleRequest(async () => {
      const highlight = await this.productsService.requestHighlight(
        userId,
        productId,
        dto,
      );
      return highlight;
    }, 'Highlight request created successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('highlight/:highlightId/confirm-payment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm payment and activate highlight (PENDING -> ACTIVE)',
  })
  async confirmHighlightPayment(
    @Param('highlightId') highlightId: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const highlight = await this.productsService.confirmHighlightPayment(
        userId,
        highlightId,
      );
      return highlight;
    }, 'Payment confirmed. Highlight activated successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('highlight/:highlightId/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel highlight (owner only)' })
  async cancelHighlight(
    @Param('highlightId') highlightId: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const highlight = await this.productsService.cancelHighlight(userId, highlightId);
      return highlight;
    }, 'Highlight cancelled successfully');
  }
}