import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommentsQueryDto, CreateCommentDto, UpdateCommentDto } from './dto/create.comment.dto';


@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async createComment(createCommentDto: CreateCommentDto) {
    const { userId, postId, postType, content } = createCommentDto;

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

    // Create comment and increment post comment count
    const [comment] = await this.prisma.$transaction([
      this.prisma.comment.create({
        data: {
          userId,
          postId,
          postType,
          content
        },
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
      this.prisma.post.update({
        where: { id: postId },
        data: { comment: { increment: 1 } }
      })
    ]);

    return comment;
  }

  async updateComment(id: string, userId: string, updateCommentDto: UpdateCommentDto) {
    // Check if comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this comment');
    }

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: { content: updateCommentDto.content },
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
    });

    return updatedComment;
  }

  async deleteComment(id: string, userId: string) {
    // Check if comment exists
    const comment = await this.prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Check if user owns the comment
    if (comment.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this comment');
    }

    // Delete comment and decrement post comment count
    await this.prisma.$transaction([
      this.prisma.comment.delete({
        where: { id }
      }),
      this.prisma.post.update({
        where: { id: comment.postId },
        data: { comment: { decrement: 1 } }
      })
    ]);

    return { message: 'Comment deleted successfully' };
  }

  async getPostComments(postId: string, queryDto: CommentsQueryDto) {
    const { page = 1, limit = 20, postType } = queryDto;
    const skip = (page - 1) * limit;

    // Check if post exists
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const where: any = { postId };
    if (postType) where.postType = postType;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
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
      this.prisma.comment.count({ where })
    ]);

    return {
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getUserComments(userId: string, queryDto: CommentsQueryDto) {
    const { page = 1, limit = 20, postType } = queryDto;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const where: any = { userId };
    if (postType) where.postType = postType;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          postId: true,
          postType: true,
          content: true,
          createdAt: true
        }
      }),
      this.prisma.comment.count({ where })
    ]);

    return {
      data: comments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getCommentById(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
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
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
