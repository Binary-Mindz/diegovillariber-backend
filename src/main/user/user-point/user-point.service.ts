import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

@Injectable()
export class UserPointService {
  constructor(private readonly prisma: PrismaService) {}

 async getMyPointSummary(userId: string) {
  if (!userId) {
    throw new BadRequestException('User id is missing from request');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      totalPoints: true,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return {
    userId: user.id,
    totalPoints: user.totalPoints,
  };
}

  async getMyPointHistory(userId: string, page = 1, limit = 10) {
    if (page < 1) {
      throw new BadRequestException('page must be greater than or equal to 1');
    }

    if (limit < 1 || limit > 50) {
      throw new BadRequestException('limit must be between 1 and 50');
    }

    const skip = (page - 1) * limit;

    const where = { userId };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.userPoint.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: 'desc',
        },
        include: {
          post: {
            select: {
              id: true,
              caption: true,
              mediaUrl: true,
              mediaType: true,
              createdAt: true,
            },
          },
          like: {
            select: {
              id: true,
              postId: true,
            },
          },
          comment: {
            select: {
              id: true,
              postId: true,
              content: true,
            },
          },
          follow: {
            select: {
              id: true,
              followerId: true,
              followingId: true,
            },
          },
        },
      }),
      this.prisma.userPoint.count({ where }),
    ]);

    const mapped = items.map((item) => {
      let sourceType: 'POST' | 'LIKE' | 'COMMENT' | 'FOLLOW' | 'MANUAL' = 'MANUAL';

      if (item.postId) sourceType = 'POST';
      else if (item.likeId) sourceType = 'LIKE';
      else if (item.commentId) sourceType = 'COMMENT';
      else if (item.followId) sourceType = 'FOLLOW';

      return {
        id: item.id,
        points: item.points,
        sourceType,
        postId: item.postId,
        likeId: item.likeId,
        commentId: item.commentId,
        followId: item.followId,
        post: item.post,
        like: item.like,
        comment: item.comment,
        follow: item.follow,
      };
    });

    return {
      data: mapped,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
    };
  }
}