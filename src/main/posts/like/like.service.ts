import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  CreateLikeDto,
  LikesQueryDto,
  PostType,
  UnlikeDto,
} from './dto/create.like.dto';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) { }



  async createLike(userId: string, dto: CreateLikeDto) {
    const { postId, postType } = dto;

    const LIKE_REWARD_POINTS = 1;

    return this.prisma.$transaction(async (tx) => {
  
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, username: true },
      });
      if (!user) throw new NotFoundException('User not found');

      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { id: true, userId: true },
      });
      if (!post) throw new NotFoundException('Post not found');

      const existing = await tx.like.findUnique({
        where: { userId_postId_postType: { userId, postId, postType } },
        select: { id: true },
      });
      if (existing) throw new ConflictException('You have already liked this post');

      const like = await tx.like.create({
        data: { userId, postId, postType },
        include: {
          user: { select: { id: true, username: true, email: true } },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { like: { increment: 1 } },
      });


      await tx.userPoint.create({
        data: {
          userId: post.userId, 
          postId: postId,
          likeId: like.id,
          points: LIKE_REWARD_POINTS,
        },
      });

      await tx.user.update({
        where: { id: post.userId },
        data: { totalPoints: { increment: LIKE_REWARD_POINTS }, likeCount: { increment: 1 } },
        select: { id: true },
      });

      return like;
    });
  }


async unlike(userId: string, dto: CreateLikeDto) {
  const { postId, postType } = dto;
  const LIKE_REWARD_POINTS = 1;

  return this.prisma.$transaction(async (tx) => {
   
    const like = await tx.like.findUnique({
      where: { userId_postId_postType: { userId, postId, postType } },
      select: { id: true },
    });
    if (!like) throw new NotFoundException('Like not found');


    const post = await tx.post.findUnique({
      where: { id: postId },
      select: { id: true, userId: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    await tx.like.delete({
      where: { userId_postId_postType: { userId, postId, postType } },
    });


    await tx.post.update({
      where: { id: postId },
      data: { like: { decrement: 1 } },
    });

    await tx.userPoint.create({
      data: {
        userId: post.userId,     
        postId,
        likeId: null,       
        points: -LIKE_REWARD_POINTS,
      },
    });

    await tx.user.update({
      where: { id: post.userId },
      data: {
        totalPoints: { decrement: LIKE_REWARD_POINTS },
        likeCount: { decrement: 1 },
      },
    });

    return { unliked: true, postId };
  });
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
              username: true,
              email: true,
              profile: {
                select: {
                  userName: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.like.count({ where }),
    ]);

    return {
      data: likes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
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
          createdAt: true,
        },
      }),
      this.prisma.like.count({ where }),
    ]);

    return {
      data: likes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async checkIfLiked(userId: string, postId: string, postType: PostType) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_postId_postType: {
          userId,
          postId,
          postType,
        },
      },
    });

    return { isLiked: !!like };
  }
}
