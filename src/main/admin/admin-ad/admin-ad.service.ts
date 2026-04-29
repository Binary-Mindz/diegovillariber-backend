import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { CreateAdDto } from './dto/create-ad.dto';

import { ChangeAdStatusDto } from './dto/change-ad-status.dto';
import { GetAdsQueryDto } from './dto/get-ad-query.dto';
import { AdOverviewQueryDto } from './dto/ad-overview-query.dto';
import { AdStatus } from 'generated/prisma/enums';

@Injectable()
export class AdminAdService {
  constructor(private readonly prisma: PrismaService) {}

  async createAd(dto: CreateAdDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('End date must be greater than start date');
    }

    return this.prisma.ad.create({
      data: {
        title: dto.title,
        link: dto.link,
        linkUrl: dto.linkUrl,
        bannerUrl: dto.bannerUrl,
        localRatio: dto.localRatio,
        nationRatio: dto.nationRatio,
        worldWide: dto.worldWide,
        targetUrl: dto.targetUrl,
        altText: dto.altText,
        startDate,
        endDate,
        vehicleType: dto.vehicleType,
        placement: dto.placement,
        minimumPoint: dto.minimumPoint,
        maximumPoint: dto.maximumPoint,
        cap: dto.cap,
        dailyBudget: dto.dailyBudget,
        totalBudget: dto.totalBudget,
        countryCode: dto.countryCode,
        languages: dto.languages,
        tags: dto.tags,
        spotter: dto.spotter,
        proDriver: dto.proDriver,
        owner: dto.owner,
        proBussiness: dto.proBussiness,
        contentCreator: dto.contentCreator,
        simRacingDriver: dto.simRacingDriver,
        enableAdGlobally: dto.enableAdGlobally,
        showAd: dto.showAd,
        maxAdPerPage: dto.maxAdPerPage,
        rotationIntervel: dto.rotationIntervel,
        bannerWidth: dto.bannerWidth,
        bannerHeight: dto.bannerHeight,
        prioritize: dto.prioritize,
        autoPause: dto.autoPause,
        minimumCTR: dto.minimumCTR,
        enableBannerAnimation: dto.enableBannerAnimation,
        autoRotationEnabled: dto.autoRotationEnabled,
        previewMode: dto.previewMode,
        showFeed: dto.showFeed,
        showProfile: dto.showProfile,
        showMarketPlace: dto.showMarketPlace,
        showEvent: dto.showEvent,
        showChallenges: dto.showChallenges,
        showBattle: dto.showBattle,
        adStatus: dto.adStatus,
      },
    });
  }

  async getAds(query: GetAdsQueryDto) {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.title = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.adStatus) {
      where.adStatus = query.adStatus;
    }

    if (query.placement) {
      where.placement = query.placement;
    }

    if (query.vehicleType) {
      where.vehicleType = query.vehicleType;
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: 'desc',
        },
      }),
      this.prisma.ad.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getSingleAd(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return ad;
  }

  async deleteAd(id: string) {
    await this.ensureAdExists(id);

    await this.prisma.ad.delete({
      where: { id },
    });

    return {
      id,
    };
  }

  async changeAdStatus(id: string, dto: ChangeAdStatusDto) {
    await this.ensureAdExists(id);

    return this.prisma.ad.update({
      where: { id },
      data: {
        adStatus: dto.adStatus,
      },
    });
  }

  private async ensureAdExists(id: string) {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return ad;
  }


 async getAdsOverview(query: AdOverviewQueryDto) {
    const range = query.range ?? '30d';

    const daysMap: Record<'7d' | '30d' | '90d', number> = {
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };

    const days = daysMap[range];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    const activeAds = await this.prisma.ad.count({
      where: {
        adStatus: AdStatus.ACTIVE,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    const totalAdsInRange = await this.prisma.ad.count({
      where: {
        startDate: {
          gte: startDate,
          lte: now,
        },
      },
    });

    return {
      activeAds: {
        value: activeAds,
        changePercent: 0,
        trend: 'up',
      },
      impressions: {
        value: 0,
        changePercent: 0,
        trend: 'up',
      },
      clicks: {
        value: 0,
        changePercent: 0,
        trend: 'up',
      },
      avgCtr: {
        value: 0,
        changePercent: 0,
        trend: 'up',
      },
      meta: {
        range,
        totalAdsInRange,
      },
    };
  }
}