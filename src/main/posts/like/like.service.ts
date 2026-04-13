import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateLikeDto, LikesQueryDto } from './dto/create.like.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  PostType,
  NotificationType,
  NotificationEntityType,
} from 'generated/prisma/enums';
import { NotificationService } from '@/main/notification/notification.service';

@Injectable()
export class LikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async createLike(userId: string, dto: CreateLikeDto) {
    const { postId, postType } = dto;
    const LIKE_REWARD_POINTS = 1;
    console.log("tried to seed")

    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
      });
      if (!user) throw new NotFoundException('User not found');

      const post = await tx.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          userId: true,
        },
      });
      if (!post) throw new NotFoundException('Post not found');

      const existing = await tx.like.findUnique({
        where: { userId_postId_postType: { userId, postId, postType } },
        select: { id: true },
      });
      if (existing) {
        throw new ConflictException('You have already liked this post');
      }

      const like = await tx.like.create({
        data: { userId, postId, postType },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { like: { increment: 1 } },
      });

      await tx.userPoint.create({
        data: {
          userId,
          sourceType: 'LIKE',
          sourceId: like.id,
          earnBy: 'LIKE_POST',
          points: 1,
          note: 'Point earned from like',
        },
      });

      await tx.user.update({
        where: { id: post.userId },
        data: {
          totalPoints: { increment: LIKE_REWARD_POINTS },
          likeCount: { increment: 1 },
        },
        select: { id: true },
      });

      return {
        like,
        postOwnerId: post.userId,
        actor: user,
      };
    });

    // send notification after successful transaction
    if (result.postOwnerId !== userId) {
      await this.notificationService.sendNotification({
        userId: result.postOwnerId,
        actorUserId: userId,
        type: NotificationType.LIKE,
        title: 'New Like',
        message: `${result.actor.email} liked your post`,
        deepLink: `/posts/${postId}`,
        entityType: NotificationEntityType.POST,
        entityId: postId,
        meta: {
          postId,
          postType,
          likedByUserId: userId,
        },
        groupKey: `post:${postId}:likes`,
      });
    }

    return result.like;
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
          sourceType: 'LIKE',
          sourceId: like.id,
          earnBy: 'UNLIKE_POST',
          points: -LIKE_REWARD_POINTS,
          note: 'Point deducted for removing like',
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

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const where: { postId: string; postType?: PostType } = { postId };
    if (postType) {
      where.postType = postType;
    }

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
              email: true,
              profile: {
                select: {
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

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const where: { userId: string; postType?: PostType } = { userId };
    if (postType) {
      where.postType = postType;
    }

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
