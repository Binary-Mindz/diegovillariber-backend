import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

import { UpdateEnginePowerDto } from './dto/update-engine-power.dto';
import { UpdateDrivetrainDto } from './dto/update-drivetrain.dto';
import { UpdateChassisBrakesDto } from './dto/update-chassis-break.dto';
import { UpdateTuningAeroDto } from './dto/update-tuning-aero.dto';
import { UpdateInteriorSafetyDto } from './dto/update-interior-safety.dto';
import { UpdateUsageNotesDto } from './dto/update-usage-notes.dto';
import { UpdateWheelsTiresDto } from './dto/update-wheels-tires.dto';

@Injectable()
export class CarService {
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

  private async validateOwnership(userId: string, carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: {
        profile: true,
        advancedCarDatas: true,
      },
    });

    if (!car) throw new NotFoundException('Car not found');

    // owner check
    if (car.profile.userId !== userId) {
      throw new ForbiddenException('Not your car');
    }

    return car;
  }

  private async getOrCreateAdvancedCarDataId(carId: string) {
    const existing = await this.prisma.advancedCarData.findFirst({
      where: { carId },
      select: { id: true },
    });

    if (existing) return existing.id;

    const created = await this.prisma.advancedCarData.create({
      data: { carId },
      select: { id: true },
    });

    return created.id;
  }

  async create(userId: string, dto: CreateCarDto) {
    const activeProfileId = await this.getActiveProfileIdOrThrow(userId);

    // Garage must belong to active profile
    const garage = await this.prisma.garage.findFirst({
      where: {
        id: dto.garageId,
        profileId: activeProfileId,
      },
      select: { id: true },
    });

    if (!garage) {
      throw new ForbiddenException('Not your garage (active profile mismatch)');
    }

    // create car + create advancedCarData row
    return this.prisma.car.create({
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

        advancedCarDatas: { create: {} },
      },
    });
  }

  async getCars(){
    const cars = await this.prisma.car.findMany({})
    return cars
  }

  async update(userId: string, carId: string, dto: UpdateCarDto) {
    await this.validateOwnership(userId, carId);
    return this.prisma.car.update({
      where: { id: carId },
      data: dto,
    });
  }

  async delete(userId: string, carId: string) {
    await this.validateOwnership(userId, carId);
    return this.prisma.car.delete({ where: { id: carId } });
  }

  async get(carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: {
        advancedCarDatas: {
          include: {
            enginePower: true,
            drivetrain: true,
            chassisBrakes: true,
            tuningAero: true,
            interiorSafety: true,
            usageNotes: true,
            wheelsTires: true,
          },
        },
      },
    });

    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  // ✅ Advanced Sections (PATCH = upsert)

  async updateEnginePower(userId: string, carId: string, dto: UpdateEnginePowerDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.enginePower.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateDrivetrain(userId: string, carId: string, dto: UpdateDrivetrainDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.drivetrain.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateChassisBrakes(userId: string, carId: string, dto: UpdateChassisBrakesDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.chassisBrakes.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateTuningAero(userId: string, carId: string, dto: UpdateTuningAeroDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.tuningAero.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateInteriorSafety(userId: string, carId: string, dto: UpdateInteriorSafetyDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.interiorSafety.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateUsageNotes(userId: string, carId: string, dto: UpdateUsageNotesDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.usageNotes.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateWheelsTires(userId: string, carId: string, dto: UpdateWheelsTiresDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.wheelsTires.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  // ✅ Missing POST APIs support (create-only)
  // (যদি তোমার UI step-wise create করতে চায়)
  async createEnginePower(userId: string, carId: string, dto: UpdateEnginePowerDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    // already exists?
    const exists = await this.prisma.enginePower.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Engine & Power already exists. Use PATCH to update.');

    return this.prisma.enginePower.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createDrivetrain(userId: string, carId: string, dto: UpdateDrivetrainDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.drivetrain.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Drivetrain already exists. Use PATCH to update.');

    return this.prisma.drivetrain.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createChassisBrakes(userId: string, carId: string, dto: UpdateChassisBrakesDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.chassisBrakes.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Chassis & Brakes already exists. Use PATCH to update.');

    return this.prisma.chassisBrakes.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createTuningAero(userId: string, carId: string, dto: UpdateTuningAeroDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.tuningAero.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Tuning & Aero already exists. Use PATCH to update.');

    return this.prisma.tuningAero.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createInteriorSafety(userId: string, carId: string, dto: UpdateInteriorSafetyDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.interiorSafety.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Interior & Safety already exists. Use PATCH to update.');

    return this.prisma.interiorSafety.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createUsageNotes(userId: string, carId: string, dto: UpdateUsageNotesDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.usageNotes.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Usage Notes already exists. Use PATCH to update.');

    return this.prisma.usageNotes.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createWheelsTires(userId: string, carId: string, dto: UpdateWheelsTiresDto) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.wheelsTires.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists) throw new ForbiddenException('Wheels & Tires already exists. Use PATCH to update.');

    return this.prisma.wheelsTires.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }
}