import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateLikeDto, LikesQueryDto, PostType, UnlikeDto } from './dto/create.like.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async createLike(createLikeDto: CreateLikeDto) {
    const { userId, postId, postType } = createLikeDto;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType
        }
      }
    });

    if (existingLike) {
      throw new ConflictException('You have already liked this post');
    }

    // Create like and increment post like count
    const [like] = await this.prisma.$transaction([
      this.prisma.like.create({
        data: {
          userId,
          postId,
          postType
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { like: { increment: 1 } }
      })
    ]);

    return like;
  }

  async removeLike(unlikeDto: UnlikeDto) {
    const { userId, postId, postType } = unlikeDto;

    // Check if like exists
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType
        }
      }
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    // Remove like and decrement post like count
    await this.prisma.$transaction([
      this.prisma.like.delete({
        where: {
          userId_postId_postType: {
            userId,
            postId,
            postType
          }
        }
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { like: { decrement: 1 } }
      })
    ]);

    return { message: 'Like removed successfully' };
  }

  async getPostLikes(postId: string, queryDto: LikesQueryDto) {
    const { page = 1, limit = 20, postType } = queryDto;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const where: any = { postId };
    if (postType) where.postType = postType;

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              profile: {
                select: {
                  userName: true,
                  imageUrl: true
                }
              }
            }
          }
        }
      }),
      this.prisma.like.count({ where })
    ]);

    return {
      data: likes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserLikes(userId: string, queryDto: LikesQueryDto) {
    const { page = 1, limit = 20, postType } = queryDto;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const where: any = { userId };
    if (postType) where.postType = postType;

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          postId: true,
          postType: true,
          createdAt: true
        }
      }),
      this.prisma.like.count({ where })
    ]);

    return {
      data: likes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async checkIfLiked(userId: string, postId: string, postType: PostType) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType
        }
      }
    });

    return { isLiked: !!like };
  }
}

