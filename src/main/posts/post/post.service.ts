import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create.post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { MediaType, Prisma } from 'generated/prisma/client';

const POST_REWARD_POINTS = 5;
const BOOST_COST_POINTS = 300;

function parseCsvEnum<T extends string>(value?: string): T[] | undefined {
  if (!value) return undefined;
  const arr = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as T[];
  return arr.length ? arr : undefined;
}

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  private async getExcludedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedUserId: userId }],
      },
      select: {
        blockerId: true,
        blockedUserId: true,
      },
    });

    const excludedUserIds = new Set<string>();

    for (const block of blocks) {
      if (block.blockerId !== userId) {
        excludedUserIds.add(block.blockerId);
      }
      if (block.blockedUserId !== userId) {
        excludedUserIds.add(block.blockedUserId);
      }
    }

    return [...excludedUserIds];
  }

  async createPost(userId: string, dto: CreatePostDto) {
    const wantBoost = dto.contentBooster === true;

    const hasLat = typeof dto.latitude === 'number';
    const hasLng = typeof dto.longitude === 'number';

    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      throw new BadRequestException(
        'Both latitude and longitude must be provided together.',
      );
    }
    const hashtagIds = dto.hashtagIds
      ? Array.from(new Set(dto.hashtagIds))
      : [];

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, totalPoints: true, activeProfileId: true },
      });
      if (!user) throw new NotFoundException('User not found');

      if (!user.activeProfileId) {
        throw new BadRequestException('No active profile selected');
      }
      const activeProfile = await tx.profile.findFirst({
        where: { id: user.activeProfileId, userId },
        select: { id: true, activeType: true },
      });
      if (!activeProfile) {
        throw new BadRequestException('Active profile not found for this user');
      }
      if (!activeProfile.activeType) {
        throw new BadRequestException('Active profile type not set');
      }
      const mediaType = dto.mediaType ?? MediaType.IMAGE;
      if (mediaType === MediaType.IMAGE) {
        if (dto.videoEditingDeclaration) {
          throw new BadRequestException(
            'videoEditingDeclaration is only allowed for VIDEO posts.',
          );
        }
      } else if (mediaType === MediaType.VIDEO) {
        if (dto.photoEditingDeclaration) {
          throw new BadRequestException(
            'photoEditingDeclaration is only allowed for IMAGE posts.',
          );
        }
      }

      const taggedUserIds = dto.taggedUserIds
        ? Array.from(new Set(dto.taggedUserIds)).filter((x) => x !== userId) // চাইলে নিজেকে tag বন্ধ
        : [];

      if (taggedUserIds.length) {
        const found = await tx.user.findMany({
          where: { id: { in: taggedUserIds } },
          select: { id: true },
        });

        if (found.length !== taggedUserIds.length) {
          throw new BadRequestException('One or more tagged users are invalid');
        }

        const blockedRelations = await tx.userBlock.findMany({
          where: {
            OR: taggedUserIds.flatMap((targetUserId) => [
              {
                blockerId: userId,
                blockedUserId: targetUserId,
              },
              {
                blockerId: targetUserId,
                blockedUserId: userId,
              },
            ]),
          },
          select: {
            blockerId: true,
            blockedUserId: true,
          },
        });

        if (blockedRelations.length > 0) {
          throw new BadRequestException(
            'You cannot tag users who are blocked or who blocked you',
          );
        }
      }

      if (wantBoost && user.totalPoints < BOOST_COST_POINTS) {
        throw new BadRequestException(
          `Not enough points to boost. Need at least ${BOOST_COST_POINTS} points.`,
        );
      }

      if (hashtagIds.length > 0) {
        const found = await tx.hashtag.findMany({
          where: {
            id: { in: hashtagIds },
            isActive: true,
          },
          select: { id: true },
        });

        if (found.length !== hashtagIds.length) {
          throw new BadRequestException(
            'One or more hashtags are invalid or inactive.',
          );
        }
      }

      const post = await tx.post.create({
        data: {
          userId,

          // ✅ active profile binding
          profileId: activeProfile.id,
          profileType: activeProfile.activeType,

          postType: dto.postType ?? undefined,
          assetType: dto.assetType ?? undefined,
          caption: dto.caption ?? null,
          mediaUrl: dto.mediaUrl ?? null,
          mediaType,
          postLocation: dto.postLocation ?? null,
          locationName: dto.locationName ?? null,
          locationAddress: dto.locationAddress ?? null,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          placeId: dto.placeId ?? null,
          locationVisibility: dto.locationVisibility ?? null,
          vehicleCategory: dto.vehicleCategory,
          visiualStyle: dto.visiualStyle ?? [],
          contextActivity: dto.contextActivity ?? [],
          subject: dto.subject ?? [],
          photoEditingDeclaration: dto.photoEditingDeclaration ?? null,
          videoEditingDeclaration: dto.videoEditingDeclaration ?? null,

          hashtags: hashtagIds.length
            ? { connect: hashtagIds.map((id) => ({ id })) }
            : undefined,

          // ✅ tagged users connect
          taggedUsers: taggedUserIds.length
            ? { connect: taggedUserIds.map((id) => ({ id })) }
            : undefined,

          point: POST_REWARD_POINTS,
          contentBooster: wantBoost,
        },
        include: {
          hashtags: true,
          taggedUsers: { select: { id: true } },
          profile: { select: { id: true, imageUrl: true, activeType: true } },
        },
      });

      if (hashtagIds.length) {
        await tx.hashtag.updateMany({
          where: { id: { in: hashtagIds } },
          data: { usageCount: { increment: 1 } },
        });
      }

      await tx.userPoint.create({
        data: { userId, postId: post.id, points: POST_REWARD_POINTS },
      });

      if (wantBoost) {
        await tx.userPoint.create({
          data: { userId, postId: post.id, points: -BOOST_COST_POINTS },
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
  async getFeed(userId: string, query: FeedQueryDto) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  if (page < 1) throw new BadRequestException('page must be >= 1');
  if (limit < 1 || limit > 50) {
    throw new BadRequestException('limit must be between 1 and 50');
  }

  const excludedUserIds = await this.getExcludedUserIds(userId);

  const visiualStyle = parseCsvEnum<any>(query.visiualStyle);
  const contextActivity = parseCsvEnum<any>(query.contextActivity);
  const subject = parseCsvEnum<any>(query.subject);

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { activeProfileId: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (!user.activeProfileId) {
    throw new BadRequestException('No active profile selected');
  }

  const activeProfile = await this.prisma.profile.findFirst({
    where: {
      id: user.activeProfileId,
      userId,
      isActive: 'ACTIVE',
      suspend: false,
    },
    select: {
      id: true,
      preference: true,
    },
  });

  if (!activeProfile) {
    throw new BadRequestException('Active profile not found');
  }

  let preferenceFilter: Prisma.PostWhereInput = {};

  if (activeProfile.preference === 'CAR') {
    preferenceFilter = {
      assetType: 'CAR',
    };
  } else if (activeProfile.preference === 'BIKE') {
    preferenceFilter = {
      assetType: 'BIKE',
    };
  } else if (activeProfile.preference === 'BOTH' || !activeProfile.preference) {
    preferenceFilter = {};
  }

  const where: Prisma.PostWhereInput = {
    userId: {
      notIn: excludedUserIds,
    },

    ...preferenceFilter,

    ...(query.postType ? { postType: query.postType } : {}),
    ...(query.boostedOnly === 'true' ? { contentBooster: true } : {}),
    ...(query.location
      ? { postLocation: { contains: query.location, mode: 'insensitive' } }
      : {}),
    ...(query.search
      ? {
          OR: [
            { caption: { contains: query.search, mode: 'insensitive' } },
            { postLocation: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),

    ...(visiualStyle ? { visiualStyle: { hasSome: visiualStyle } } : {}),
    ...(contextActivity ? { contextActivity: { hasSome: contextActivity } } : {}),
    ...(subject ? { subject: { hasSome: subject } } : {}),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput[] =
    query.sort === 'topLiked'
      ? [{ like: 'desc' }, { createdAt: 'desc' }]
      : query.sort === 'boosted'
      ? [{ contentBooster: 'desc' }, { createdAt: 'desc' }]
      : [{ createdAt: 'desc' }];

  const [data, total] = await this.prisma.$transaction([
    this.prisma.post.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: { select: { id: true } },
        profile: {
          select: { id: true, imageUrl: true, activeType: true, preference: true },
        },
        hashtags: true,
        taggedUsers: { select: { id: true } },
      },
    }),
    this.prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
  }

  async getSinglePost(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true } },
        profile: { select: { id: true, imageUrl: true, activeType: true } },
        hashtags: true,
        taggedUsers: { select: { id: true } },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const blockedRelation = await this.prisma.userBlock.findFirst({
      where: {
        OR: [
          {
            blockerId: userId,
            blockedUserId: post.userId,
          },
          {
            blockerId: post.userId,
            blockedUserId: userId,
          },
        ],
      },
      select: { id: true },
    });

    if (blockedRelation) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }
  async updatePost(postId: string, userId: string, dto: UpdatePostDto) {
    if (dto.contentBooster !== undefined) {
      throw new BadRequestException('contentBooster cannot be updated');
    }

    const hasLat = typeof dto.latitude === 'number';
    const hasLng = typeof dto.longitude === 'number';

    if ((hasLat && !hasLng) || (!hasLat && hasLng)) {
      throw new BadRequestException(
        'Both latitude and longitude must be provided together.',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.post.findUnique({
        where: { id: postId },
        select: {
          id: true,
          userId: true,
        },
      });

      if (!existing) throw new NotFoundException('Post not found');

      if (existing.userId !== userId) {
        throw new ForbiddenException('You are not allowed to update this post');
      }

      const updateData: any = {
        ...(dto.postType !== undefined ? { postType: dto.postType } : {}),
        ...(dto.assetType !== undefined ? { assetType: dto.assetType } : {}),
        ...(dto.caption !== undefined ? { caption: dto.caption ?? null } : {}),
        ...(dto.mediaUrl !== undefined
          ? { mediaUrl: dto.mediaUrl ?? null }
          : {}),
        // media
        ...(dto.mediaUrl !== undefined
          ? { mediaUrl: dto.mediaUrl ?? null }
          : {}),
        ...(dto.mediaType !== undefined
          ? { mediaType: dto.mediaType ?? undefined }
          : {}),

        // vehicleCategory
        ...(dto.vehicleCategory !== undefined
          ? { vehicleCategory: dto.vehicleCategory ?? undefined }
          : {}),

        // declarations (with simple consistency check)
        ...(dto.photoEditingDeclaration !== undefined
          ? { photoEditingDeclaration: dto.photoEditingDeclaration ?? null }
          : {}),
        ...(dto.videoEditingDeclaration !== undefined
          ? { videoEditingDeclaration: dto.videoEditingDeclaration ?? null }
          : {}),
        ...(dto.postLocation !== undefined
          ? { postLocation: dto.postLocation ?? null }
          : {}),
        ...(dto.locationVisibility !== undefined
          ? { locationVisibility: dto.locationVisibility ?? null }
          : {}),

        ...(dto.locationName !== undefined
          ? { locationName: dto.locationName ?? null }
          : {}),
        ...(dto.locationAddress !== undefined
          ? { locationAddress: dto.locationAddress ?? null }
          : {}),
        ...(dto.latitude !== undefined
          ? { latitude: dto.latitude ?? null }
          : {}),
        ...(dto.longitude !== undefined
          ? { longitude: dto.longitude ?? null }
          : {}),
        ...(dto.placeId !== undefined ? { placeId: dto.placeId ?? null } : {}),

        // enums
        ...(dto.visiualStyle !== undefined
          ? { visiualStyle: dto.visiualStyle ?? [] }
          : {}),
        ...(dto.contextActivity !== undefined
          ? { contextActivity: dto.contextActivity ?? [] }
          : {}),
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
