import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetAdminEventsQueryDto } from './dto/get-admin-events.query.dto';

type Trend = {
  percentage: number; // e.g. 23.5
  direction: 'UP' | 'DOWN' | 'FLAT';
};

type StatCard = {
  key:
    | 'events'
    | 'pro_driver_events'
    | 'creator_events'
    | 'total_attendees'
    | 'upcoming'
    | 'past';
  title: string;
  value: number;
  trend: Trend;
};

@Injectable()
export class AdminEventManagementervice {
  constructor(private readonly prisma: PrismaService) {}

  private getDateWindows() {
    const now = new Date();
    const last30 = new Date(now);
    last30.setDate(now.getDate() - 30);

    const prev30Start = new Date(now);
    prev30Start.setDate(now.getDate() - 60);

    const prev30End = new Date(now);
    prev30End.setDate(now.getDate() - 30);

    return { now, last30, prev30Start, prev30End };
  }

  private trend(current: number, previous: number): Trend {
    if (previous <= 0 && current > 0) return { percentage: 100, direction: 'UP' };
    if (previous <= 0 && current <= 0) return { percentage: 0, direction: 'FLAT' };

    const diff = current - previous;
    const pct = (diff / previous) * 100;

    const rounded = Math.round(pct * 10) / 10; // 1 decimal like 23.5
    const direction: Trend['direction'] =
      rounded > 0 ? 'UP' : rounded < 0 ? 'DOWN' : 'FLAT';

    return { percentage: Math.abs(rounded), direction };
  }

  async getEventsOverview(): Promise<{ cards: StatCard[] }> {
    const { last30, prev30Start, prev30End } = this.getDateWindows();

    // ---------- Current totals (all time) ----------
    const [
      totalEvents,
      totalProDriverEvents,
      totalCreatorEvents,
      totalUpcoming,
      totalPast,
    ] = await this.prisma.$transaction([
      this.prisma.event.count(),
      this.prisma.event.count({ where: { profileType: 'PRO_DRIVER' } }),
      this.prisma.event.count({ where: { profileType: 'CONTENT_CREATOR' } }),
      this.prisma.event.count({ where: { eventStatus: 'UPCOMING' } }),
      this.prisma.event.count({ where: { eventStatus: 'COMPLETED' } }),
    ]);

    // ---------- Growth windows (last 30 vs prev 30) ----------
    const [
      eventsLast30,
      eventsPrev30,

      proDriverLast30,
      proDriverPrev30,

      creatorLast30,
      creatorPrev30,

      upcomingLast30,
      upcomingPrev30,

      pastLast30,
      pastPrev30,
    ] = await this.prisma.$transaction([
      this.prisma.event.count({ where: { createdAt: { gte: last30 } } }),
      this.prisma.event.count({
        where: { createdAt: { gte: prev30Start, lt: prev30End } },
      }),

      this.prisma.event.count({
        where: { profileType: 'PRO_DRIVER', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          profileType: 'PRO_DRIVER',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { profileType: 'CONTENT_CREATOR', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          profileType: 'CONTENT_CREATOR',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { eventStatus: 'UPCOMING', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          eventStatus: 'UPCOMING',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),

      this.prisma.event.count({
        where: { eventStatus: 'COMPLETED', createdAt: { gte: last30 } },
      }),
      this.prisma.event.count({
        where: {
          eventStatus: 'COMPLETED',
          createdAt: { gte: prev30Start, lt: prev30End },
        },
      }),
    ]);

    const totalAttendees = 0;
    const attendeesLast30 = 0;
    const attendeesPrev30 = 0;

    const cards: StatCard[] = [
      {
        key: 'events',
        title: 'Events',
        value: totalEvents,
        trend: this.trend(eventsLast30, eventsPrev30),
      },
      {
        key: 'pro_driver_events',
        title: 'Pro Driver Events',
        value: totalProDriverEvents,
        trend: this.trend(proDriverLast30, proDriverPrev30),
      },
      {
        key: 'creator_events',
        title: 'Creator Events',
        value: totalCreatorEvents,
        trend: this.trend(creatorLast30, creatorPrev30),
      },
      {
        key: 'total_attendees',
        title: 'Total Attendees',
        value: totalAttendees,
        trend: this.trend(attendeesLast30, attendeesPrev30),
      },
      {
        key: 'upcoming',
        title: 'Upcoming',
        value: totalUpcoming,
        trend: this.trend(upcomingLast30, upcomingPrev30),
      },
      {
        key: 'past',
        title: 'Past Events',
        value: totalPast,
        trend: this.trend(pastLast30, pastPrev30),
      },
    ];

    return { cards };
  }

  async getAllEvents(query: GetAdminEventsQueryDto) {
  const { status, type, search, page = 1, limit = 20 } = query;

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);
  const skip = (safePage - 1) * safeLimit;

  const where: any = {};

  if (status) where.eventStatus = status;
  if (type) where.eventType = type;

  if (search?.trim()) {
    const s = search.trim();
    where.OR = [
      { eventTitle: { contains: s, mode: 'insensitive' } },
      { location: { contains: s, mode: 'insensitive' } },
      { description: { contains: s, mode: 'insensitive' } },
      { owner: { email: { contains: s, mode: 'insensitive' } } },
      { owner: { profile: { some: { profileName: { contains: s, mode: 'insensitive' } } } } },
    ];
  }

  const [items, total] = await this.prisma.$transaction([
    this.prisma.event.findMany({
      where,
      skip,
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { id: true, profileName: true, imageUrl: true },
              take: 1, 
            },
          },
        },
      },
    }),
    this.prisma.event.count({ where }),
  ]);
  const rows = items.map((e) => {
    const creatorName =
      e.owner?.profile?.[0]?.profileName ?? e.owner?.email ?? 'Unknown';

    return {
      id: e.id,
      eventTitle: e.eventTitle,
      eventType: e.eventType,
      creator: {
        id: e.owner?.id,
        name: creatorName,
        email: e.owner?.email ?? null,
        imageUrl: e.owner?.profile?.[0]?.imageUrl ?? null,
      },
      createdAt: e.createdAt, 
      location: e.location ?? null,

      attendees: null, 

      status: e.eventStatus,
    };
  });

  return {
    items: rows,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
    },
  };
}

  async getSingleEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            phone: true,
            profile: {
              select: {
                id: true,
                profileName: true,
                imageUrl: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    const creatorName =
      event.owner?.profile?.[0]?.profileName ??
      event.owner?.email ??
      event.owner?.phone ??
      'Unknown';

    return {
      statusCode: 200,
      data: {
        id: event.id,
        eventTitle: event.eventTitle,
        description: event.description ?? null,
        eventType: event.eventType,
        eventStatus: event.eventStatus,
        createdAt: event.createdAt,
        startDate: event.startDate ?? null,
        endDate: event.endDate ?? null,
        location: event.location ?? null,
        creator: {
          id: event.owner?.id ?? null,
          name: creatorName,
          email: event.owner?.email ?? null,
          phone: event.owner?.phone ?? null,
          imageUrl: event.owner?.profile?.[0]?.imageUrl ?? null,
          profileId: event.owner?.profile?.[0]?.id ?? null,
        },
      },
    };
  }

  async deleteEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      data: {
        id,
      },
    };
  }

  async deleteAllProDriverEvents() {
    const result = await this.prisma.event.deleteMany({
      where: { profileType: 'PRO_DRIVER' },
    });

    return {
      message: 'Deleted all Pro Driver events successfully',
      deletedCount: result.count,
    };
  }


  async deleteAllCreatorEvents() {
    const result = await this.prisma.event.deleteMany({
      where: { profileType: 'CONTENT_CREATOR' },
    });

    return {
      message: 'Deleted all Creator events successfully',
      deletedCount: result.count,
    };
  }


  // async syncEventsToMap() {
  //   const now = new Date();

  //   const [toOngoing, toCompleted] = await this.prisma.$transaction([
  //     this.prisma.event.updateMany({
  //       where: {
  //         eventStatus: 'UPCOMING',
  //         startDate: { lte: now },
  //         endDate: { gte: now },
  //       },
  //       data: { eventStatus: 'ONGOING' },
  //     }),
  //     this.prisma.event.updateMany({
  //       where: {
  //         eventStatus: { in: ['UPCOMING', 'ONGOING'] },
  //         endDate: { lt: now },
  //       },
  //       data: { eventStatus: 'COMPLETED' },
  //     }),
  //   ]);

  //   await this.clearMapCache();

  //   return {
  //     message: 'Events synced to map successfully',
  //     statusUpdates: {
  //       ongoingUpdated: toOngoing.count,
  //       completedUpdated: toCompleted.count,
  //     },
  //   };
  // }

  
  // async clearMapCache() {
  //   await this.cache.reset();

  //   return {
  //     message: 'Map cache cleared successfully (all users)',
  //   };
  // }

  //  Export events to CSV

  async exportEventsToCsv(): Promise<{ filename: string; csv: string }> {
  const events = await this.prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: {
          id: true,
          email: true,
          profile: { select: { profileName: true }, take: 1 },
        },
      },
    },
  });

  const header = ['Event','Type','Creator','Created Date','Location','Attendees','Status'];

  const rows = events.map((e) => {
    const creator =
      e.owner?.profile?.[0]?.profileName ?? e.owner?.email ?? e.owner?.id ?? 'Unknown';

    return [
      e.eventTitle ?? '',
      String(e.eventType ?? ''),
      creator,
      e.createdAt?.toISOString?.() ?? '',
      e.location ?? '',
      '', // attendees placeholder
      String(e.eventStatus ?? ''),
    ];
  });

  const escape = (v: string) => {
    const s = v ?? '';
    const mustWrap = /[",\n]/.test(s);
    const safe = s.replace(/"/g, '""');
    return mustWrap ? `"${safe}"` : safe;
  };

  const csv = [header, ...rows]
    .map((line) => line.map((c) => escape(String(c))).join(','))
    .join('\n');

  const filename = `events-export-${new Date().toISOString().slice(0, 10)}.csv`;
  return { filename, csv };
}


}