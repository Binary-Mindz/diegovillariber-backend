// src/products/product.service.ts
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { ProductCategory, Role } from 'generated/prisma/enums';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFeedQueryDto } from './dto/product-feed-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(ownerId: string, dto: CreateProductDto) {
    await this.prisma.$transaction(async (tx) => {
      const product = await tx.productList.create({
        data: {
          ownerId,
          title: dto.title,
          productImage: dto.productImage ?? null,
          description: dto.description ?? null,
          location: dto.location ?? null,
          locationAddress: dto.locationAddress ?? null,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          placeId: dto.placeId ?? null,
          category: dto.category ?? ProductCategory.CAR,
          tags: dto.tags ?? [],
          carBrand: dto.carBrand ?? null,
          carModel: dto.carModel ?? null,
          price: dto.price,
          quantity: dto.quantity,
          showWhatsappNo: dto.showWhatsappNo ?? false,
          highlightProduct: dto.highlightProduct ?? false,
          isSold: dto.isSold ?? false,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  id: true,
                  imageUrl: true,
                  profileName: true,
                },
                take: 1,
              },
            },
          },
        },
      });

      if (dto.highlightProduct) {
        await tx.user.update({
          where: { id: ownerId },
          data: {
            totalPoints: { decrement: 300 },
          },
        });

        await tx.userPoint.create({
          data: {
            userId: ownerId,
            sourceType: 'PRODUCT',
            sourceId: product.id,
            earnBy: 'HIGHLIGHT_PRODUCT',
            points: -300,
            note: 'Point deducted for highlighting product',
          },
        });
      }

      return {
        statusCode: 201,
        data: {
          id: product.id,
          title: product.title,
          productImage: product.productImage,
          description: product.description,
          location: product.location,
          locationAddress: product.locationAddress,
          latitude: product.latitude,
          longitude: product.longitude,
          placeId: product.placeId,
          category: product.category,
          tags: product.tags,
          carBrand: product.carBrand,
          carModel: product.carModel,
          price: product.price,
          quantity: product.quantity,
          showWhatsappNo: product.showWhatsappNo,
          highlightProduct: product.highlightProduct,
          isSold: product.isSold,
          createdAt: product.createdAt,
          owner: {
            id: product.owner?.id ?? null,
            email: product.owner?.email ?? null,
            profileId: product.owner?.profile?.[0]?.id ?? null,
            profileName: product.owner?.profile?.[0]?.profileName ?? null,
            imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
          },
        },
      };
    });
  }

  async getFeed(query: ProductFeedQueryDto) {
    const page = Math.max(Number(query.page ?? 1), 1);
    const limit = Math.min(Math.max(Number(query.limit ?? 10), 1), 100);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductListWhereInput = {
      price: { gt: 0 },
    };

    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { carBrand: { contains: q, mode: 'insensitive' } },
        { carModel: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    if (query.category) where.category = query.category;

    if (query.carBrand?.trim()) {
      where.carBrand = { contains: query.carBrand.trim(), mode: 'insensitive' };
    }

    if (query.carModel?.trim()) {
      where.carModel = { contains: query.carModel.trim(), mode: 'insensitive' };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.productList.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ highlightProduct: 'desc' }, { createdAt: 'desc' }],
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: {
                select: { id: true, imageUrl: true, profileName: true },
                take: 1,
              },
            },
          },
        },
      }),
      this.prisma.productList.count({ where }),
    ]);

    const data = items.map((product) => ({
      id: product.id,
      title: product.title,
      productImage: product.productImage,
      description: product.description,
      location: product.location,
      locationAddress: product.locationAddress,
      latitude: product.latitude,
      longitude: product.longitude,
      placeId: product.placeId,
      category: product.category,
      tags: product.tags,
      carBrand: product.carBrand,
      carModel: product.carModel,
      price: product.price,
      quantity: product.quantity,
      showWhatsappNo: product.showWhatsappNo,
      highlightProduct: product.highlightProduct,
      isSold: product.isSold,
      createdAt: product.createdAt,
      owner: {
        id: product.owner?.id ?? null,
        email: product.owner?.email ?? null,
        profileId: product.owner?.profile?.[0]?.id ?? null,
        profileName: product.owner?.profile?.[0]?.profileName ?? null,
        imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
      },
    }));

    return {
      statusCode: 200,
      data: {
        items: data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    };
  }

  async getHighlightedProducts() {
    const items = await this.prisma.productList.findMany({
      where: { highlightProduct: true },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { id: true, imageUrl: true, profileName: true },
              take: 1,
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      data: items.map((product) => ({
        id: product.id,
        title: product.title,
        productImage: product.productImage,
        description: product.description,
        location: product.location,
        locationAddress: product.locationAddress,
        latitude: product.latitude,
        longitude: product.longitude,
        placeId: product.placeId,
        category: product.category,
        tags: product.tags,
        carBrand: product.carBrand,
        carModel: product.carModel,
        price: product.price,
        quantity: product.quantity,
        showWhatsappNo: product.showWhatsappNo,
        highlightProduct: product.highlightProduct,
        isSold: product.isSold,
        createdAt: product.createdAt,
        owner: {
          id: product.owner?.id ?? null,
          email: product.owner?.email ?? null,
          profileId: product.owner?.profile?.[0]?.id ?? null,
          profileName: product.owner?.profile?.[0]?.profileName ?? null,
          imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
        },
      })),
    };
  }

  async getMyProducts(ownerId: string) {
    const items = await this.prisma.productList.findMany({
      where: { ownerId },
      orderBy: [{ highlightProduct: 'desc' }, { createdAt: 'desc' }],
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      data: items.map((product) => ({
        id: product.id,
        title: product.title,
        productImage: product.productImage,
        description: product.description,
        location: product.location,
        locationAddress: product.locationAddress,
        latitude: product.latitude,
        longitude: product.longitude,
        placeId: product.placeId,
        category: product.category,
        tags: product.tags,
        carBrand: product.carBrand,
        carModel: product.carModel,
        price: product.price,
        quantity: product.quantity,
        showWhatsappNo: product.showWhatsappNo,
        highlightProduct: product.highlightProduct,
        isSold: product.isSold,
        createdAt: product.createdAt,
        owner: {
          id: product.owner?.id ?? null,
          email: product.owner?.email ?? null,
          profileId: product.owner?.profile?.[0]?.id ?? null,
          profileName: product.owner?.profile?.[0]?.profileName ?? null,
          imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
        },
      })),
    };
  }

  async getSingleProduct(id: string) {
    const product = await this.prisma.productList.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      statusCode: 200,
      data: {
        id: product.id,
        title: product.title,
        productImage: product.productImage,
        description: product.description,
        location: product.location,
        locationAddress: product.locationAddress,
        latitude: product.latitude,
        longitude: product.longitude,
        placeId: product.placeId,
        category: product.category,
        tags: product.tags,
        carBrand: product.carBrand,
        carModel: product.carModel,
        price: product.price,
        quantity: product.quantity,
        showWhatsappNo: product.showWhatsappNo,
        highlightProduct: product.highlightProduct,
        isSold: product.isSold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        owner: {
          id: product.owner?.id ?? null,
          email: product.owner?.email ?? null,
          profileId: product.owner?.profile?.[0]?.id ?? null,
          profileName: product.owner?.profile?.[0]?.profileName ?? null,
          imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
        },
      },
    };
  }

  async updateProduct(id: string, ownerId: string, dto: UpdateProductDto) {
    const current = await this.prisma.productList.findUnique({
      where: { id },
    });

    if (!current) {
      throw new NotFoundException('Product not found');
    }

    if (current.ownerId !== ownerId) {
      throw new ForbiddenException('Not your product');
    }

    if (dto.price !== undefined && dto.price < 0) {
      throw new BadRequestException('Price cannot be negative');
    }

    if (dto.quantity !== undefined && dto.quantity < 0) {
      throw new BadRequestException('Quantity cannot be negative');
    }

    const product = await this.prisma.productList.update({
      where: { id },
      data: {
        title: dto.title ?? undefined,
        productImage: dto.productImage ?? undefined,
        description: dto.description ?? undefined,
        location: dto.location ?? undefined,
        locationAddress: dto.locationAddress ?? undefined,
        latitude: dto.latitude ?? undefined,
        longitude: dto.longitude ?? undefined,
        placeId: dto.placeId ?? undefined,
        category: dto.category ?? undefined,
        tags: dto.tags ?? undefined,
        carBrand: dto.carBrand ?? undefined,
        carModel: dto.carModel ?? undefined,
        price: dto.price ?? undefined,
        quantity: dto.quantity ?? undefined,
        showWhatsappNo: dto.showWhatsappNo ?? undefined,
        isSold: dto.isSold ?? undefined, // Owner can now update isSold state (true/false)
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      data: {
        id: product.id,
        title: product.title,
        productImage: product.productImage,
        description: product.description,
        location: product.location,
        locationAddress: product.locationAddress,
        latitude: product.latitude,
        longitude: product.longitude,
        placeId: product.placeId,
        category: product.category,
        tags: product.tags,
        carBrand: product.carBrand,
        carModel: product.carModel,
        price: product.price,
        quantity: product.quantity,
        showWhatsappNo: product.showWhatsappNo,
        highlightProduct: product.highlightProduct,
        isSold: product.isSold,
        updatedAt: product.updatedAt,
        owner: {
          id: product.owner?.id ?? null,
          email: product.owner?.email ?? null,
          profileId: product.owner?.profile?.[0]?.id ?? null,
          profileName: product.owner?.profile?.[0]?.profileName ?? null,
          imageUrl: product.owner?.profile?.[0]?.imageUrl ?? null,
        },
      },
    };
  }

  async deleteProduct(id: string, userId: string) {
    const product = await this.prisma.productList.findUnique({
      where: { id },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isOwner = product.ownerId === userId;
    const isAdmin = user.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Only owner or admin can delete this product',
      );
    }

    await this.prisma.productList.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      data: {
        deleted: true,
        productId: id,
      },
    };
  }

  async setHighlight(ownerId: string, productId: string, on: boolean) {
    const product = await this.prisma.productList.findUnique({
      where: { id: productId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('Not your product');
    }

    if (on === true && product.highlightProduct === true) {
      throw new BadRequestException('Already highlighted');
    }

    if (on === false && product.highlightProduct === false) {
      throw new BadRequestException('Already unhighlighted');
    }

    const updated = await this.prisma.productList.update({
      where: { id: productId },
      data: { highlightProduct: on },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                imageUrl: true,
                profileName: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return {
      statusCode: 200,
      data: {
        id: updated.id,
        title: updated.title,
        highlightProduct: updated.highlightProduct,
        isSold: updated.isSold,
        updatedAt: updated.updatedAt,
        owner: {
          id: updated.owner?.id ?? null,
          email: updated.owner?.email ?? null,
          profileId: updated.owner?.profile?.[0]?.id ?? null,
          profileName: updated.owner?.profile?.[0]?.profileName ?? null,
          imageUrl: updated.owner?.profile?.[0]?.imageUrl ?? null,
        },
      },
    };
  }
}
