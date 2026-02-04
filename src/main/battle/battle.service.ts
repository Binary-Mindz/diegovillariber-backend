import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateBattleDto } from './dto/create-battle.dto';
import { SubmitBattlePostDto } from './dto/submit-battle-post.dto';
import { PostType, BattleStatus } from 'generated/prisma/enums';

@Injectable()
export class BattleService {
  constructor(private readonly prisma: PrismaService) {}

  async createBattle(userId: string, dto: CreateBattleDto) {
    return this.prisma.battle.create({
      data: {
        hostId: userId,
        title: dto.title,
        description: dto.description ?? null,
        coverImage: dto.coverImage ?? null,
        battleCategory: dto.battleCategory ?? undefined,
        preference: dto.preference ?? undefined,
        maxParticipants: dto.maxParticipants ?? 10,
        startTime: dto.startTime ? new Date(dto.startTime) : null,
        endTime: dto.endTime ? new Date(dto.endTime) : null,
        status: BattleStatus.PENDING,
      },
    });
  }

  async joinBattle(battleId: string, userId: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      select: {
        id: true,
        status: true,
        maxParticipants: true,
        _count: { select: { participants: true } },
      },
    });
    if (!battle) throw new NotFoundException('Battle not found');

    if (battle.status !== BattleStatus.PENDING) {
      throw new BadRequestException('Battle is not open for joining');
    }

    if (battle._count.participants >= battle.maxParticipants) {
      throw new BadRequestException('Battle is full');
    }

    try {
      return await this.prisma.battleParticipant.create({
        data: {
          battleId,
          userId,
          joinedAt: new Date(),
          isActive: true,
        },
      });
    } catch {
      throw new BadRequestException('Already joined');
    }
  }

  async submitBattlePost(battleId: string, userId: string, dto: SubmitBattlePostDto) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      select: { id: true, status: true },
    });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.status !== BattleStatus.PENDING) {
      throw new BadRequestException('Battle is not accepting submissions');
    }

    const participant = await this.prisma.battleParticipant.findUnique({
      where: { battleId_userId: { battleId, userId } },
      select: { id: true, isActive: true },
    });
    if (!participant || !participant.isActive) {
      throw new ForbiddenException('You are not a participant of this battle');
    }

    return this.prisma.$transaction(async (tx) => {
      const existingEntry = await tx.battleEntry.findUnique({
        where: {
          battleId_participantId: { battleId, participantId: participant.id },
        },
        select: { id: true },
      });
      if (existingEntry) {
        throw new BadRequestException('You already submitted in this battle');
      }

      const xpost = await tx.xPost.create({
        data: {
          userId,
          postType: PostType.Battle_Post,
          battleId,
          battleParticipantId: participant.id,
          mediaUrl: dto.mediaUrl ?? null,
          caption: dto.caption ?? null,
        },
      });

      const entry = await tx.battleEntry.create({
        data: {
          battleId,
          participantId: participant.id,
          xpostId: xpost.id,
        },
      });

      return { xpost, entry };
    });
  }

  async voteBattle(battleId: string, voterUserId: string, entryId: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      select: { id: true, status: true },
    });
    if (!battle) throw new NotFoundException('Battle not found');
    if (battle.status !== BattleStatus.ONGOING && battle.status !== BattleStatus.PENDING) {
      throw new BadRequestException('Battle is not open for voting');
    }

    const entry = await this.prisma.battleEntry.findUnique({
      where: { id: entryId },
      select: { id: true, battleId: true },
    });
    if (!entry || entry.battleId !== battleId) {
      throw new BadRequestException('Invalid entry for this battle');
    }
    try {
      return await this.prisma.battleVote.create({
        data: {
          battleId,
          entryId,
          voterUserId,
        },
      });
    } catch {
      throw new BadRequestException('You already voted in this battle');
    }
  }

  async finalizeBattle(battleId: string, userId: string) {
    const battle = await this.prisma.battle.findUnique({
      where: { id: battleId },
      select: { id: true, hostId: true },
    });
    if (!battle) throw new NotFoundException('Battle not found');

    // optional rule: only host (or admin) can finalize
    if (battle.hostId !== userId) {
      throw new ForbiddenException('Only battle host can finalize');
    }

    const existing = await this.prisma.battleResult.findUnique({
      where: { battleId },
      select: { id: true },
    });
    if (existing) throw new BadRequestException('Battle already finalized');

    const topEntry = await this.prisma.battleEntry.findFirst({
      where: { battleId },
      orderBy: [{ votes: { _count: 'desc' } }, { createdAt: 'asc' }],
      select: {
        id: true,
        participant: { select: { userId: true } },
        _count: { select: { votes: true } },
      },
    });

    if (!topEntry) throw new BadRequestException('No entries found');

    const result = await this.prisma.battleResult.create({
      data: {
        battleId,
        winnerEntryId: topEntry.id,
        winnerUserId: topEntry.participant.userId,
        rewardPoints: 250,
      },
    });

    return { result, votes: topEntry._count.votes };
  }
}
