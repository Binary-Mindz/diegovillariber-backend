import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
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
import { ProductCategory } from 'generated/prisma/enums';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) { }

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
      include: { profile: true },
    });

    if (!car) throw new NotFoundException('Car not found');
    if (car.profile.userId !== userId) throw new ForbiddenException('Not your car');

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

  async manageSection(
    userId: string,
    carId: string,
    section: 'enginePower' | 'drivetrain' | 'chassisBrakes' | 'tuningAero' | 'interiorSafety' | 'usageNotes' | 'wheelsTires',
    dto: any,
    action: 'create' | 'update'
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);
    const client = this.prisma[section] as any;

    if (action === 'create') {
      const exists = await client.findUnique({ where: { advancedCarDataId: advancedId }, select: { id: true } });
      if (exists) throw new ForbiddenException(`${section} profile already exists. Use PATCH to update.`);

      return client.create({ data: { ...dto, advancedCarDataId: advancedId } });
    }

    return client.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async create(userId: string, dto: CreateCarDto) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: dto.garageId },
      include: { profile: true },
    });

    if (!garage) throw new NotFoundException('Garage not found');

    if (dto.listOnMarketplace === true && dto.price == null) {
      throw new BadRequestException('Price is required when listOnMarketplace is true');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const car = await tx.car.create({
        data: {
          profileId: garage.profileId,
          garageId: dto.garageId,
          image: dto.image ?? null,
          make: dto.make ?? null,
          model: dto.model ?? null,
          bodyType: dto.bodyType,
          transmission: dto.transmission,
          driveTrain: dto.driveTrain,
          country: dto.country ?? null,
          color: dto.color ?? null,
          displayName: dto.displayName ?? null,
          description: dto.description ?? null,
          category: dto.category,
          listOnMarketplace: dto.listOnMarketplace ?? false,
          price: dto.price ?? null,
          carLocation: dto.carLocation ?? null,
          locationName: dto.locationName ?? null,
          locationAddress: dto.locationAddress ?? null,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
          placeId: dto.placeId ?? null,
          locationVisibility: dto.locationVisibility ?? null,
        },
      });

      if (car.listOnMarketplace && car.price != null) {
        await tx.productList.create({
          data: {
            ownerId: userId,
            title: car.displayName || `${car.make ?? ''} ${car.model ?? ''}`.trim() || 'Car Listing',
            productImage: car.image ?? null,
            description: car.description ?? null,
            category: ProductCategory.CAR,
            tags: [...(car.make ? [car.make] : []), ...(car.model ? [car.model] : [])],
            carBrand: car.make ?? null,
            carModel: car.model ?? null,
            price: car.price,
            quantity: 1,
            location: car.carLocation,
            locationAddress: car.locationAddress,
            latitude: car.latitude,
            longitude: car.longitude,
            placeId: car.placeId,
          },
        });
      }
      return car;
    });

    return { statusCode: 201, message: 'Car created successfully', data: result };
  }

  async getCars(page?: number, limit?: number) {
    const currentPage = page ?? 1;
    const currentLimit = limit ?? 10;
    const skip = (currentPage - 1) * currentLimit;

    const [cars, total] = await Promise.all([
      this.prisma.car.findMany({ skip, take: currentLimit }),
      this.prisma.car.count(),
    ]);

    return {
      data: cars,
      meta: {
        page: currentPage,
        limit: currentLimit,
        total,
        totalPages: Math.ceil(total / currentLimit),
      },
    };
  }

  async update(userId: string, carId: string, dto: UpdateCarDto) {
    const existingCar = await this.validateOwnership(userId, carId);

    return this.prisma.$transaction(async (tx) => {
      const updatedCar = await tx.car.update({
        where: { id: carId },
        data: dto,
      });

      if (updatedCar.listOnMarketplace === false || updatedCar.price == null) {
        await tx.productList.deleteMany({
          where: {
            ownerId: userId,
            carBrand: updatedCar.make,
            carModel: updatedCar.model,
          },
        });
      } else {
        const productData = {
          title: updatedCar.displayName || `${updatedCar.make ?? ''} ${updatedCar.model ?? ''}`.trim(),
          productImage: updatedCar.image,
          price: updatedCar.price,
          location: updatedCar.carLocation,
          locationAddress: updatedCar.locationAddress,
          latitude: updatedCar.latitude,
          longitude: updatedCar.longitude,
        };

        const existingListing = await tx.productList.findFirst({
          where: { ownerId: userId, carBrand: updatedCar.make, carModel: updatedCar.model },
        });

        if (existingListing) {
          await tx.productList.update({ where: { id: existingListing.id }, data: productData });
        } else {
          await tx.productList.create({
            data: {
              ...productData,
              ownerId: userId,
              category: ProductCategory.CAR,
              carBrand: updatedCar.make,
              carModel: updatedCar.model,
              quantity: 1,
            },
          });
        }
      }
      return updatedCar;
    });
  }
  async delete(userId: string, carId: string) {
    const car = await this.validateOwnership(userId, carId);

    return this.prisma.$transaction(async (tx) => {
      await tx.productList.deleteMany({
        where: {
          ownerId: userId,
          carBrand: car.make,
          carModel: car.model,
        },
      });

      return tx.car.delete({
        where: { id: carId },
      });
    });
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

  async updateEnginePower(
    userId: string,
    carId: string,
    dto: UpdateEnginePowerDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.enginePower.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateDrivetrain(
    userId: string,
    carId: string,
    dto: UpdateDrivetrainDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.drivetrain.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateChassisBrakes(
    userId: string,
    carId: string,
    dto: UpdateChassisBrakesDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.chassisBrakes.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateTuningAero(
    userId: string,
    carId: string,
    dto: UpdateTuningAeroDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.tuningAero.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateInteriorSafety(
    userId: string,
    carId: string,
    dto: UpdateInteriorSafetyDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.interiorSafety.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateUsageNotes(
    userId: string,
    carId: string,
    dto: UpdateUsageNotesDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.usageNotes.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async updateWheelsTires(
    userId: string,
    carId: string,
    dto: UpdateWheelsTiresDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    return this.prisma.wheelsTires.upsert({
      where: { advancedCarDataId: advancedId },
      update: dto,
      create: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createEnginePower(
    userId: string,
    carId: string,
    dto: UpdateEnginePowerDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    // already exists?
    const exists = await this.prisma.enginePower.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Engine & Power already exists. Use PATCH to update.',
      );

    return this.prisma.enginePower.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createDrivetrain(
    userId: string,
    carId: string,
    dto: UpdateDrivetrainDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.drivetrain.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Drivetrain already exists. Use PATCH to update.',
      );

    return this.prisma.drivetrain.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createChassisBrakes(
    userId: string,
    carId: string,
    dto: UpdateChassisBrakesDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.chassisBrakes.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Chassis & Brakes already exists. Use PATCH to update.',
      );

    return this.prisma.chassisBrakes.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createTuningAero(
    userId: string,
    carId: string,
    dto: UpdateTuningAeroDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.tuningAero.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Tuning & Aero already exists. Use PATCH to update.',
      );

    return this.prisma.tuningAero.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createInteriorSafety(
    userId: string,
    carId: string,
    dto: UpdateInteriorSafetyDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.interiorSafety.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Interior & Safety already exists. Use PATCH to update.',
      );

    return this.prisma.interiorSafety.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createUsageNotes(
    userId: string,
    carId: string,
    dto: UpdateUsageNotesDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.usageNotes.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Usage Notes already exists. Use PATCH to update.',
      );

    return this.prisma.usageNotes.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }

  async createWheelsTires(
    userId: string,
    carId: string,
    dto: UpdateWheelsTiresDto,
  ) {
    await this.validateOwnership(userId, carId);
    const advancedId = await this.getOrCreateAdvancedCarDataId(carId);

    const exists = await this.prisma.wheelsTires.findUnique({
      where: { advancedCarDataId: advancedId },
      select: { id: true },
    });
    if (exists)
      throw new ForbiddenException(
        'Wheels & Tires already exists. Use PATCH to update.',
      );

    return this.prisma.wheelsTires.create({
      data: { ...dto, advancedCarDataId: advancedId },
    });
  }
}
