import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreatePostDto, Media, PostQueryDto, PostType, UpdatePostDto } from './dto/create.post.dto';


@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createPost(createPostDto: CreatePostDto) {
    const { userId, postType, caption, media, contentBooster, point, hashtagIds } = createPostDto;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Build post data
    const postData: any = {
      userId,
      postType: postType || PostType.SPOTTER_POST,
      caption,
      media: media || Media.PHOTO,
      contentBooster: contentBooster || false,
      point: point || 300,
      like: 0,
      comment: 0,
      share: 0
    };

    // Connect hashtags if provided
    if (hashtagIds && hashtagIds.length > 0) {
      postData.hashtags = {
        connect: hashtagIds.map(id => ({ id }))
      };
    }

    const post = await this.prisma.post.create({
      data: postData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        hashtags: true
      }
    });

    return post;
  }

  async getPosts(queryDto: PostQueryDto) {
    const { page=1, limit=10, postType, userId } = queryDto;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (postType) where.postType = postType;
    if (userId) where.userId = userId;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
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
              email: true
            }
          },
          hashtags: true,
          _count: {
            select: {
              reposts: true,
              savePosts: true
            }
          }
        }
      }),
      this.prisma.post.count({ where })
    ]);

    return {
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPostById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        hashtags: true,
        reposts: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        _count: {
          select: {
            reposts: true,
            savePosts: true,
            racingVotes: true
          }
        }
      }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async updatePost(id: string, userId: string, updatePostDto: UpdatePostDto) {
    // Check if post exists and belongs to user
    const post = await this.prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not have permission to update this post');
    }

    const { caption, media, contentBooster, hashtagIds } = updatePostDto;

    const updateData: any = {};
    if (caption !== undefined) updateData.caption = caption;
    if (media !== undefined) updateData.media = media;
    if (contentBooster !== undefined) updateData.contentBooster = contentBooster;

    // Handle hashtags update
    if (hashtagIds !== undefined) {
      updateData.hashtags = {
        set: hashtagIds.map(id => ({ id }))
      };
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        hashtags: true
      }
    });

    return updatedPost;
  }

  async deletePost(id: string, userId: string) {
    // Check if post exists and belongs to user
    const post = await this.prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (post.userId !== userId) {
      throw new ForbiddenException('You do not have permission to delete this post');
    }

    await this.prisma.post.delete({
      where: { id }
    });

    return { message: 'Post deleted successfully' };
  }

  async incrementLike(id: string) {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        like: { increment: 1 }
      }
    });

    return post;
  }

  async incrementComment(id: string) {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        comment: { increment: 1 }
      }
    });

    return post;
  }

  async incrementShare(id: string) {
    const post = await this.prisma.post.update({
      where: { id },
      data: {
        share: { increment: 1 }
      }
    });

    return post;
  }
}