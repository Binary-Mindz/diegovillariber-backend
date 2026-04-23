import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSpottingRequestDto } from './dto/create-sportting-request.dto';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
  SpottingRequestStatus,
} from 'generated/prisma/enums';
import { NearbyPostsDto } from './dto/nearby-post.dto';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class SpottingRequestService {
  private readonly logger = new Logger(SpottingRequestService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
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

  private async sendSpottingMatchNotification(params: {
    requestId: string;
    requestOwnerId: string;
    actorUserId: string;
    postId: string;
    matchedBrand?: string | null;
    matchedModel?: string | null;
    distanceKm: number;
  }) {
    const {
      requestId,
      requestOwnerId,
      actorUserId,
      postId,
      matchedBrand,
      matchedModel,
      distanceKm,
    } = params;

    const carText = [matchedBrand, matchedModel].filter(Boolean).join(' ');

    try {
      await this.notificationService.sendNotification({
        userId: requestOwnerId,
        actorUserId,
        type: NotificationType.SPOTTING_MATCH, // চাইলে SPOTTING type add করতে পারো
        channel: NotificationChannel.IN_APP,
        title: 'New spotting match found',
        message: carText
          ? `A new post matched your spotting request for ${carText} within ${distanceKm.toFixed(1)} km.`
          : `A new post matched your spotting request within ${distanceKm.toFixed(1)} km.`,
        deepLink: `/spotting-requests/${requestId}/matches`,
        entityType: NotificationEntityType.SPOTTING_REQUEST,
        entityId: requestId,
        meta: {
          spottingRequestId: requestId,
          postId,
          distanceKm: Number(distanceKm.toFixed(2)),
          brand: matchedBrand ?? null,
          model: matchedModel ?? null,
        },
        groupKey: `spotting-match:${requestId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send spotting match notification for request ${requestId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
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
        radiusKm: dto.radiusKm ?? 50,
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

    return this.prisma.spottingRequest.create({
      data: {
        userId,
        profileId: dto.profileId,
        carId: dto.carId,
        brand: normalizedBrand,
        model: normalizedModel,
        latitude: dto.latitude,
        longitude: dto.longitude,
        radiusKm: dto.radiusKm ?? 50,
        expiresAt,
      },
    });
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
        profile: {
          suspend: false,
        },
      },
      include: {
        user: {
          select: {
            id: true,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    const items = posts
      .map((post) => {
        const lat = Number(post.latitude);
        const lng = Number(post.longitude);

        const distanceKm = this.getDistanceKm(
          dto.latitude,
          dto.longitude,
          lat,
          lng,
        );

        return {
          postId: post.id,
          userId: post.userId,
          profileName: post.user?.profile?.[0]?.profileName ?? 'Unknown',
          profileImage: post.user?.profile?.[0]?.imageUrl ?? null,
          mediaUrl: post.mediaUrl,
          caption: post.caption,
          distanceKm: Number(distanceKm.toFixed(1)),
          createdAt: post.createdAt,
        };
      })
      .filter((item) => item.distanceKm <= (dto.radiusKm ?? 50))
      .sort((a, b) => a.distanceKm - b.distanceKm);

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
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        car: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (!post.latitude || !post.longitude) {
      return { matched: 0 };
    }

    const activeRequests = await this.prisma.spottingRequest.findMany({
      where: {
        status: SpottingRequestStatus.ACTIVE,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    let matched = 0;

    const postBrand = this.normalizeText(post.car?.make ?? null);
    const postModel = this.normalizeText(post.car?.model ?? null);

    for (const request of activeRequests) {
      if (request.userId === post.userId) continue;

      const blocked = await this.prisma.userBlock.findFirst({
        where: {
          OR: [
            {
              blockerId: request.userId,
              blockedUserId: post.userId,
            },
            {
              blockerId: post.userId,
              blockedUserId: request.userId,
            },
          ],
        },
        select: { id: true },
      });

      if (blocked) continue;

      const requestBrand = this.normalizeText(request.brand);
      const requestModel = this.normalizeText(request.model);

      let brandMatched = true;
      let modelMatched = true;

      if (requestBrand) {
        brandMatched = requestBrand === postBrand;
      }

      if (requestModel) {
        modelMatched = requestModel === postModel;
      }

      if (!brandMatched || !modelMatched) continue;

      const distanceKm = this.getDistanceKm(
        Number(request.latitude),
        Number(request.longitude),
        Number(post.latitude),
        Number(post.longitude),
      );

      if (distanceKm > request.radiusKm) continue;

      const alreadyExists = await this.prisma.spottingMatch.findFirst({
        where: {
          spottingRequestId: request.id,
          postId: post.id,
        },
        select: { id: true },
      });

      if (alreadyExists) continue;

      await this.prisma.$transaction([
        this.prisma.spottingMatch.create({
          data: {
            spottingRequestId: request.id,
            postId: post.id,
            spottedUserId: post.userId,
            distanceKm: Number(distanceKm.toFixed(2)),
          },
        }),
        this.prisma.spottingRequest.update({
          where: { id: request.id },
          data: {
            lastMatchedAt: new Date(),
          },
        }),
      ]);

      await this.sendSpottingMatchNotification({
        requestId: request.id,
        requestOwnerId: request.userId,
        actorUserId: post.userId,
        postId: post.id,
        matchedBrand: postBrand,
        matchedModel: postModel,
        distanceKm,
      });

      matched++;
    }

    return { matched };
  }
}
