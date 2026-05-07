import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCarStoryDto } from './dto/create-car-story.dto';
import { UpdateCarStoryDto } from './dto/update-car-story.dto';
import { CreateCarMilestoneDto } from './dto/create-car-milestone.dto';
import { UpdateCarMilestoneDto } from './dto/update-car-milestone.dto';

@Injectable()
export class CarStoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createStory(userId: string, dto: CreateCarStoryDto) {
    return this.prisma.carStory.create({
      data: {
        userId,
        carName: dto.carName,
        firstDayPhotoUrl: dto.firstDayPhotoUrl ?? null,
        currentPhotoUrl: dto.currentPhotoUrl ?? null,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        whereFound: dto.whereFound ?? null,
        price: dto.price ?? null,
        purchaseMileage: dto.purchaseMileage ?? null,
        currentMileage: dto.currentMileage ?? null,
        isDreamCar: dto.isDreamCar ?? false,
        purchaseStory: dto.purchaseStory ?? null,
        futurePlans: dto.futurePlans ?? null,
      },
    });
  }

  async getMyStories(userId: string) {
    return this.prisma.carStory.findMany({
      where: { userId },
      include: {
        milestones: {
          orderBy: {
            date: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStoryDetails(userId: string, storyId: string) {
    const story = await this.prisma.carStory.findUnique({
      where: { id: storyId },
      include: {
        milestones: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!story) {
      throw new NotFoundException('Car story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You are not allowed to access this story');
    }

    return story;
  }

  async updateStory(userId: string, storyId: string, dto: UpdateCarStoryDto) {
    await this.ensureStoryOwner(userId, storyId);

    return this.prisma.carStory.update({
      where: { id: storyId },
      data: {
        carName: dto.carName,
        firstDayPhotoUrl: dto.firstDayPhotoUrl,
        currentPhotoUrl: dto.currentPhotoUrl,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        whereFound: dto.whereFound,
        price: dto.price,
        purchaseMileage: dto.purchaseMileage,
        currentMileage: dto.currentMileage,
        isDreamCar: dto.isDreamCar,
        purchaseStory: dto.purchaseStory,
        futurePlans: dto.futurePlans,
      },
    });
  }

  async deleteStory(userId: string, storyId: string) {
    await this.ensureStoryOwner(userId, storyId);

    await this.prisma.carStory.delete({
      where: { id: storyId },
    });

    return { deleted: true };
  }

  async createMilestone(
    userId: string,
    storyId: string,
    dto: CreateCarMilestoneDto,
  ) {
    await this.ensureStoryOwner(userId, storyId);

    return this.prisma.carMilestone.create({
      data: {
        userId,
        carStoryId: storyId,
        title: dto.title,
        type: dto.type,
        date: dto.date ? new Date(dto.date) : null,
        description: dto.description ?? null,
        cost: dto.cost ?? null,
        photoUrl: dto.photoUrl ?? null,
        mileageAtTime: dto.mileageAtTime ?? null,
        shopOrMechanic: dto.shopOrMechanic ?? null,
      },
    });
  }

  async updateMilestone(
    userId: string,
    storyId: string,
    milestoneId: string,
    dto: UpdateCarMilestoneDto,
  ) {
    await this.ensureMilestoneOwner(userId, storyId, milestoneId);

    return this.prisma.carMilestone.update({
      where: { id: milestoneId },
      data: {
        title: dto.title,
        type: dto.type,
        date: dto.date ? new Date(dto.date) : undefined,
        description: dto.description,
        cost: dto.cost,
        photoUrl: dto.photoUrl,
        mileageAtTime: dto.mileageAtTime,
        shopOrMechanic: dto.shopOrMechanic,
      },
    });
  }

  async deleteMilestone(userId: string, storyId: string, milestoneId: string) {
    await this.ensureMilestoneOwner(userId, storyId, milestoneId);

    await this.prisma.carMilestone.delete({
      where: { id: milestoneId },
    });

    return { deleted: true };
  }

  private async ensureStoryOwner(userId: string, storyId: string) {
    const story = await this.prisma.carStory.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new NotFoundException('Car story not found');
    }

    if (story.userId !== userId) {
      throw new ForbiddenException('You are not allowed to modify this story');
    }

    return story;
  }

  private async ensureMilestoneOwner(
    userId: string,
    storyId: string,
    milestoneId: string,
  ) {
    const milestone = await this.prisma.carMilestone.findUnique({
      where: { id: milestoneId },
    });

    if (!milestone) {
      throw new NotFoundException('Milestone not found');
    }

    if (milestone.userId !== userId || milestone.carStoryId !== storyId) {
      throw new BadRequestException('Invalid milestone for this story');
    }

    return milestone;
  }
}