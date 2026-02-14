import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';
import { Prisma } from 'generated/prisma/client';
import { ProductCategory } from 'generated/prisma/enums';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFeedQueryDto } from './dto/product-feed-query.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // 1) Create
  async createProduct(ownerId: string, dto: CreateProductDto) {
    return this.prisma.productList.create({
      data: {
        ownerId,
        title: dto.title,
        productImage: dto.productImage ?? null,
        description: dto.description ?? null,
        category: dto.category ?? ProductCategory.Car_Parts,
        tags: dto.tags ?? [],
        carBrand: dto.carBrand ?? null,
        carModel: dto.carModel ?? null,
        price: dto.price,
        quantity: dto.quantity,
        showWhatsappNo: dto.showWhatsappNo ?? false,

        // highlightProduct default false in schema (optional)
        highlightProduct: dto.highlightProduct ?? false,
      },
      include: { owner: true },
    });
  }

  // 2) Feed (highlighted first)
  async getFeed(query: ProductFeedQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductListWhereInput = {};

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { carBrand: { contains: q, mode: 'insensitive' } },
        { carModel: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } }, // exact tag match (optional)
      ];
    }

    if (query.category) where.category = query.category;

    if (query.carBrand?.trim()) {
      where.carBrand = { contains: query.carBrand.trim(), mode: 'insensitive' };
    }
    if (query.carModel?.trim()) {
      where.carModel = { contains: query.carModel.trim(), mode: 'insensitive' };
    }

    // Sorting: highlighted first, then newest
    const [data, total] = await Promise.all([
      this.prisma.productList.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ highlightProduct: 'desc' }, { createdAt: 'desc' }],
        include: { owner: true },
      }),
      this.prisma.productList.count({ where }),
    ]);

    return { page, limit, total, data };
  }

  // 3) My Products
  async getMyProducts(ownerId: string) {
    return this.prisma.productList.findMany({
      where: { ownerId },
      orderBy: [{ highlightProduct: 'desc' }, { createdAt: 'desc' }],
      include: { owner: true },
    });
  }

  // 4) Single
  async getSingleProduct(id: string) {
    const product = await this.prisma.productList.findUnique({
      where: { id },
      include: { owner: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // 5) Update (owner only)
  async updateProduct(id: string, ownerId: string, dto: UpdateProductDto) {
    const current = await this.prisma.productList.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Product not found');
    if (current.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    // (Optional) quantity/price validation
    if (dto.price !== undefined && dto.price < 0)
      throw new BadRequestException('Price cannot be negative');
    if (dto.quantity !== undefined && dto.quantity < 0)
      throw new BadRequestException('Quantity cannot be negative');

    return this.prisma.productList.update({
      where: { id },
      data: {
        title: dto.title ?? undefined,
        productImage: dto.productImage ?? undefined,
        description: dto.description ?? undefined,
        category: dto.category ?? undefined,
        tags: dto.tags ?? undefined,
        carBrand: dto.carBrand ?? undefined,
        carModel: dto.carModel ?? undefined,
        price: dto.price ?? undefined,
        quantity: dto.quantity ?? undefined,
        showWhatsappNo: dto.showWhatsappNo ?? undefined,

        // highlightProduct generally handled via setHighlight(), but keep if you want:
        // highlightProduct: dto.highlightProduct ?? undefined,
      },
      include: { owner: true },
    });
  }

  // 6) Delete (owner only)
  async deleteProduct(id: string, ownerId: string) {
    const current = await this.prisma.productList.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Product not found');
    if (current.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    await this.prisma.productList.delete({ where: { id } });
    return { success: true };
  }

  // Highlight toggle (owner only)
  async setHighlight(ownerId: string, productId: string, on: boolean) {
    const product = await this.prisma.productList.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    if (on === true && product.highlightProduct === true)
      throw new BadRequestException('Already highlighted');
    if (on === false && product.highlightProduct === false)
      throw new BadRequestException('Already unhighlighted');

    return this.prisma.productList.update({
      where: { id: productId },
      data: { highlightProduct: on },
      include: { owner: true },
    });
  }
}