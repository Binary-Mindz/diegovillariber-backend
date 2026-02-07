import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateHighlightDto } from './dto/create-highlight.dto';
import { ProductFeedQueryDto } from './dto/product-feed-query.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { HighlightStatus, ProductCategory } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // Controller required methods (FIX your TS errors)
  // =========================

  // 1) createProduct
  async createProduct(ownerId: string, dto: CreateProductDto) {
    return this.prisma.productList.create({
      data: {
        ownerId,
        title: dto.title,
        productImage: dto.productImage ?? null,
        description: dto.description ?? null,
        category: (dto.category as any) ?? ProductCategory.Car_Parts,
        tags: dto.tags ?? [],
        carBrand: dto.carBrand ?? null,
        carModel: dto.carModel ?? null,
        price: dto.price,
        quantity: dto.quantity,
        showWhatsappNo: dto.showWhatsappNo ?? false,
      },
    });
  }

  // 2) getFeed (public list with filters + pagination + highlighted first)
  async getFeed(query: ProductFeedQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    // filter
    const where: Prisma.ProductListWhereInput = {};

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { carBrand: { contains: q, mode: 'insensitive' } },
        { carModel: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category as any;
    }

    // We want highlighted ACTIVE (not expired) to appear first.
    // Prisma can't "orderBy exists relation" easily, so we fetch + sort.
    const [rows, total] = await Promise.all([
      this.prisma.productList.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          highlightProducts: {
            where: { status: HighlightStatus.ACTIVE, endDate: { gt: now } },
            orderBy: { endDate: 'desc' },
            take: 1,
          },
        },
      }),
      this.prisma.productList.count({ where }),
    ]);

    // sort highlighted first
    const sorted = [...rows].sort((a, b) => {
      const aH = a.highlightProducts?.length ? 1 : 0;
      const bH = b.highlightProducts?.length ? 1 : 0;
      if (aH !== bH) return bH - aH;
      // fallback: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return {
      page,
      limit,
      total,
      data: sorted,
    };
  }

  // 3) getMyProducts (just wrapper of your existing myProducts)
  async getMyProducts(ownerId: string) {
    return this.myProducts(ownerId);
  }

  // তোমার existing method (already there)
  async myProducts(ownerId: string) {
    return this.prisma.productList.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
      include: {
        highlightProducts: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
  }

  // 4) getSingleProduct
  async getSingleProduct(id: string) {
    const product = await this.prisma.productList.findUnique({
      where: { id },
      include: {
        highlightProducts: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // 5) updateProduct
  async updateProduct(id: string, ownerId: string, dto: UpdateProductDto) {
    const current = await this.prisma.productList.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Product not found');
    if (current.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    return this.prisma.productList.update({
      where: { id },
      data: {
        title: dto.title ?? undefined,
        productImage: dto.productImage ?? undefined,
        description: dto.description ?? undefined,
        category: (dto.category as any) ?? undefined,
        tags: dto.tags ?? undefined,
        carBrand: dto.carBrand ?? undefined,
        carModel: dto.carModel ?? undefined,
        price: dto.price ?? undefined,
        quantity: dto.quantity ?? undefined,
        showWhatsappNo: dto.showWhatsappNo ?? undefined,
      },
    });
  }

  // 6) deleteProduct
  async deleteProduct(id: string, ownerId: string) {
    const current = await this.prisma.productList.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Product not found');
    if (current.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    await this.prisma.productList.delete({ where: { id } });
    return { success: true };
  }

  // =========================
  // Highlight methods (already in your earlier plan)
  // =========================

  async requestHighlight(ownerId: string, productId: string, dto: CreateHighlightDto) {
    const product = await this.prisma.productList.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    const active = await this.prisma.highlightProduct.findFirst({
      where: { productId, status: HighlightStatus.ACTIVE, endDate: { gt: new Date() } },
    });
    if (active) throw new BadRequestException('This product is already highlighted');

    return this.prisma.highlightProduct.create({
      data: {
        productId,
        durationHours: dto.durationHours,
        chargeAmount: dto.chargeAmount,
        status: HighlightStatus.PENDING,
      },
    });
  }

  async confirmHighlightPayment(ownerId: string, highlightId: string) {
    const h = await this.prisma.highlightProduct.findUnique({
      where: { id: highlightId },
      include: { product: true },
    });
    if (!h) throw new NotFoundException('Highlight request not found');
    if (h.product.ownerId !== ownerId) throw new ForbiddenException('Not your product');
    if (h.status !== HighlightStatus.PENDING)
      throw new BadRequestException(`Cannot confirm payment from status ${h.status}`);

    const now = new Date();
    const end = new Date(now.getTime() + h.durationHours * 60 * 60 * 1000);

    return this.prisma.highlightProduct.update({
      where: { id: highlightId },
      data: {
        status: HighlightStatus.ACTIVE,
        paidAt: now,
        startDate: now,
        endDate: end,
      },
    });
  }

  async cancelHighlight(ownerId: string, highlightId: string) {
    const h = await this.prisma.highlightProduct.findUnique({
      where: { id: highlightId },
      include: { product: true },
    });
    if (!h) throw new NotFoundException('Highlight not found');
    if (h.product.ownerId !== ownerId) throw new ForbiddenException('Not your product');

    if (h.status === HighlightStatus.EXPIRED) throw new BadRequestException('Already expired');

    return this.prisma.highlightProduct.update({
      where: { id: highlightId },
      data: { status: HighlightStatus.CANCELLED },
    });
  }

  async listPublic() {
    const now = new Date();
    return this.prisma.productList.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        highlightProducts: {
          where: { status: HighlightStatus.ACTIVE, endDate: { gt: now } },
          orderBy: { endDate: 'desc' },
          take: 1,
        },
      },
    });
  }
}