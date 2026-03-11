import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { GetEventsQueryDto } from './dto/get-event-query.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

private assertValidRange(start: Date, end: Date) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new BadRequestException('Invalid startDate or endDate');
  }

  const now = new Date();
  if (start <= now) {
    throw new BadRequestException('Start date must be greater than current date/time');
  }

  if (end <= now) {
    throw new BadRequestException('End date must be greater than current date/time');
  }
  if (end <= start) {
    throw new BadRequestException('End date must be after start date');
  }
}

  async createEvent(userId: string, dto: CreateEventDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    this.assertValidRange(start, end);

    // 1) user থেকে activeProfileId
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, activeProfileId: true },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!user.activeProfileId) throw new BadRequestException('No active profile selected');

    // 2) active profile validate + type read
    const activeProfile = await this.prisma.profile.findFirst({
      where: { id: user.activeProfileId, userId },
      select: { id: true, activeType: true },
    });

    if (!activeProfile) throw new BadRequestException('Active profile not found for this user');
    if (!activeProfile.activeType) throw new BadRequestException('Active profile type is not set');

    return this.prisma.event.create({
      data: {
        ownerId: userId,
        profileType: activeProfile.activeType,
        coverImage: dto.coverImage,
        eventTitle: dto.eventTitle,
        description: dto.description ?? null,
        location: dto.location ?? null,
        locationAddress: dto.locationAddress ?? null,
        latitude: dto.longitude ?? null,
        longitude: dto.longitude ?? null,
        websiteLink: dto.websiteLink ?? null,
        price: dto.price,
        eventType: dto.eventType,  
        startDate: start,
        endDate: end,
      },
    });
  }

  async getEvents(query: GetEventsQueryDto) {
    const { status, type, ownerId, search, from, to, page = 1, limit = 20 } = query;

    const where: any = {};

    if (status) where.eventStatus = status;
    if (type) where.eventType = type;
    if (ownerId) where.ownerId = ownerId;

    // date filters
    if (from || to) {
      where.AND = [];
      if (from) where.AND.push({ startDate: { gte: new Date(from) } });
      if (to) where.AND.push({ endDate: { lte: new Date(to) } });
    }

    // search
    if (search?.trim()) {
      const s = search.trim();
      where.OR = [
        { eventTitle: { contains: s, mode: 'insensitive' } },
        { location: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
      ];
    }

    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safePage = Math.max(page, 1);
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: safeLimit,
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              profile: {
                select: { id: true, imageUrl: true, profileName: true },
              },
            },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async updateEvent(userId: string, eventId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');

    if (event.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    // validate range if provided
    const start = dto.startDate ? new Date(dto.startDate) : new Date(event.startDate);
    const end = dto.endDate ? new Date(dto.endDate) : new Date(event.endDate);
    if (dto.startDate || dto.endDate) this.assertValidRange(start, end);

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        coverImage: dto.coverImage,
        eventTitle: dto.eventTitle,
        description: dto.description === undefined ? undefined : dto.description ?? null,
        location: dto.location === undefined ? undefined : dto.location ?? null,
        locationAddress: dto.locationAddress === undefined ? undefined : dto.locationAddress ?? null,
        latitude: dto.locationAddress === undefined ? undefined : dto.latitude ?? null,
        longitude: dto.longitude === undefined ? undefined : dto.longitude ?? null, 
        websiteLink: dto.websiteLink === undefined ? undefined : dto.websiteLink ?? null,
        price: dto.price,
        eventType: dto.eventType,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, ownerId: true },
    });

    if (!event) throw new NotFoundException('Event not found');

    if (event.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this event');
    }

    await this.prisma.event.delete({ where: { id: eventId } });
    return { id: eventId, deleted: true };
  }
}