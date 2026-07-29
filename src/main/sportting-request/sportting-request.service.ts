import { InjectQueue } from '@nestjs/bullmq';
import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { SpottingRequestStatus } from 'generated/prisma/enums';
import { Prisma } from '../../../prisma/generated/prisma/client';
import { CreateSpottingRequestDto } from './dto/create-sportting-request.dto';
import { NearbyPostsDto } from './dto/nearby-post.dto';
import { SpottingMatcherService } from './spotting-matcher.service';

export type PostWithUserAndProfile = Prisma.PostGetPayload<{
  include: {
    user: {
      include: {
        profile: true;
      };
    };
  };
}>;

@Injectable()
export class SpottingRequestService {
  private readonly logger = new Logger(SpottingRequestService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly spottingMatcherService: SpottingMatcherService,
    @InjectQueue('spotting-match') private readonly spottingMatchQueue: Queue,
  ) {}

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }

  private getDistanceKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const earthRadiusKm = 6371;

    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private normalizeText(value?: string | null): string | null {
    if (!value) return null;
    return value.trim().toLowerCase();
  }

  private async getBlockedUserIds(currentUserId: string): Promise<string[]> {
    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [{ blockerId: currentUserId }, { blockedUserId: currentUserId }],
      },
      select: {
        blockerId: true,
        blockedUserId: true,
      },
    });

    const ids = new Set<string>();

    for (const block of blocks) {
      if (block.blockerId !== currentUserId) ids.add(block.blockerId);
      if (block.blockedUserId !== currentUserId) ids.add(block.blockedUserId);
    }

    return [...ids];
  }

  async createSpottingRequest(userId: string, dto: CreateSpottingRequestDto) {
    if (!dto.carId && !dto.brand && !dto.model) {
      throw new BadRequestException('Either carId or brand/model is required');
    }

    if (dto.profileId) {
      const profile = await this.prisma.profile.findFirst({
        where: {
          id: dto.profileId,
          userId,
        },
        select: { id: true },
      });

      if (!profile) {
        throw new ForbiddenException('Profile does not belong to this user');
      }
    }

    if (dto.carId) {
      const car = await this.prisma.car.findFirst({
        where: {
          id: dto.carId,
          profile: {
            userId,
          },
        },
        select: {
          id: true,
          make: true,
          model: true,
        },
      });

      if (!car) {
        throw new ForbiddenException('Car does not belong to this user');
      }
    }

    const normalizedBrand = this.normalizeText(dto.brand);
    const normalizedModel = this.normalizeText(dto.model);

    const existing = await this.prisma.spottingRequest.findFirst({
      where: {
        userId,
        brand: dto.brand ?? null,
        model: dto.model ?? null,
        carId: dto.carId ?? null,
        status: SpottingRequestStatus.ACTIVE,
        radiusKm: dto.radiusKm ?? 100,
      },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException(
        'An active spotting request already exists',
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const createdRequest = await this.prisma.spottingRequest.create({
      data: {
        userId,
        profileId: dto.profileId,
        carId: dto.carId,
        vehicleType: dto.vehicleType ?? null,
        brand: normalizedBrand,
        model: normalizedModel,
        latitude: dto.latitude,
        longitude: dto.longitude,
        radiusKm: dto.radiusKm ?? 100,
        expiresAt,
      },
    });

    await this.spottingMatchQueue.add(
      'process-request',
      { requestId: createdRequest.id },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return createdRequest;
  }

  async getMySpottingRequests(userId: string) {
    return this.prisma.spottingRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        car: {
          select: {
            id: true,
            make: true,
            model: true,
            image: true,
          },
        },
        matches: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            post: {
              select: {
                id: true,
                mediaUrl: true,
                caption: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });
  }

  async pauseRequest(userId: string, requestId: string) {
    const request = await this.prisma.spottingRequest.findFirst({
      where: { id: requestId, userId },
      select: { id: true },
    });

    if (!request) {
      throw new NotFoundException('Spotting request not found');
    }

    return this.prisma.spottingRequest.update({
      where: { id: requestId },
      data: { status: SpottingRequestStatus.PAUSED },
    });
  }

  async activateRequest(userId: string, requestId: string) {
    const request = await this.prisma.spottingRequest.findFirst({
      where: { id: requestId, userId },
      select: { id: true },
    });

    if (!request) {
      throw new NotFoundException('Spotting request not found');
    }

    return this.prisma.spottingRequest.update({
      where: { id: requestId },
      data: { status: SpottingRequestStatus.ACTIVE },
    });
  }

  async cancelRequest(userId: string, requestId: string) {
    const request = await this.prisma.spottingRequest.findFirst({
      where: { id: requestId, userId },
      select: { id: true },
    });

    if (!request) {
      throw new NotFoundException('Spotting request not found');
    }

    return this.prisma.spottingRequest.update({
      where: { id: requestId },
      data: { status: SpottingRequestStatus.CANCELLED },
    });
  }

  async getRequestMatches(userId: string, requestId: string) {
    const request = await this.prisma.spottingRequest.findFirst({
      where: { id: requestId, userId },
      select: { id: true },
    });

    if (!request) {
      throw new NotFoundException('Spotting request not found');
    }

    return this.prisma.spottingMatch.findMany({
      where: { spottingRequestId: requestId },
      orderBy: { createdAt: 'desc' },
      include: {
        post: {
          select: {
            id: true,
            caption: true,
            mediaUrl: true,
            createdAt: true,
            userId: true,
          },
        },
        spottedUser: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getNearbyPosts(userId: string, dto: NearbyPostsDto) {
    const blockedUserIds = await this.getBlockedUserIds(userId);

    const posts = await this.prisma.post.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
        userId: {
          notIn: blockedUserIds,
        },
        user: {
          profile: {
            some: {
              suspend: false,
            },
          },
        },
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // ২. টাইপ কাস্টিং এর ঝামেলা এড়াতে পোস্টগুলোকে ম্যাপ করা
    const items = posts
      .map((rawPost) => {
        // টাইপ সেফটি নিশ্চিত করতে রানটাইম অবজেক্টকে কাস্টম টাইপে রূপান্তর
        const post = rawPost as any;

        const lat = Number(post.latitude);
        const lng = Number(post.longitude);

        const distanceKm = this.getDistanceKm(
          Number(dto.latitude),
          Number(dto.longitude),
          lat,
          lng,
        );

        // প্রোফাইল অ্যারে হ্যান্ডেল করা
        const profileArray = post.user?.profile;
        const matchedProfile = Array.isArray(profileArray)
          ? profileArray[0]
          : profileArray;

        return {
          postId: post.id,
          userId: post.userId,
          profileName: matchedProfile?.profileName ?? 'Unknown',
          profileImage: matchedProfile?.imageUrl ?? null,
          mediaUrl: post.mediaUrl,
          caption: post.caption,
          distanceKm: Number(distanceKm.toFixed(1)),
          createdAt: post.createdAt,
        };
      })
      // রেডিয়াস ফিল্টার (ইউজারের দেওয়া রেডিয়াস অথবা ডিফল্ট ৫০ কিমি)
      .filter((item) => item.distanceKm <= (dto.radiusKm ?? 50))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    // ৩. পেজিনেশন হিসাব
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const start = (page - 1) * limit;
    const end = start + limit;

    return {
      items: items.slice(start, end),
      pagination: {
        page,
        limit,
        total: items.length,
        totalPages: Math.ceil(items.length / limit),
      },
    };
  }

  async processPostForSpottingMatches(postId: string) {
    await this.spottingMatchQueue.add(
      'process-post',
      { postId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return { queued: true };
  }
}
