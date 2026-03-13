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
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create product listing' })
  async createProduct(
    @GetUser('userId') userId: string,
    @Body() dto: CreateProductDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.createProduct(userId, dto),
      'Product created successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get('feed')
  @ApiOperation({
    summary: 'Get product feed (search, filters, sorting, pagination)',
  })
  async feed(
    @Query() query: ProductFeedQueryDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.getFeed(query),
      'Product feed fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get my products' })
  async myProducts(
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.getMyProducts(userId),
      'My products fetched successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single product by id' })
  @ApiResponse({ status: 200 })
  async getSingleProduct(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.getSingleProduct(id),
      'Product fetched successfully',
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.updateProduct(id, userId, dto),
      'Product updated successfully',
    );

    res.status(response.statusCode);
    return response;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete product (owner or admin)' })
  async deleteProduct(
    @Param('id') id: string,
    @GetUser('userId') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.deleteProduct(id, userId),
      'Product deleted successfully',
    );

    res.status(response.statusCode);
    return response;
  }

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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.setHighlight(userId, productId, true),
      'Product highlighted successfully',
    );

    res.status(response.statusCode);
    return response;
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
    @Res({ passthrough: true }) res: Response,
  ) {
    const response = await handleRequest(
      () => this.productsService.setHighlight(userId, productId, false),
      'Product unhighlighted successfully',
    );

    res.status(response.statusCode);
    return response;
  }
}