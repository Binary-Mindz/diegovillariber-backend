import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsQueryDto } from './dto/comment-query.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(userId: string, dto: CreateCommentDto) {
    const { postId, postType, content, parentId } = dto;
    const COMMENT_REWARD_POINTS = 1;
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
      if (parentId) {
        const parent = await tx.comment.findUnique({
          where: { id: parentId },
          select: { id: true, postId: true },
        });

        if (!parent) throw new NotFoundException('Parent comment not found');

        if (parent.postId !== postId) {
          throw new BadRequestException(
            'Parent comment does not belong to this post',
          );
        }
      }

      const comment = await tx.comment.create({
        data: {
          userId,
          postId,
          postType,
          content,
          parentId: parentId ?? null,
        },
        include: {
          user: { select: { id: true, username: true, email: true } },
          parent: { select: { id: true, content: true } },
        },
      });

      await tx.post.update({
        where: { id: postId },
        data: { comment: { increment: 1 } },
      });

      await tx.userPoint.create({
        data: {
          userId: post.userId,
          postId: postId,
          commentId: comment.id,
          points: COMMENT_REWARD_POINTS,
        },
      });

      await tx.user.update({
        where: { id: post.userId },
        data: {
          totalPoints: { increment: COMMENT_REWARD_POINTS },
          commentCount: { increment: 1 },
        },
        select: { id: true },
      });

      return comment;
    });
  }

  async updateComment(
    userId: string,
    commentId: string,
    dto: UpdateCommentDto,
  ) {
    const content = dto?.content?.trim();
    if (!content) throw new BadRequestException('Content is required');

    return this.prisma.$transaction(async (tx) => {
      const comment = await tx.comment.findUnique({
        where: { id: commentId },
        select: { id: true, userId: true, postId: true },
      });
      if (!comment) throw new NotFoundException('Comment not found');
      if (comment.userId !== userId) {
        throw new ForbiddenException(
          'You are not allowed to update this comment',
        );
      }
      const updated = await tx.comment.update({
        where: { id: commentId },
        data: { content },
        include: {
          user: { select: { id: true, username: true, email: true } },
          parent: { select: { id: true, content: true } },
        },
      });

      return updated;
    });
  }

  async deleteComment(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this comment',
      );
    }
    await this.prisma.$transaction([
      this.prisma.comment.delete({
        where: { id },
      }),
      this.prisma.post.update({
        where: { id: comment.postId },
        data: { comment: { decrement: 1 } },
      }),
    ]);

    return { message: 'Comment deleted successfully' };
  }

  async getPostComments(postId: string, queryDto: CommentsQueryDto) {
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const sort = queryDto.sort ?? 'new';
    const orderBy =
      sort === 'old'
        ? { createdAt: 'asc' as const }
        : { createdAt: 'desc' as const };
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) throw new NotFoundException('Post not found');

    const where: any = {
      postId,
      ...(queryDto.parentId
        ? { parentId: queryDto.parentId }
        : { parentId: null }),
    };

    const [total, comments] = await this.prisma.$transaction([
      this.prisma.comment.count({ where }),
      this.prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true } },
          ...(queryDto.includeReplies
            ? {
                replies: {
                  orderBy: { createdAt: 'asc' },
                  include: {
                    user: { select: { id: true, username: true } },
                  },
                },
              }
            : {}),
        },
      }),
    ]);

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserComments(userId: string, queryDto: CommentsQueryDto) {
    const page = queryDto.page ?? 1;
    const limit = queryDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const sort = queryDto.sort ?? 'new';
    const orderBy =
      sort === 'old'
        ? { createdAt: 'asc' as const }
        : { createdAt: 'desc' as const };
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const where: any = {
      userId,
      ...(queryDto.parentId ? { parentId: queryDto.parentId } : {}),
    };

    const [total, comments] = await this.prisma.$transaction([
      this.prisma.comment.count({ where }),
      this.prisma.comment.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          post: { select: { id: true, caption: true, mediaUrl: true } },
          user: { select: { id: true, username: true } },
          ...(queryDto.includeReplies
            ? {
                replies: {
                  orderBy: { createdAt: 'asc' },
                  include: {
                    user: { select: { id: true, username: true } },
                  },
                },
              }
            : {}),
        },
      }),
    ]);

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
