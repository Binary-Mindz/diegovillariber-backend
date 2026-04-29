import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateVirtualSimEventDto } from './dto/create-virtual-sim-event.dto';
import { UpdateVirtualSimEventDto } from './dto/update-virtual-sim-event.dto';
import { VirtualSimEventQueryDto } from './dto/virtual-sim-event-query.dto';
import { Type } from 'generated/prisma/enums';

@Injectable()
export class VirtualSimEventService {
  constructor(private readonly prisma: PrismaService) {}

  private async getSimProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId)
      throw new BadRequestException('Active profile not set');

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.activeProfileId },
      select: { id: true, activeType: true },
    });

    if (!profile)
      throw new NotFoundException('Profile not found');

    if (profile.activeType !== Type.SIM_RACING_DRIVER)
      throw new ForbiddenException('Only SIM_RACING_DRIVER can manage sim events');

    return profile;
  }

  async create(userId: string, dto: CreateVirtualSimEventDto) {
    const profile = await this.getSimProfile(userId);

    return this.prisma.virtualSimRacingEvent.create({
      data: {
        profileId: profile.id,
        eventTitle: dto.eventTitle,
        simPlatform: dto.simPlatform,
        circuit: dto.circuit,
        eventType: dto.eventType,
        dateAndTime: new Date(dto.dateAndTime),
        duration: dto.duration,
        maxGridSize: dto.maxGridSize ?? null,
        visibility: dto.visibility,
        serverName: dto.serverName ?? null,
        serverPassword: dto.serverPassword ?? null,
        discordLink: dto.discordLink ?? null,
        notes: dto.notes ?? null,
      },
    });
  }

  async list(userId: string, query: VirtualSimEventQueryDto) {
    const profile = await this.getSimProfile(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: any = {
      profileId: profile.id,
      ...(query.simPlatform ? { simPlatform: query.simPlatform } : {}),
      ...(query.eventType ? { eventType: query.eventType } : {}),
      ...(query.q
        ? { eventTitle: { contains: query.q, mode: 'insensitive' } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.virtualSimRacingEvent.findMany({
        where,
        orderBy: { dateAndTime: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.virtualSimRacingEvent.count({ where }),
    ]);

    return { page, limit, total, items };
  }

  async get(userId: string, id: string) {
    const profile = await this.getSimProfile(userId);

    const event = await this.prisma.virtualSimRacingEvent.findFirst({
      where: { id, profileId: profile.id },
    });

    if (!event)
      throw new NotFoundException('Event not found');

    return event;
  }

  async update(userId: string, id: string, dto: UpdateVirtualSimEventDto) {
    const profile = await this.getSimProfile(userId);

    const existing = await this.prisma.virtualSimRacingEvent.findFirst({
      where: { id, profileId: profile.id },
      select: { id: true },
    });

    if (!existing)
      throw new NotFoundException('Event not found');

    return this.prisma.virtualSimRacingEvent.update({
      where: { id },
      data: {
        ...(dto.eventTitle && { eventTitle: dto.eventTitle }),
        ...(dto.simPlatform && { simPlatform: dto.simPlatform }),
        ...(dto.circuit && { circuit: dto.circuit }),
        ...(dto.eventType && { eventType: dto.eventType }),
        ...(dto.dateAndTime && { dateAndTime: new Date(dto.dateAndTime) }),
        ...(dto.duration && { duration: dto.duration }),
        ...(dto.maxGridSize !== undefined && { maxGridSize: dto.maxGridSize }),
        ...(dto.visibility && { visibility: dto.visibility }),
        ...(dto.serverName !== undefined && { serverName: dto.serverName }),
        ...(dto.serverPassword !== undefined && { serverPassword: dto.serverPassword }),
        ...(dto.discordLink !== undefined && { discordLink: dto.discordLink }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
  }

  async delete(userId: string, id: string) {
    const profile = await this.getSimProfile(userId);

    const existing = await this.prisma.virtualSimRacingEvent.findFirst({
      where: { id, profileId: profile.id },
    });

    if (!existing)
      throw new NotFoundException('Event not found');

    await this.prisma.virtualSimRacingEvent.delete({ where: { id } });

    return { deleted: true };
  }
}