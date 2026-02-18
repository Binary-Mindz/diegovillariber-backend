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
  constructor(private prisma: PrismaService) { }

  async createEvent(userId: string, dto: CreateEventDto) {
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.event.create({
      data: {
        ownerId: userId,
        coverImage: dto.coverImage,
        eventTitle: dto.eventTitle,
        description: dto.description ?? null,
        location: dto.location ?? null,
        websiteLink: dto.websiteLink ?? null,
        price: dto.price,
        eventType: dto.eventType,
        startDate: start,
        endDate: end,
      },
    });
  }

  async getEvents(query: GetEventsQueryDto) {
    const {
      status,
      type,
      ownerId,
      search,
      from,
      to,
      page = 1,
      limit = 20,
    } = query;

    const where: any = {};

    if (status) {
      where.eventStatus = status;
    }

    if (type) {
      where.eventType = type;
    }


    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (from || to) {
      where.AND = [];

      if (from) {
        where.AND.push({
          startDate: { gte: new Date(from) },
        });
      }

      if (to) {
        where.AND.push({
          endDate: { lte: new Date(to) },
        });
      }
    }

    if (search) {
      where.OR = [
        {
          eventTitle: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          location: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const skip = (page - 1) * limit;


    const [events, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              email: true,
              profile: {
                select: {
                  id: true,
                  bio: true,
                  imageUrl: true,
                  instagramHandler: true,
                  accountType: true,
                  isActive: true,
                  suspend: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.event.count({ where }),
    ]);


    return {
      items: events,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateEvent(userId: string, eventId: string, dto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new NotFoundException('Event not found');
    if (event.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    const start = dto.startDate ? new Date(dto.startDate) : new Date(event.startDate);
    const end = dto.endDate ? new Date(dto.endDate) : new Date(event.endDate);

    if (dto.startDate || dto.endDate) {
      if (end <= start) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    const safeDto: any = { ...dto };
    delete safeDto.eventStatus;

    return this.prisma.event.update({
      where: { id: eventId },
      data: {
        coverImage: safeDto.coverImage,
        eventTitle: safeDto.eventTitle,
        description:
          safeDto.description === undefined ? undefined : safeDto.description ?? null,
        location:
          safeDto.location === undefined ? undefined : safeDto.location ?? null,
        websiteLink:
          safeDto.websiteLink === undefined ? undefined : safeDto.websiteLink ?? null,
        price: safeDto.price,
        eventType: safeDto.eventType,
        startDate: safeDto.startDate ? new Date(safeDto.startDate) : undefined,
        endDate: safeDto.endDate ? new Date(safeDto.endDate) : undefined,
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

    await this.prisma.event.delete({
      where: { id: eventId },
    });

    return { message: 'Event deleted successfully' };
  }

}