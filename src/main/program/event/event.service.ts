import { PrismaService } from '@/common/prisma/prisma.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

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


  async getEvents() {
    return this.prisma.event.findMany({
      where: { eventStatus: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, username: true } },
      },
    });
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