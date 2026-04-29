import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import {
  CreateWishlistDto,
  RemoveWishlistDto,
  WishlistQueryDto,
} from './dto/create-wishlist.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async addToWishlist(userId: string, dto: CreateWishlistDto) {
    const product = await this.prisma.productList.findUnique({
      where: { id: dto.productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const exists = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Product already added to wishlist');
    }

    return this.prisma.wishList.create({
      data: {
        userId,
        productId: dto.productId,
      },
      include: {
        product: true,
      },
    });
  }

  async removeFromWishlist(userId: string, dto: RemoveWishlistDto) {
    const wishlist = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishList.delete({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    return {
      removed: true,
      productId: dto.productId,
    };
  }

  async getMyWishlist(userId: string, query: WishlistQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.WishListWhereInput = {
      userId,
      ...(query.search
        ? {
            product: {
              OR: [
                {
                  title: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
                {
                  description: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
                {
                  carBrand: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
                {
                  carModel: {
                    contains: query.search,
                    mode: 'insensitive',
                  },
                },
              ],
            },
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wishList.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: {
            include: {
              owner: {
                select: {
                  id: true,
                  email: true,
                },
              },
              car: true,
            },
          },
        },
      }),
      this.prisma.wishList.count({ where }),
    ]);

    const formattedItems = items.map((item) => ({
      id: item.id,
      createdAt: item.createdAt,
      product: {
        ...item.product,
        isWishListed: true,
      },
    }));

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items: formattedItems,
    };
  }

  async getProductWishlists(productId: string, query: WishlistQueryDto) {
    const product = await this.prisma.productList.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wishList.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.wishList.count({
        where: { productId },
      }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async checkWishlist(userId: string, productId: string) {
    const wishlist = await this.prisma.wishList.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return {
      isWishListed: !!wishlist,
      wishlistId: wishlist?.id ?? null,
      createdAt: wishlist?.createdAt ?? null,
    };
  }
}