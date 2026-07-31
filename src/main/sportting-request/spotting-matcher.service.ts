import { PrismaService } from '@/common/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
  PostAssetType,
  SpottingRequestStatus,
} from 'generated/prisma/enums';
import { Prisma } from '../../../prisma/generated/prisma/client';
import { NotificationService } from '../notification/notification.service';

interface SpottingRequestLike {
  id: string;
  userId: string;
  brand?: string | null;
  model?: string | null;
  vehicleType?: PostAssetType | null;
  latitude: number | Prisma.Decimal | null;
  longitude: number | Prisma.Decimal | null;
  radiusKm: number;
  status: SpottingRequestStatus;
  expiresAt?: Date | null;
  lastMatchedAt?: Date | null;
}

interface PostLike {
  id: string;
  userId: string;
  latitude: number | Prisma.Decimal | null;
  longitude: number | Prisma.Decimal | null;
  assetType?: PostAssetType | null;
  caption?: string | null;
  car?: { make?: string | null; model?: string | null } | null;
  bike?: { make?: string | null; model?: string | null } | null;
  hashtags?: Array<{ tag?: string | null }> | null;
}

@Injectable()
export class SpottingMatcherService {
  private readonly logger = new Logger(SpottingMatcherService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async matchExistingPosts(request: SpottingRequestLike): Promise<number> {
    if (!this.isRequestEligible(request)) {
      return 0;
    }

    const posts = await this.prisma.post.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        userId: true,
        latitude: true,
        longitude: true,
        assetType: true,
        caption: true,
        car: { select: { make: true, model: true } },
        bike: { select: { make: true, model: true } },
        hashtags: { select: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!posts.length) {
      return 0;
    }

    const blockedUserIds = await this.getBlockedUserIds(request.userId, posts);

    const eligiblePosts = posts.filter((post) => {
      if (post.userId === request.userId) {
        return false;
      }

      if (blockedUserIds.has(post.userId)) {
        return false;
      }

      if (!this.isVehicleMatched(request, post)) {
        return false;
      }

      if (!this.isSearchMatched(request, post)) {
        return false;
      }

      const distanceKm = this.calculateDistance(request, post);
      return distanceKm <= request.radiusKm;
    });

    if (!eligiblePosts.length) {
      return 0;
    }

    const createdMatches = await this.createMatches(eligiblePosts, [request], {
      sendNotifications: false,
    });

    return createdMatches.created;
  }

  async processNewPost(postId: string): Promise<{ matched: number }> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        userId: true,
        latitude: true,
        longitude: true,
        assetType: true,
        caption: true,
        car: { select: { make: true, model: true } },
        bike: { select: { make: true, model: true } },
        hashtags: { select: { tag: true } },
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
      select: {
        id: true,
        userId: true,
        brand: true,
        model: true,
        vehicleType: true,
        latitude: true,
        longitude: true,
        radiusKm: true,
        status: true,
        expiresAt: true,
      },
    });

    if (!activeRequests.length) {
      return { matched: 0 };
    }

    const requestUserIds = activeRequests.map((request) => request.userId);
    const blockedUserIds = await this.getBlockedUserIds(
      post.userId,
      activeRequests,
    );

    const candidateRequests = activeRequests.filter((request) => {
      if (request.userId === post.userId) {
        return false;
      }

      if (blockedUserIds.has(request.userId)) {
        return false;
      }

      if (!this.isVehicleMatched(request, post)) {
        return false;
      }

      if (!this.isSearchMatched(request, post)) {
        return false;
      }

      const distanceKm = this.calculateDistance(request, post);
      return distanceKm <= request.radiusKm;
    });

    if (!candidateRequests.length) {
      return { matched: 0 };
    }

    const matches = await this.createMatches([post], candidateRequests, {
      sendNotifications: true,
    });

    return { matched: matches.created };
  }

  isVehicleMatched(
    request: Pick<SpottingRequestLike, 'vehicleType'>,
    post: Pick<PostLike, 'assetType' | 'car' | 'bike'>,
  ): boolean {
    const postVehicleType = this.getPostVehicleType(post);
    if (!request.vehicleType) {
      return Boolean(postVehicleType);
    }

    return postVehicleType === request.vehicleType;
  }

  private isSearchMatched(
    request: Pick<SpottingRequestLike, 'brand' | 'model'>,
    post: Pick<PostLike, 'caption' | 'hashtags'>,
  ): boolean {
    const requestTokens = this.getRequestTokens(request);

    if (!requestTokens.length) {
      return true;
    }

    const candidateTexts = [
      post.caption,
      ...(post.hashtags ?? []).map((tag) => tag.tag),
    ].filter((value): value is string => Boolean(value));

    if (!candidateTexts.length) {
      return false;
    }

    const normalizedCandidates = candidateTexts
      .map((text) => this.normalizeSearchValue(text))
      .filter((text): text is string => Boolean(text));

    if (!normalizedCandidates.length) {
      return false;
    }

    return requestTokens.every((token) =>
      normalizedCandidates.some((candidate) => candidate.includes(token)),
    );
  }

  calculateDistance(
    source: Pick<SpottingRequestLike, 'latitude' | 'longitude'>,
    target: Pick<PostLike, 'latitude' | 'longitude'>,
  ): number {
    const lat1 = Number(source.latitude);
    const lon1 = Number(source.longitude);
    const lat2 = Number(target.latitude);
    const lon2 = Number(target.longitude);

    if ([lat1, lon1, lat2, lon2].some((value) => Number.isNaN(value))) {
      return Number.POSITIVE_INFINITY;
    }

    const earthRadiusKm = 6371;
    const toRadians = (value: number) => (value * Math.PI) / 180;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  private containsAllTokens(value: string, tokens: string[]): boolean {
    const normalizedValue = this.normalizeSearchValue(value);

    if (!normalizedValue) {
      return false;
    }

    return tokens.every((token) => normalizedValue.includes(token));
  }

  private getPostVehicleType(
    post: Pick<PostLike, 'assetType' | 'car' | 'bike'>,
  ): PostAssetType | null {
    if (post.assetType) {
      return post.assetType;
    }

    if (post.car) {
      return PostAssetType.CAR;
    }

    if (post.bike) {
      return PostAssetType.BIKE;
    }

    return null;
  }

  private getPostBrand(post: Pick<PostLike, 'car' | 'bike'>): string | null {
    return post.car?.make ?? post.bike?.make ?? null;
  }

  private getPostModel(post: Pick<PostLike, 'car' | 'bike'>): string | null {
    return post.car?.model ?? post.bike?.model ?? null;
  }

  private normalizeText(value?: string | null): string | null {
    if (!value) {
      return null;
    }

    return value.trim().toLowerCase();
  }

  private normalizeSearchValue(value?: string | null): string | null {
    const normalized = this.normalizeText(value);

    if (!normalized) {
      return null;
    }

    return normalized.replace(/[^a-z0-9]+/g, '');
  }

  private getRequestTokens(
    request: Pick<SpottingRequestLike, 'brand' | 'model'>,
  ): string[] {
    const tokens = new Set<string>();

    for (const value of [request.brand, request.model]) {
      if (!value) continue;

      const parts = value.split(/[^a-zA-Z0-9]+/);

      for (const part of parts) {
        const cleaned = this.normalizeSearchValue(part);
        if (cleaned) {
          tokens.add(cleaned);
        }
      }
    }

    return Array.from(tokens);
  }

  private isRequestEligible(request: SpottingRequestLike): boolean {
    if (request.status !== SpottingRequestStatus.ACTIVE) {
      return false;
    }

    if (!request.expiresAt) {
      return true;
    }

    return request.expiresAt >= new Date();
  }

  private async getBlockedUserIds(
    ownerUserId: string,
    candidates: Array<
      Pick<SpottingRequestLike, 'userId'> | Pick<PostLike, 'userId'>
    >,
  ): Promise<Set<string>> {
    const candidateUserIds = candidates
      .map((candidate) => candidate.userId)
      .filter((candidateUserId): candidateUserId is string =>
        Boolean(candidateUserId),
      );

    if (!candidateUserIds.length) {
      return new Set<string>();
    }

    const blocks = await this.prisma.userBlock.findMany({
      where: {
        OR: [
          { blockerId: ownerUserId, blockedUserId: { in: candidateUserIds } },
          { blockerId: { in: candidateUserIds }, blockedUserId: ownerUserId },
        ],
      },
      select: { blockerId: true, blockedUserId: true },
    });

    const blockedUserIds = new Set<string>();

    for (const block of blocks) {
      if (block.blockerId !== ownerUserId) {
        blockedUserIds.add(block.blockerId);
      }

      if (block.blockedUserId !== ownerUserId) {
        blockedUserIds.add(block.blockedUserId);
      }
    }

    return blockedUserIds;
  }

  private async createMatches(
    posts: PostLike[],
    requests: SpottingRequestLike[],
    options: { sendNotifications?: boolean } = {},
  ): Promise<{ created: number }> {
    if (!posts.length || !requests.length) {
      return { created: 0 };
    }

    const pairs = posts.flatMap((post) =>
      requests.map((request) => ({ post, request })),
    );

    return this.prisma.$transaction(async (tx) => {
      const existingMatches = await tx.spottingMatch.findMany({
        where: {
          OR: pairs.map(({ post, request }) => ({
            spottingRequestId: request.id,
            postId: post.id,
          })),
        },
        select: {
          spottingRequestId: true,
          postId: true,
        },
      });

      const existingKeys = new Set(
        existingMatches.map(
          (match) => `${match.spottingRequestId}:${match.postId}`,
        ),
      );

      const requestById = new Map(
        requests.map((request) => [request.id, request]),
      );
      const postById = new Map(posts.map((post) => [post.id, post]));

      const data = pairs
        .filter(
          ({ post, request }) => !existingKeys.has(`${request.id}:${post.id}`),
        )
        .map(({ post, request }) => ({
          spottingRequestId: request.id,
          postId: post.id,
          spottedUserId: post.userId,
          distanceKm: Number(this.calculateDistance(request, post).toFixed(2)),
        }));

      if (!data.length) {
        return { created: 0 };
      }

      await tx.spottingMatch.createMany({
        data,
        skipDuplicates: true,
      });

      const requestIds = Array.from(
        new Set(data.map((item) => item.spottingRequestId)),
      );

      await Promise.all(
        requestIds.map((requestId) =>
          tx.spottingRequest.update({
            where: { id: requestId },
            data: { lastMatchedAt: new Date() },
          }),
        ),
      );

      if (options.sendNotifications) {
        await Promise.all(
          data.map(async (match) => {
            const request = requestById.get(match.spottingRequestId);
            const post = postById.get(match.postId);
            if (!request || !post) {
              return;
            }

            const distanceKm = this.calculateDistance(request, post);
            const matchedBrand = this.getPostBrand(
              post as Pick<PostLike, 'car' | 'bike'>,
            );
            const matchedModel = this.getPostModel(
              post as Pick<PostLike, 'car' | 'bike'>,
            );

            await this.sendNotification({
              requestId: request.id,
              requestOwnerId: request.userId,
              actorUserId: post.userId,
              postId: post.id,
              matchedBrand,
              matchedModel,
              distanceKm,
            });
          }),
        );
      }

      return { created: data.length };
    });
  }

  private async sendNotification(params: {
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
        type: NotificationType.SPOTTING_MATCH,
        channel: NotificationChannel.IN_APP,
        title: 'New spotting match found',
        message: carText
          ? `A new ${carText} was spotted within ${distanceKm.toFixed(1)} km.`
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
        groupKey: `spotting-match:${requestId}:${postId}`,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send spotting match notification for request ${requestId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
