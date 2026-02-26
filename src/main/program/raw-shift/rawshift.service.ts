import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RawShiftQueryDto, RawShiftTab } from './dto/rawshift-query.dto';
import { CreateRawShiftBattleDto } from './dto/create-rawshift-battle.dto';
import { UpdateRawShiftBattleDto } from './dto/update-rawshift-battle.dto';
import { SubmitRawShiftEntryDto } from './dto/submit-rawshift-entry.dto';
import { VoteRawShiftDto } from './dto/vote-rawshift.dto';
import { CreateRawShiftCommentDto } from './dto/comment-rawshift.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { ParticipationScope, RawShiftEntryStatus, RawShiftStatus } from 'generated/prisma/enums';

@Injectable()
export class RawShiftService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly OPEN_RAWSHIFT_STATUSES = new Set<RawShiftStatus>([
  RawShiftStatus.PUBLISHED,
  RawShiftStatus.RUNNING,
]);

  async listBattles(query: RawShiftQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const now = new Date();

    const where: any = {};

    // If explicit status provided, use it
    if (query.status) where.status = query.status;

    // Tab logic (screens: Active/Upcoming/Finished)
    if (!query.status && query.tab) {
      if (query.tab === RawShiftTab.UPCOMING) {
        where.status = { in: [RawShiftStatus.PUBLISHED] };
        where.startDate = { gt: now };
      }
      if (query.tab === RawShiftTab.ACTIVE) {
        where.status = { in: [RawShiftStatus.RUNNING, RawShiftStatus.PUBLISHED] };
        where.startDate = { lte: now };
        where.endDate = { gte: now };
      }
      if (query.tab === RawShiftTab.FINISHED) {
        where.OR = [
          { status: RawShiftStatus.COMPLETED },
          { endDate: { lt: now } },
        ];
      }
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.rawShiftBattle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          _count: {
            select: { participants: true, entries: true, comments: true },
          },
        },
      }),
      this.prisma.rawShiftBattle.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async getBattle(id: string) {
    const battle = await this.prisma.rawShiftBattle.findUnique({
      where: { id },
      include: {
        _count: {
          select: { participants: true, entries: true, comments: true },
        },
        entries: {
          orderBy: [{ score: 'desc' }, { createdAt: 'asc' }],
          include: {
            user: { select: { id: true, email: true } },
            _count: { select: { votes: true, comments: true } },
          },
        },
      },
    });

    if (!battle) throw new NotFoundException('RawShift battle not found');
    return battle;
  }

  async createBattle(userId: string, dto: CreateRawShiftBattleDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (endDate <= startDate) throw new BadRequestException('endDate must be after startDate');

    return this.prisma.rawShiftBattle.create({
      data: {
        creatorId: userId,
        title: dto.title,
        description: dto.description,
        coverImage: dto.coverImage,
        bannerImage: dto.bannerImage,
        software: dto.software,
        softwareLabel: dto.softwareLabel,
        requireRaw: dto.requireRaw ?? true,
        rejectAiEdited: dto.rejectAiEdited ?? false,
        participantLimit: dto.participantLimit,
        participationScope: dto.participationScope ?? ParticipationScope.GLOBAL,
        radiusKm: dto.radiusKm,
        locationName: dto.locationName,
        latitude: dto.latitude,
        longitude: dto.longitude,
        placeId: dto.placeId,
        startDate,
        endDate,
        status: RawShiftStatus.DRAFT, // publish step can be separate if you want
      },
    });
  }

  async updateBattle(id: string, userId: string, dto: UpdateRawShiftBattleDto) {
    const battle = await this.prisma.rawShiftBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('RawShift battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can update');

    // If dates provided, validate
    const startDate = dto.startDate ? new Date(dto.startDate) : battle.startDate;
    const endDate = dto.endDate ? new Date(dto.endDate) : battle.endDate;
    if (endDate <= startDate) throw new BadRequestException('endDate must be after startDate');

    return this.prisma.rawShiftBattle.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        coverImage: dto.coverImage,
        bannerImage: dto.bannerImage,
        software: dto.software,
        softwareLabel: dto.softwareLabel,
        requireRaw: dto.requireRaw,
        rejectAiEdited: dto.rejectAiEdited,
        participantLimit: dto.participantLimit,
        participationScope: dto.participationScope,
        radiusKm: dto.radiusKm,
        locationName: dto.locationName,
        latitude: dto.latitude as any,
        longitude: dto.longitude as any,
        placeId: dto.placeId,
        startDate,
        endDate,
      },
    });
  }

  async deleteBattle(id: string, userId: string) {
    const battle = await this.prisma.rawShiftBattle.findUnique({ where: { id } });
    if (!battle) throw new NotFoundException('RawShift battle not found');
    if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can delete');

    await this.prisma.rawShiftBattle.delete({ where: { id } });
    return { success: true };
  }

async joinBattle(battleId: string, userId: string) {
  const battle = await this.prisma.rawShiftBattle.findUnique({
    where: { id: battleId },
  });

  if (!battle)
    throw new NotFoundException('RawShift battle not found');

  // ✅ FIXED (Type-safe check)
  if (!this.OPEN_RAWSHIFT_STATUSES.has(battle.status)) {
    throw new BadRequestException('Battle is not open for joining');
  }

  if (battle.participantLimit) {
    const count = await this.prisma.rawShiftParticipant.count({
      where: { battleId },
    });

    if (count >= battle.participantLimit)
      throw new BadRequestException('Participant limit reached');
  }

  return this.prisma.rawShiftParticipant.upsert({
    where: { battleId_userId: { battleId, userId } },
    create: { battleId, userId },
    update: { leftAt: null },
  });
}

async submitEntry(
  battleId: string,
  userId: string,
  dto: SubmitRawShiftEntryDto,
) {
  const battle = await this.prisma.rawShiftBattle.findUnique({
    where: { id: battleId },
  });

  if (!battle)
    throw new NotFoundException('RawShift battle not found');

  const now = new Date();

  if (now > battle.endDate)
    throw new BadRequestException('Battle already ended');

  // ✅ FIXED
  if (!this.OPEN_RAWSHIFT_STATUSES.has(battle.status)) {
    throw new BadRequestException('Battle is not open for submissions');
  }

  await this.prisma.rawShiftParticipant.upsert({
    where: { battleId_userId: { battleId, userId } },
    create: { battleId, userId },
    update: { leftAt: null },
  });

  return this.prisma.rawShiftEntry.upsert({
    where: { battleId_userId: { battleId, userId } },
    create: {
      battleId,
      userId,
      rawMediaUrl: dto.rawMediaUrl,
      rawThumbnailUrl: dto.rawThumbnailUrl,
      editedMediaUrl: dto.editedMediaUrl,
      editedThumbnailUrl: dto.editedThumbnailUrl,
      caption: dto.caption,
      hashtags: dto.hashtags ?? [],
      status: RawShiftEntryStatus.SUBMITTED,
      score: 0,
    },
    update: {
      rawMediaUrl: dto.rawMediaUrl,
      rawThumbnailUrl: dto.rawThumbnailUrl,
      editedMediaUrl: dto.editedMediaUrl,
      editedThumbnailUrl: dto.editedThumbnailUrl,
      caption: dto.caption,
      hashtags: dto.hashtags ?? [],
      status: RawShiftEntryStatus.SUBMITTED,
    },
  });
}

 async voteEntry(entryId: string, userId: string, dto: VoteRawShiftDto) {
  const entry = await this.prisma.rawShiftEntry.findUnique({
    where: { id: entryId },
    include: { battle: true },
  });

  if (!entry)
    throw new NotFoundException('Entry not found');

  const now = new Date();

  if (now > entry.battle.endDate)
    throw new BadRequestException('Voting closed (battle ended)');

  // ✅ FIXED
  if (!this.OPEN_RAWSHIFT_STATUSES.has(entry.battle.status)) {
    throw new BadRequestException('Battle is not open for voting');
  }

  const value = dto.value ?? 1;

  await this.prisma.rawShiftVote.upsert({
    where: { entryId_userId: { entryId, userId } },
    create: { entryId, userId, value },
    update: { value },
  });

  const agg = await this.prisma.rawShiftVote.aggregate({
    where: { entryId },
    _sum: { value: true },
  });

  return this.prisma.rawShiftEntry.update({
    where: { id: entryId },
    data: { score: agg._sum.value ?? 0 },
  });
}

  async createComment(battleId: string, userId: string, dto: CreateRawShiftCommentDto) {
    const battle = await this.prisma.rawShiftBattle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('RawShift battle not found');

    if (dto.entryId) {
      const entry = await this.prisma.rawShiftEntry.findFirst({
        where: { id: dto.entryId, battleId },
      });
      if (!entry) throw new BadRequestException('Invalid entryId for this battle');
    }

    return this.prisma.rawShiftComment.create({
      data: {
        battleId,
        entryId: dto.entryId ?? null,
        userId,
        message: dto.message,
      },
    });
  }

  async completeBattle(battleId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const battle = await tx.rawShiftBattle.findUnique({ where: { id: battleId } });
      if (!battle) throw new NotFoundException('RawShift battle not found');
      if (battle.creatorId !== userId) throw new ForbiddenException('Only creator can complete');

      const now = new Date();
      if (now < battle.endDate) throw new BadRequestException('Battle not ended yet');

      // eligible entries (approved if you use moderation; otherwise allow SUBMITTED)
      const eligible = await tx.rawShiftEntry.findMany({
        where: {
          battleId,
          status: { in: [RawShiftEntryStatus.APPROVED, RawShiftEntryStatus.SUBMITTED] },
        },
        select: { id: true, userId: true, score: true, createdAt: true },
      });

      if (eligible.length === 0) {
        return tx.rawShiftBattle.update({
          where: { id: battleId },
          data: { status: RawShiftStatus.COMPLETED, winnerUserId: null },
        });
      }

      eligible.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.createdAt.getTime() - b.createdAt.getTime(); // earlier wins tie
      });

      const winner = eligible[0];

      return tx.rawShiftBattle.update({
        where: { id: battleId },
        data: {
          status: RawShiftStatus.COMPLETED,
          winnerUserId: winner.userId,
        },
      });
    });
  }
}