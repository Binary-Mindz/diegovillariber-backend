import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';

import { CreateBikeDto } from './dto/create-bike.dto';
import { UpdateBikeDto } from './dto/update-bike.dto';

import { UpdateEnginePerformanceDto } from './dto/update-engine-performance.dto';
import { UpdateBikeDrivetrainDto } from './dto/update-bike-drivetrain.dto';
import { UpdateSuspensionDto } from './dto/update-suspension.dto';
import { UpdateWheelTiresDto } from './dto/update-wheel-tires.dto';
import { UpdateElectronicsDto } from './dto/update-electronics.dto';
import { UpdateBikeUsageNotesDto } from './dto/update-usage-notes.dto';

@Injectable()
export class BikeService {
  constructor(private prisma: PrismaService) {}

  private async getActiveProfileIdOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId) {
      throw new NotFoundException('Active profile not found');
    }
    return user.activeProfileId;
  }

  private async validateOwnership(userId: string, bikeId: string) {
    const bike = await this.prisma.bike.findUnique({
      where: { id: bikeId },
      include: {
        profile: true,
        advancedBikeDatas: true,
      },
    });

    if (!bike) throw new NotFoundException('Bike not found');

    // owner check
    if (bike.profile.userId !== userId) {
      throw new ForbiddenException('Not your bike');
    }

    return bike;
  }

  private async getOrCreateAdvancedBikeDataId(bikeId: string) {
    const existing = await this.prisma.advancedBikeData.findFirst({
      where: { bikeId },
      select: { id: true },
    });

    if (existing) return existing.id;

    const created = await this.prisma.advancedBikeData.create({
      data: { bikeId },
      select: { id: true },
    });

    return created.id;
  }

  async create(userId: string, dto: CreateBikeDto) {
    const activeProfileId = await this.getActiveProfileIdOrThrow(userId);

    // Garage must belong to active profile
    const garage = await this.prisma.garage.findFirst({
      where: { id: dto.garageId, profileId: activeProfileId },
      select: { id: true },
    });

    if (!garage) {
      throw new ForbiddenException('Not your garage (active profile mismatch)');
    }

    return this.prisma.bike.create({
      data: {
        profileId: activeProfileId,
        garageId: dto.garageId,

        image: dto.image,
        make: dto.make,
        model: dto.model,
        bodyType: dto.bodyType,
        transmission: dto.transmission,
        driveTrain: dto.driveTrain,
        country: dto.country,
        color: dto.color,
        displayName: dto.displayName,
        description: dto.description,
        category: dto.category,
        listOnMarketplace: dto.listOnMarketplace ?? false,
        price: dto.price,

        // create advanced row
        advancedBikeDatas: { create: {} },
      },
    });
  }

  async getBikes() {
    return this.prisma.bike.findMany({});
  }

  async update(userId: string, bikeId: string, dto: UpdateBikeDto) {
    await this.validateOwnership(userId, bikeId);

    return this.prisma.bike.update({
      where: { id: bikeId },
      data: dto,
    });
  }

  async delete(userId: string, bikeId: string) {
    await this.validateOwnership(userId, bikeId);

    return this.prisma.bike.delete({ where: { id: bikeId } });
  }

  async get(bikeId: string) {
    const bike = await this.prisma.bike.findUnique({
      where: { id: bikeId },
      include: {
        advancedBikeDatas: {
          include: {
            engineAndPerformance: true,
            driverTrain: true,
            suspensions: true,
            wheelAndTires: true,
            bikeElectronics: true,
            bikeUsageAndNotes: true,
          },
        },
      },
    });

    if (!bike) throw new NotFoundException('Bike not found');
    return bike;
  }

  // ✅ Advanced Sections (PATCH = upsert)

  async updateEnginePerformance(userId: string, bikeId: string, dto: UpdateEnginePerformanceDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.engineAndPerformance.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async updateDrivetrain(userId: string, bikeId: string, dto: UpdateBikeDrivetrainDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.bikeDriveTrains.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async updateSuspension(userId: string, bikeId: string, dto: UpdateSuspensionDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.suspension.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async updateWheelTires(userId: string, bikeId: string, dto: UpdateWheelTiresDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.bikeWheelTires.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async updateElectronics(userId: string, bikeId: string, dto: UpdateElectronicsDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.bikeElectronics.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async updateUsageNotes(userId: string, bikeId: string, dto: UpdateBikeUsageNotesDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    return this.prisma.bikeUsageAndNotes.upsert({
      where: { advancedBikeDataId: advancedId },
      update: dto,
      create: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  // ✅ Missing POST APIs support (create-only)

  async createEnginePerformance(userId: string, bikeId: string, dto: UpdateEnginePerformanceDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.engineAndPerformance.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Engine & Performance already exists. Use PATCH to update.');

    return this.prisma.engineAndPerformance.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async createDrivetrain(userId: string, bikeId: string, dto: UpdateBikeDrivetrainDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.bikeDriveTrains.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Drivetrain already exists. Use PATCH to update.');

    return this.prisma.bikeDriveTrains.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async createSuspension(userId: string, bikeId: string, dto: UpdateSuspensionDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.suspension.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Suspension already exists. Use PATCH to update.');

    return this.prisma.suspension.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async createWheelTires(userId: string, bikeId: string, dto: UpdateWheelTiresDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.bikeWheelTires.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Wheels & Tires already exists. Use PATCH to update.');

    return this.prisma.bikeWheelTires.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async createElectronics(userId: string, bikeId: string, dto: UpdateElectronicsDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.bikeElectronics.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Electronics already exists. Use PATCH to update.');

    return this.prisma.bikeElectronics.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }

  async createUsageNotes(userId: string, bikeId: string, dto: UpdateBikeUsageNotesDto) {
    await this.validateOwnership(userId, bikeId);
    const advancedId = await this.getOrCreateAdvancedBikeDataId(bikeId);

    const exists = await this.prisma.bikeUsageAndNotes.findUnique({
      where: { advancedBikeDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Usage Notes already exists. Use PATCH to update.');

    return this.prisma.bikeUsageAndNotes.create({
      data: { ...dto, advancedBikeDataId: advancedId },
    });
  }
}