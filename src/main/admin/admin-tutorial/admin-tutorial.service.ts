import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateTutorialDto } from './dto/create-tutorial.dto';
import { UpdateTutorialDto } from './dto/update-tutorial.dto';
import { TutorialQueryDto } from './dto/tutorial-query.dto';
import { TutorialStatus } from 'generated/prisma/enums';

@Injectable()
export class AdminTutorialService {
  constructor(private readonly prisma: PrismaService) {}

  async createTutorial(dto: CreateTutorialDto) {
    const existing = await this.prisma.tutorial.findFirst({
      where: {
        sectionCode: dto.sectionCode,
        learnVersion: dto.learnVersion,
        order: dto.order,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'A tutorial already exists with this sectionCode, learnVersion and order',
      );
    }

    return this.prisma.tutorial.create({
      data: {
        sectionCode: dto.sectionCode,
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,
        order: dto.order,
        learnVersion: dto.learnVersion,
        status: TutorialStatus.PUBLISHED,
      },
    });
  }

  async getTutorials(query: TutorialQueryDto) {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {
      status: TutorialStatus.PUBLISHED,
    };

    if (query.sectionCode) {
      where.sectionCode = query.sectionCode;
    }

    if (query.learnVersion) {
      where.learnVersion = Number(query.learnVersion);
    }

    if (query.search) {
      where.title = {
        contains: query.search,
        mode: 'insensitive',
      };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.tutorial.findMany({
        where,
        orderBy: [{ learnVersion: 'desc' }, { sectionCode: 'asc' }, { order: 'asc' }],
        skip,
        take: limit,
      }),
      this.prisma.tutorial.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async getTutorialById(id: string) {
    const tutorial = await this.prisma.tutorial.findFirst({
      where: {
        id,
        status: TutorialStatus.PUBLISHED,
      },
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }

    return tutorial;
  }

  async updateTutorial(id: string, dto: UpdateTutorialDto) {
    const tutorial = await this.prisma.tutorial.findUnique({
      where: { id },
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }

    const sectionCode = dto.sectionCode ?? tutorial.sectionCode;
    const learnVersion = dto.learnVersion ?? tutorial.learnVersion;
    const order = dto.order ?? tutorial.order;

    const conflictingTutorial = await this.prisma.tutorial.findFirst({
      where: {
        id: { not: id },
        sectionCode,
        learnVersion,
        order,
      },
    });

    if (conflictingTutorial) {
      throw new BadRequestException(
        'Another tutorial already exists with this sectionCode, learnVersion and order',
      );
    }

    return this.prisma.tutorial.update({
      where: { id },
      data: {
        sectionCode: dto.sectionCode,
        title: dto.title,
        description: dto.description,
        videoUrl: dto.videoUrl,
        order: dto.order,
        learnVersion: dto.learnVersion,
      },
    });
  }

  async deleteTutorial(id: string) {
    const tutorial = await this.prisma.tutorial.findUnique({
      where: { id },
    });

    if (!tutorial) {
      throw new NotFoundException('Tutorial not found');
    }

    await this.prisma.tutorial.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }
}