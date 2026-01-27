import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';


const POST_REWARD_POINTS = 5;
const BOOST_COST_POINTS = 300;

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) { }

  async createPost(userId: string, dto: CreatePostDto) {
    const wantBoost = dto.contentBooster === true;

    return this.prisma.$transaction(async (tx) => {

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, totalPoints: true },
      });
      if (!user) throw new NotFoundException('User not found');


      if (wantBoost && user.totalPoints < BOOST_COST_POINTS) {
        throw new BadRequestException(
          `Not enough points to boost. Need at least ${BOOST_COST_POINTS} points.`,
        );
      }


      const post = await tx.post.create({
        data: {
          userId,
          postType: dto.postType,
          caption: dto.caption ?? null,
          mediaUrl: dto.mediaUrl ?? null,
          postLocation: dto.postLocation ?? null,
          locationVisibility: dto.locationVisibility ?? null,

          visiualStyle: dto.visiualStyle ?? [],
          contextActivity: dto.contextActivity ?? [],
          subject: dto.subject ?? [],

          point: POST_REWARD_POINTS,
          contentBooster: wantBoost,
        },
      });

      // 4) Reward +5 points for creating a post (always)
      await tx.userPoint.create({
        data: {
          userId,
          postId: post.id,
          points: POST_REWARD_POINTS,
        },
      });

      // 5) If boosted, charge -300 points (log + user decrement)
      if (wantBoost) {
        await tx.userPoint.create({
          data: {
            userId,
            postId: post.id,
            points: -BOOST_COST_POINTS,
          },
        });
      }
      const delta = POST_REWARD_POINTS - (wantBoost ? BOOST_COST_POINTS : 0);

      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { totalPoints: { increment: delta } },
        select: { totalPoints: true },
      });

      return {
        post,
        earnedPoints: POST_REWARD_POINTS,
        boostCharged: wantBoost ? BOOST_COST_POINTS : 0,
        totalDelta: delta,
        userTotalPoints: updatedUser.totalPoints,
      };
    });
  }


  async getFeed(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    return this.prisma.post.findMany({
      where: {},
      orderBy: [
        { contentBooster: 'desc' },
        { createdAt: 'desc' },
      ],
      skip,
      take: limit,
      include: {
        user: { select: { id: true, username: true } },
        hashtags: true,
      },
    });
  }

  async getSinglePost(postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: {
          select: {
            id: true,
            username: true
          },
        },
      },
    });

    if (!post) throw new NotFoundException('Post not found');
    return post;
  }


  async updatePost(postId: string, userId: string, dto: UpdatePostDto) {
    if (dto.contentBooster !== undefined) {
      throw new BadRequestException('contentBooster cannot be updated');
    }
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          userId: true,
          postType: true,
          caption: true,
          mediaUrl: true,
          postLocation: true,
          locationVisibility: true,
          contentBooster: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!existing) throw new NotFoundException('Post not found');

      if (existing.userId !== userId) {
        throw new ForbiddenException('You are not allowed to update this post');
      }
      const updateData: any = {
        ...(dto.postType !== undefined ? { postType: dto.postType } : {}),
        ...(dto.caption !== undefined ? { caption: dto.caption ?? null } : {}),
        ...(dto.mediaUrl !== undefined ? { mediaUrl: dto.mediaUrl ?? null } : {}),
        ...(dto.postLocation !== undefined
          ? { postLocation: dto.postLocation ?? null }
          : {}),
        ...(dto.locationVisibility !== undefined
          ? { locationVisibility: dto.locationVisibility ?? null }
          : {}),

        ...(dto.visiualStyle !== undefined ? { visiualStyle: dto.visiualStyle ?? [] } : {}),
        ...(dto.contextActivity !== undefined ? { contextActivity: dto.contextActivity ?? [] } : {}),
        ...(dto.subject !== undefined ? { subject: dto.subject ?? [] } : {}),
      };

      if (Object.keys(updateData).length === 0) {
        throw new BadRequestException('No valid fields provided to update');
      }
      const updated = await tx.post.update({
        where: { id: postId },
        data: updateData,
      });

      return updated;
    });
  }

  async deletePost(postId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: { id: postId },
        select: { id: true, userId: true },
      });

      if (!post) throw new NotFoundException('Post not found');

      if (post.userId !== userId) {
        throw new ForbiddenException('You are not allowed to delete this post');
      }

      await tx.post.delete({ where: { id: postId } });

      return { deleted: true, postId };
    });
  }
}


// @ApiProperty({
//   example: [
//     Amenity.WIFI,
//     Amenity.PARKING_AVAILABLE,
//     Amenity.AIR_CONDITIONING,
//   ],
//   description: 'List of amenities (enum values)',
//   isArray: true,
//   enum: Amenity,
//   required: false,
// })
// @IsOptional()
// @IsArray()
// @IsEnum(Amenity, { each: true })
// amenities?: Amenity[];
