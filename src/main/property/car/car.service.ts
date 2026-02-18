import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
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

  private async validateOwnership(userId: string, carId: string) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: {
        profile: true,
        advancedCarDatas: true,
      },
    });

    if (!car) throw new NotFoundException('Car not found');

    if (car.profile.userId !== userId)
      throw new ForbiddenException('Not your car');

    return car;
  }

  async create(userId: string, dto: CreateCarDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { garages: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    const ownsGarage = profile.garages.some(
      (g) => g.id === dto.garageId,
    );

    if (!ownsGarage)
      throw new ForbiddenException('Not your garage');

    return this.prisma.car.create({
      data: {
        ...dto,
        profileId: profile.id,
        advancedCarDatas: { create: {} },
      },
    });
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

    return this.prisma.car.delete({
      where: { id: carId },
    });
  }

  async get(carId: string) {
    return this.prisma.car.findUnique({
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
  }

  // 🔥 ADVANCED SECTIONS

  async updateEnginePower(userId: string, carId: string, dto: UpdateEnginePowerDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.enginePower.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateDrivetrain(userId: string, carId: string, dto: UpdateDrivetrainDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.drivetrain.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateChassisBrakes(userId: string, carId: string, dto: UpdateChassisBrakesDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.chassisBrakes.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateTuningAero(userId: string, carId: string, dto: UpdateTuningAeroDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.tuningAero.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateInteriorSafety(userId: string, carId: string, dto: UpdateInteriorSafetyDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.interiorSafety.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateUsageNotes(userId: string, carId: string, dto: UpdateUsageNotesDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.usageNotes.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }

  async updateWheelsTires(userId: string, carId: string, dto: UpdateWheelsTiresDto) {
    const car = await this.validateOwnership(userId, carId);
    const advanced = car.advancedCarDatas[0];

    return this.prisma.wheelsTires.upsert({
      where: { advancedCarDataId: advanced.id },
      update: dto,
      create: { ...dto, advancedCarDataId: advanced.id },
    });
  }
}
