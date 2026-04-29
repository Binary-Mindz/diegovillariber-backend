 import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { CreatePrestigeDto } from './dto/create-prestige.dto';
import { UpdatePrestigeDto } from './dto/update-prestige.dto';
import { GetPrestigeQueryDto } from './dto/get-prestige-query.dto';
import { ChangePrestigeStatusDto } from './dto/change-prestige-status.dto';
import { PrestigeOverviewQueryDto } from './dto/prestige-overview-query.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { PrestigeRuleStatus } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class AdminPrestigeService {
  constructor(private readonly prisma: PrismaService) {}

  async getPrestigeOverview(_query: PrestigeOverviewQueryDto) {
    const [totalRules, activeRules, inactiveRules] = await Promise.all([
      this.prisma.prestigeRule.count(),
      this.prisma.prestigeRule.count({
        where: { status: PrestigeRuleStatus.ACTIVE },
      }),
      this.prisma.prestigeRule.count({
        where: { status: PrestigeRuleStatus.INACTIVE },
      }),
    ]);

    return {
      cards: {
        totalRules,
        activeRules,
        inactiveRules,
      },
    };
  }

  async createPrestige(dto: CreatePrestigeDto) {
    const earnBy = dto.earnBy.trim();

    const existing = await this.prisma.prestigeRule.findUnique({
      where: { earnBy },
    });

    if (existing) {
      throw new BadRequestException('Prestige rule already exists for this earnBy');
    }

    this.validateCaps(dto.dailyCap ?? 0, dto.weeklyCap ?? 0);

    const created = await this.prisma.prestigeRule.create({
      data: {
        earnBy,
        point: dto.point,
        dailyCap: dto.dailyCap ?? 0,
        weeklyCap: dto.weeklyCap ?? 0,
        cooldownSeconds: dto.cooldownSeconds ?? 0,
        status:
          dto.isActive === false
            ? PrestigeRuleStatus.INACTIVE
            : PrestigeRuleStatus.ACTIVE,
      },
    });

    return this.mapPrestigeRule(created);
  }

  async getPrestigeRules(query: GetPrestigeQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.PrestigeRuleWhereInput = {};

    if (query.search) {
      where.earnBy = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.prestigeRule.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.prestigeRule.count({ where }),
    ]);

    return {
      items: items.map((item) => this.mapPrestigeRule(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSinglePrestige(id: string) {
    const prestigeRule = await this.prisma.prestigeRule.findUnique({
      where: { id },
    });

    if (!prestigeRule) {
      throw new NotFoundException('Prestige rule not found');
    }

    return this.mapPrestigeRule(prestigeRule);
  }

  async updatePrestige(id: string, dto: UpdatePrestigeDto) {
    const existing = await this.prisma.prestigeRule.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Prestige rule not found');
    }

    const nextEarnBy = dto.earnBy?.trim();

    if (nextEarnBy && nextEarnBy !== existing.earnBy) {
      const duplicate = await this.prisma.prestigeRule.findUnique({
        where: { earnBy: nextEarnBy },
      });

      if (duplicate) {
        throw new BadRequestException('Prestige rule already exists for this earnBy');
      }
    }

    const dailyCap = dto.dailyCap ?? existing.dailyCap;
    const weeklyCap = dto.weeklyCap ?? existing.weeklyCap;

    this.validateCaps(dailyCap, weeklyCap);

    const updated = await this.prisma.prestigeRule.update({
      where: { id },
      data: {
        ...(dto.earnBy !== undefined ? { earnBy: nextEarnBy } : {}),
        ...(dto.point !== undefined ? { point: dto.point } : {}),
        ...(dto.dailyCap !== undefined ? { dailyCap: dto.dailyCap } : {}),
        ...(dto.weeklyCap !== undefined ? { weeklyCap: dto.weeklyCap } : {}),
        ...(dto.cooldownSeconds !== undefined
          ? { cooldownSeconds: dto.cooldownSeconds }
          : {}),
        ...(dto.isActive !== undefined
          ? {
              status: dto.isActive
                ? PrestigeRuleStatus.ACTIVE
                : PrestigeRuleStatus.INACTIVE,
            }
          : {}),
      },
    });

    return this.mapPrestigeRule(updated);
  }

  async changePrestigeStatus(id: string, dto: ChangePrestigeStatusDto) {
    const existing = await this.prisma.prestigeRule.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Prestige rule not found');
    }

    const updated = await this.prisma.prestigeRule.update({
      where: { id },
      data: {
        status: dto.isActive
          ? PrestigeRuleStatus.ACTIVE
          : PrestigeRuleStatus.INACTIVE,
      },
    });

    return this.mapPrestigeRule(updated);
  }

  async deletePrestige(id: string) {
    const existing = await this.prisma.prestigeRule.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Prestige rule not found');
    }

    await this.prisma.prestigeRule.delete({
      where: { id },
    });

    return { id };
  }

  private validateCaps(dailyCap: number, weeklyCap: number) {
    if (dailyCap > 0 && weeklyCap > 0 && weeklyCap < dailyCap) {
      throw new BadRequestException(
        'Weekly cap cannot be smaller than daily cap',
      );
    }
  }

  private mapPrestigeRule(rule: {
    id: string;
    earnBy: string;
    point: number;
    dailyCap: number;
    weeklyCap: number;
    cooldownSeconds: number;
    status: PrestigeRuleStatus;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...rule,
      isActive: rule.status === PrestigeRuleStatus.ACTIVE,
    };
  }
}