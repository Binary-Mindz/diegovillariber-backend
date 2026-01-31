import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { BattleQueryDto } from './dto/battle-query.dto';
import { CreateBattleDto } from './dto/create-battle.dto';
import { CreateBattleEntryDto } from './dto/create-battle-entry.dto';
import { BattleStatus } from 'generated/prisma/enums';

@Injectable()
export class BattleService {
  constructor(private prisma: PrismaService) {}

  async createBattle(adminId: string, dto: CreateBattleDto) {
    return this.prisma.battle.create({
      data: {
        hostId: adminId,
        title: dto.title,
        description: dto.description ?? null,
        coverImage: dto.coverImage ?? null,
        battleCategory: (dto.battleCategory as any) ?? 'HEAD_TO_HEAD',
        preference: (dto.preference as any) ?? 'Car',
        status: 'PENDING',
        maxParticipants: Math.min(dto.maxParticipants ?? 10, 10),
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
      },
    });
  }

  async startBattle(adminId: string, battleId: string) {
    const battle = await this.prisma.battle.findUnique({ where: { id: battleId } });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.hostId !== adminId) throw new ForbiddenException('Only host/admin can start');
    if (battle.status !== 'PENDING') throw new BadRequestException('Battle is not in PENDING');

    return this.prisma.battle.update({
      where: { id: battleId },
      data: { status: BattleStatus.ONGOING, startTime: battle.startTime ?? new Date() },
    });
  }

  async listBattles(query: BattleQueryDto) {
    const page = Number(query.page ?? '1');
    const limit = Number(query.limit ?? '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.battle.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.battle.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async joinBattle(userId: string, battleId: string) {
    return this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({ where: { id: battleId } });
      if (!battle) throw new NotFoundException('Battle not found');

      if (battle.status !== 'PENDING' && battle.status !== BattleStatus.ONGOING) {
        throw new BadRequestException('Battle is not joinable');
      }

      const activeCount = await tx.battleParticipant.count({
        where: { battleId, isActive: true },
      });

      if (activeCount >= battle.maxParticipants) {
        throw new BadRequestException('Battle is full');
      }

      try {
        return await tx.battleParticipant.create({
          data: { battleId, userId },
        });
      } catch {
        throw new BadRequestException('Already joined this battle');
      }
    });
  }

  async createEntry(userId: string, battleId: string, dto: CreateBattleEntryDto) {
    return this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({ where: { id: battleId } });
      if (!battle) throw new NotFoundException('Battle not found');
      if (battle.status !== BattleStatus.ONGOING) throw new BadRequestException('Battle is not active');

      const participant = await tx.battleParticipant.findUnique({
        where: { battleId_userId: { battleId, userId } },
      });
      if (!participant) throw new ForbiddenException('You are not a participant');

      // one entry per participant (schema unique)
      const existing = await tx.battleEntry.findFirst({
        where: { battleId, participantId: participant.id },
      });
      if (existing) throw new BadRequestException('You already submitted an entry');

      // create post
      const post = await tx.post.create({
        data: {
          userId,
          postType: 'Battle_Post',
          mediaUrl: dto.mediaUrl,
          caption: dto.caption ?? null,
          point: 5,
        },
      });

      // attach entry
      const entry = await tx.battleEntry.create({
        data: {
          battleId,
          participantId: participant.id,
          postId: post.id,
        },
        include: { post: true },
      });

      return entry;
    });
  }

  async vote(voterUserId: string, battleId: string, entryId: string) {
    return this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({ where: { id: battleId } });
      if (!battle) throw new NotFoundException('Battle not found');
      if (battle.status !== BattleStatus.ONGOING) throw new BadRequestException('Battle is not active');

      const entry = await tx.battleEntry.findFirst({
        where: { id: entryId, battleId },
        include: { participant: true },
      });
      if (!entry) throw new NotFoundException('Entry not found');

      // optional: prevent self vote
      if (entry.participant.userId === voterUserId) {
        throw new BadRequestException('You cannot vote your own entry');
      }

      try {
        return await tx.battleVote.create({
          data: { battleId, entryId, voterUserId },
        });
      } catch {
        throw new BadRequestException('You already voted in this battle');
      }
    });
  }

  async endBattle(adminId: string, battleId: string) {
    return this.prisma.$transaction(async (tx) => {
      const battle = await tx.battle.findUnique({
        where: { id: battleId },
        include: { result: true },
      });
      if (!battle) throw new NotFoundException('Battle not found');
      if (battle.hostId !== adminId) throw new ForbiddenException('Only host/admin can end');

      if (battle.status === BattleStatus.COMPLETED) return battle;

      // end battle
      await tx.battle.update({
        where: { id: battleId },
        data: { status: BattleStatus.COMPLETED, endTime: new Date() },
      });

    
      const grouped = await tx.battleVote.groupBy({
        by: ['entryId'],
        where: { battleId },
        _count: { entryId: true },
        orderBy: { _count: { entryId: 'desc' } },
      });

      if (grouped.length === 0) {
        return { message: 'Battle ended. No votes, no winner.' };
      }

      const winnerEntryId = grouped[0].entryId;

      const winnerEntry = await tx.battleEntry.findUnique({
        where: { id: winnerEntryId },
        include: { participant: true },
      });
      if (!winnerEntry) throw new BadRequestException('Winner entry not found');

      const winnerUserId = winnerEntry.participant.userId;
      const rewardPoints = 250;

      const result = await tx.battleResult.upsert({
        where: { battleId },
        update: { winnerUserId, winnerEntryId, rewardPoints },
        create: { battleId, winnerUserId, winnerEntryId, rewardPoints },
      });

      // reward points
      await tx.user.update({
        where: { id: winnerUserId },
        data: { totalPoints: { increment: rewardPoints } },
      });

      return result;
    });
  }

  async getBattleDetails(battleId: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      include: {
        participants: { include: { user: true } },
        entries: { include: { post: true, participant: { include: { user: true } } } },
        result: true,
      },
    });

    if (!battle) throw new NotFoundException('Battle not found');

    const counts = await this.prisma.battleVote.groupBy({
      by: ['entryId'],
      where: { battleId },
      _count: { entryId: true },
    });

    const map = new Map(counts.map((c) => [c.entryId, c._count.entryId]));

    return {
      ...battle,
      entries: battle.entries.map((e) => ({
        ...e,
        voteCount: map.get(e.id) ?? 0,
      })),
    };
  }
}
