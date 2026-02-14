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
  @ApiOperation({
    summary: 'Get product feed (search, filters, sorting, pagination)',
  })
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
  // Highlight (Boolean Toggle)
  // =========================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/highlight')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Highlight product (sets highlightProduct=true) - owner only',
  })
  async highlightOn(
    @Param('id') productId: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const product = await this.productsService.setHighlight(userId, productId, true);
      return product;
    }, 'Product highlighted successfully');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/unhighlight')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Unhighlight product (sets highlightProduct=false) - owner only',
  })
  async highlightOff(
    @Param('id') productId: string,
    @GetUser('userId') userId: string,
  ) {
    return handleRequest(async () => {
      const product = await this.productsService.setHighlight(userId, productId, false);
      return product;
    }, 'Product unhighlighted successfully');
  }
}