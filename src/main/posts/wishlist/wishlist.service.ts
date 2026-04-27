import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateWishlistDto,
  RemoveWishlistDto,
  WishlistQueryDto,
} from './dto/create-wishlist.dto';
import { PrismaService } from '../../../common/prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async addToWishlist(userId: string, dto: CreateWishlistDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: dto.postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const exists = await this.prisma.wishList.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (exists) {
      throw new ConflictException('Post already added to wishlist');
    }

    return this.prisma.wishList.create({
      data: {
        userId,
        postId: dto.postId,
      },
      include: {
        post: true,
      },
    });
  }

  async removeFromWishlist(userId: string, dto: RemoveWishlistDto) {
    const wishlist = await this.prisma.wishList.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Wishlist item not found');
    }

    await this.prisma.wishList.delete({
      where: {
        userId_postId: {
          userId,
          postId: dto.postId,
        },
      },
    });

    return {
      removed: true,
      postId: dto.postId,
    };
  }

  async getMyWishlist(userId: string, query: WishlistQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(query.search
        ? {
            post: {
              caption: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
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
          post: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                },
              },
              profile: {
                select: {
                  id: true,
                  profileName: true,
                  imageUrl: true,
                },
              },
              car: true,
              bike: true,
            },
          },
        },
      }),
      this.prisma.wishList.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    };
  }

  async getPostWishlists(postId: string, query: WishlistQueryDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.wishList.findMany({
        where: { postId },
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
        where: { postId },
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

  async checkWishlist(userId: string, postId: string) {
    const wishlist = await this.prisma.wishList.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return {
      isWishlisted: !!wishlist,
      wishlistId: wishlist?.id ?? null,
      createdAt: wishlist?.createdAt ?? null,
    };
  }
}