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

  // CREATE EVENT
  async createEvent(userId: string, dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        ownerId: userId,
        ...dto,
      },
    });
  }

  // GET ALL EVENTS
  async getEvents() {
    return this.prisma.event.findMany({
      where: {
        eventStatus: 'APPROVED',
      },
      include: {
        owner: {
          select: { id: true, username: true },
        },
      },
    });
  }

   async updateEvent(
    userId: string,
    eventId: string,
    dto: UpdateEventDto,
  ) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.ownerId !== userId) {
      throw new ForbiddenException('You are not allowed to update this event');
    }

    if (dto.startDate && dto.endDate && dto.endDate <= dto.startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    return this.prisma.event.update({
      where: { id: eventId },
      data: dto,
    });
  }



  // JOIN EVENT
  async joinEvent(userId: string, eventId: string) {
    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) throw new NotFoundException('Event not found');

      if (event.eventStatus !== 'APPROVED') {
        throw new BadRequestException('Event is not open');
      }

      if (event.joinedCount >= event.maxParticipants) {
        throw new BadRequestException('Event is full');
      }

      const alreadyJoined = await tx.eventParticipant.findUnique({
        where: {
          eventId_userId: { eventId, userId },
        },
      });

      if (alreadyJoined) {
        throw new BadRequestException('Already joined');
      }

      await tx.eventParticipant.create({
        data: { eventId, userId },
      });

      await tx.event.update({
        where: { id: eventId },
        data: {
          joinedCount: { increment: 1 },
        },
      });

      return { message: 'Joined event successfully' };
    });
  }

  // LEAVE EVENT
  async leaveEvent(userId: string, eventId: string) {
    return this.prisma.$transaction(async (tx) => {
      const participant = await tx.eventParticipant.findUnique({
        where: {
          eventId_userId: { eventId, userId },
        },
      });

      if (!participant) {
        throw new NotFoundException('You are not joined');
      }

      await tx.eventParticipant.delete({
        where: { id: participant.id },
      });

      await tx.event.update({
        where: { id: eventId },
        data: {
          joinedCount: { decrement: 1 },
        },
      });

      return { message: 'Left event successfully' };
    });
  }

  // GET PARTICIPANTS
  async getParticipants(eventId: string) {
    return this.prisma.eventParticipant.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, username: true },
        },
      },
    });
  }
}
