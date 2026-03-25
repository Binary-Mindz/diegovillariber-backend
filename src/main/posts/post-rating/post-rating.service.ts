import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreatePostRatingDto } from './dto/create-post-rating.dto';


@Injectable()
export class PostRatingService {
  constructor(private readonly prisma: PrismaService) {}

  async ratePost(userId: string, postId: string, dto: CreatePostRatingDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId === userId) {
      throw new BadRequestException('You cannot rate your own post');
    }

    const existingRating = await this.prisma.postRating.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const score = dto.score;

    const result = await this.prisma.$transaction(async (tx) => {
      let savedRating;

      if (existingRating) {
        const diff = score - existingRating.score;

        savedRating = await tx.postRating.update({
          where: {
            userId_postId: {
              userId,
              postId,
            },
          },
          data: {
            score,
          },
        });

        const updatedPost = await tx.post.update({
          where: { id: postId },
          data: {
            ratingTotal: {
              increment: diff,
            },
          },
          select: {
            id: true,
            ratingCount: true,
            ratingTotal: true,
            ratingAverage: true,
          },
        });

        const average =
          updatedPost.ratingCount > 0
            ? updatedPost.ratingTotal / updatedPost.ratingCount
            : 0;

        const finalPost = await tx.post.update({
          where: { id: postId },
          data: {
            ratingAverage: average,
          },
          select: {
            id: true,
            ratingCount: true,
            ratingTotal: true,
            ratingAverage: true,
          },
        });

        return {
          action: 'updated',
          rating: savedRating,
          post: finalPost,
        };
      }

      savedRating = await tx.postRating.create({
        data: {
          userId,
          postId,
          score,
        },
      });

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          ratingCount: {
            increment: 1,
          },
          ratingTotal: {
            increment: score,
          },
        },
        select: {
          id: true,
          ratingCount: true,
          ratingTotal: true,
          ratingAverage: true,
        },
      });

      const average =
        updatedPost.ratingCount > 0
          ? updatedPost.ratingTotal / updatedPost.ratingCount
          : 0;

      const finalPost = await tx.post.update({
        where: { id: postId },
        data: {
          ratingAverage: average,
        },
        select: {
          id: true,
          ratingCount: true,
          ratingTotal: true,
          ratingAverage: true,
        },
      });

      return {
        action: 'created',
        rating: savedRating,
        post: finalPost,
      };
    });

    return {
      postId,
      action: result.action,
      myRating: result.rating.score,
      ratingCount: result.post.ratingCount,
      ratingAverage: Number(result.post.ratingAverage),
    };
  }

  async getPostRatingSummary(postId: string, currentUserId?: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        ratingCount: true,
        ratingAverage: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let myRating: number | null = null;

    if (currentUserId) {
      const existing = await this.prisma.postRating.findUnique({
        where: {
          userId_postId: {
            userId: currentUserId,
            postId,
          },
        },
        select: {
          score: true,
        },
      });

      myRating = existing?.score ?? null;
    }

    return {
      postId: post.id,
      ratingCount: post.ratingCount,
      ratingAverage: Number(post.ratingAverage),
      myRating,
    };
  }

  async removeMyRating(userId: string, postId: string) {
    const existingRating = await this.prisma.postRating.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (!existingRating) {
      throw new NotFoundException('Rating not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.postRating.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });

      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          ratingCount: {
            decrement: 1,
          },
          ratingTotal: {
            decrement: existingRating.score,
          },
        },
        select: {
          id: true,
          ratingCount: true,
          ratingTotal: true,
        },
      });

      const average =
        updatedPost.ratingCount > 0
          ? updatedPost.ratingTotal / updatedPost.ratingCount
          : 0;

      await tx.post.update({
        where: { id: postId },
        data: {
          ratingAverage: average,
        },
      });
    });

    return {
      postId,
      message: 'Rating removed successfully',
    };
  }
}