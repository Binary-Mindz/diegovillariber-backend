import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLabTimeDto } from './dto/create-lab-time.dto';
import { UpdateLabTimeDto } from './dto/update-lab-time.dto';
import { LabTimeQueryDto } from './dto/lab-time-query.dto';
import { Type } from 'generated/prisma/enums';
import { Prisma } from 'generated/prisma/client';
import { CIRCUITS_DATA } from './data/circuits.data';
import {
  findCircuitByTrackName,
  validateCircuitSelection,
} from './utils/circuit.util';
import { LabVehicleType } from './enum/lab-vehicle-type.enum';

@Injectable()
export class LabTimeService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly ALLOWED_TYPES = new Set<Type>([
    Type.OWNER,
    Type.PRO_DRIVER,
    Type.CONTENT_CREATOR,
  ]);

  private async getActiveProfileOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { activeProfileId: true },
    });

    if (!user?.activeProfileId) {
      throw new BadRequestException('Active profile not set');
    }

    const profile = await this.prisma.profile.findUnique({
      where: { id: user.activeProfileId },
      select: { id: true, activeType: true, userId: true },
    });

    if (!profile) throw new NotFoundException('Profile not found');

    if (!profile.activeType || !this.ALLOWED_TYPES.has(profile.activeType)) {
      throw new ForbiddenException(
        'Only OWNER, PRO_DRIVER, CONTENT_CREATOR can manage lap times',
      );
    }

    return profile;
  }

  getCircuits() {
    return CIRCUITS_DATA;
  }

  getCircuitLayouts(trackName: string) {
    const circuit = findCircuitByTrackName(trackName);

    if (!circuit) {
      throw new NotFoundException('Circuit not found');
    }

    return circuit;
  }

  async create(userId: string, dto: CreateLabTimeDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const date = new Date(dto.dateSet);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid dateSet');
    }

    const selectedLayout = validateCircuitSelection(
      dto.trackName,
      dto.trackLayout,
    );

    const garage = await this.prisma.garage.findFirst({
      where: {
        id: dto.garageId,
        profileId: profile.id,
      },
      select: {
        id: true,
        garageName: true,
      },
    });

    if (!garage) {
      throw new BadRequestException('Garage not found for active profile');
    }

    const vehicle = await this.resolveVehicle(
      profile.id,
      dto.vehicleType,
      dto.vehicleId,
      dto.garageId,
    );

    return this.prisma.labTime.create({
      data: {
        profileId: profile.id,

        trackName: dto.trackName,
        trackLayout: selectedLayout?.trackLayout ?? dto.trackLayout ?? null,
        latitude:
          selectedLayout?.latitude !== null &&
          selectedLayout?.latitude !== undefined
            ? new Prisma.Decimal(selectedLayout.latitude)
            : null,
        longitude:
          selectedLayout?.longitude !== null &&
          selectedLayout?.longitude !== undefined
            ? new Prisma.Decimal(selectedLayout.longitude)
            : null,

        garageId: dto.garageId,
        vehicleType: dto.vehicleType,
        vehicleId: dto.vehicleId,
        vehicleName: vehicle.vehicleName,

        lapTimeMs: dto.lapTimeMs,
        dateSet: date,

        videoUrl: dto.videoUrl ?? null,
        telemetryMedia: dto.telemetryMedia ?? [],

        transmission: dto.transmission,
        drivetrain: dto.drivetrain,
        timeOfDay: dto.timeOfDay,
        sessionType: dto.sessionType,
        weather: dto.weather,
        trackCondition: dto.trackCondition,

        airTemp: dto.airTemp ?? null,
        trackTemp: dto.trackTemp ?? null,
        humidity: dto.humidity ?? null,

        tireBrand: dto.tireBrand,
        tireModel: dto.tireModel,
        tireCompund: dto.tireCompund,
        tireWear: dto.tireWear ?? null,
        frontTireSize: dto.frontTireSize ?? null,
        frontPressure: dto.frontPressure ?? null,
        rearTireSize: dto.rearTireSize ?? null,
        rearPressure: dto.rearPressure ?? null,

        drivingStyle: dto.drivingStyle,
        fuelLoad: dto.fuelLoad ?? null,
        driverWeight: dto.driverWeight ?? null,

        additionalNotes: dto.additionalNotes,
      },
      include: {
        profile: {
          select: {
            id: true,
            profileName: true,
            activeType: true,
          },
        },
        garage: {
          select: {
            id: true,
            garageName: true,
          },
        },
      },
    });
  }

  async list(userId: string, query: LabTimeQueryDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.LabTimeWhereInput = {
      profileId: profile.id,
      ...(query.trackName
        ? {
            trackName: {
              contains: query.trackName,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.vehicleName
        ? {
            vehicleName: {
              contains: query.vehicleName,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.vehicleType
        ? {
            vehicleType: query.vehicleType,
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.labTime.findMany({
        where,
        orderBy: [{ dateSet: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        include: {
          garage: {
            select: {
              id: true,
              garageName: true,
            },
          },
        },
      }),
      this.prisma.labTime.count({ where }),
    ]);

    const enrichedItems = await Promise.all(
      items.map(async (item) => ({
        ...item,
        vehicle: await this.getVehicleDetails(
          item.profileId,
          item.vehicleType as LabVehicleType,
          item.vehicleId,
        ),
      })),
    );

    return { page, limit, total, items: enrichedItems };
  }

  async get(userId: string, labTimeId: string) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const lap = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
      include: {
        garage: {
          select: {
            id: true,
            garageName: true,
            location: true,
            description: true,
          },
        },
      },
    });

    if (!lap) {
      throw new NotFoundException('Lap time not found');
    }

    return {
      ...lap,
      vehicle: await this.getVehicleDetails(
        lap.profileId,
        lap.vehicleType as LabVehicleType,
        lap.vehicleId,
      ),
    };
  }

  async update(userId: string, labTimeId: string, dto: UpdateLabTimeDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const existing = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
      select: {
        id: true,
        profileId: true,
        trackName: true,
        trackLayout: true,
        garageId: true,
        vehicleType: true,
        vehicleId: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Lap time not found');
    }

    const nextTrackName = dto.trackName ?? existing.trackName;
    const nextTrackLayout =
      dto.trackLayout !== undefined ? dto.trackLayout : existing.trackLayout;

    const selectedLayout =
      dto.trackName !== undefined || dto.trackLayout !== undefined
        ? validateCircuitSelection(nextTrackName, nextTrackLayout)
        : null;

    const nextGarageId = dto.garageId ?? existing.garageId;
    const nextVehicleType =
      dto.vehicleType ?? (existing.vehicleType as LabVehicleType);
    const nextVehicleId = dto.vehicleId ?? existing.vehicleId;

    if (dto.garageId !== undefined) {
      const garage = await this.prisma.garage.findFirst({
        where: {
          id: dto.garageId,
          profileId: profile.id,
        },
        select: { id: true },
      });

      if (!garage) {
        throw new BadRequestException('Garage not found for active profile');
      }
    }

    let vehicleName: string | undefined;

    if (
      dto.garageId !== undefined ||
      dto.vehicleType !== undefined ||
      dto.vehicleId !== undefined
    ) {
      const vehicle = await this.resolveVehicle(
        profile.id,
        nextVehicleType,
        nextVehicleId,
        nextGarageId,
      );
      vehicleName = vehicle.vehicleName;
    }

    const payload: Prisma.LabTimeUpdateInput = {
      ...(dto.trackName !== undefined ? { trackName: dto.trackName } : {}),
      ...(dto.trackLayout !== undefined
        ? {
            trackLayout: selectedLayout?.trackLayout ?? dto.trackLayout ?? null,
          }
        : {}),
      ...(selectedLayout
        ? {
            latitude:
              selectedLayout.latitude !== null &&
              selectedLayout.latitude !== undefined
                ? new Prisma.Decimal(selectedLayout.latitude)
                : null,
            longitude:
              selectedLayout.longitude !== null &&
              selectedLayout.longitude !== undefined
                ? new Prisma.Decimal(selectedLayout.longitude)
                : null,
          }
        : {}),
      ...(dto.garageId !== undefined
        ? {
            garage: {
              connect: { id: dto.garageId },
            },
          }
        : {}),
      ...(dto.vehicleType !== undefined
        ? { vehicleType: dto.vehicleType }
        : {}),
      ...(dto.vehicleId !== undefined ? { vehicleId: dto.vehicleId } : {}),
      ...(vehicleName !== undefined ? { vehicleName } : {}),
      ...(dto.lapTimeMs !== undefined ? { lapTimeMs: dto.lapTimeMs } : {}),
      ...(dto.dateSet !== undefined
        ? (() => {
            const d = new Date(dto.dateSet);
            if (Number.isNaN(d.getTime())) {
              throw new BadRequestException('Invalid dateSet');
            }
            return { dateSet: d };
          })()
        : {}),
      ...(dto.videoUrl !== undefined ? { videoUrl: dto.videoUrl ?? null } : {}),
      ...(dto.telemetryMedia !== undefined
        ? { telemetryMedia: dto.telemetryMedia ?? [] }
        : {}),
      ...(dto.transmission !== undefined
        ? { transmission: dto.transmission }
        : {}),
      ...(dto.drivetrain !== undefined ? { drivetrain: dto.drivetrain } : {}),
      ...(dto.timeOfDay !== undefined ? { timeOfDay: dto.timeOfDay } : {}),
      ...(dto.sessionType !== undefined
        ? { sessionType: dto.sessionType }
        : {}),
      ...(dto.weather !== undefined ? { weather: dto.weather } : {}),
      ...(dto.trackCondition !== undefined
        ? { trackCondition: dto.trackCondition }
        : {}),
      ...(dto.airTemp !== undefined ? { airTemp: dto.airTemp ?? null } : {}),
      ...(dto.trackTemp !== undefined
        ? { trackTemp: dto.trackTemp ?? null }
        : {}),
      ...(dto.humidity !== undefined ? { humidity: dto.humidity ?? null } : {}),
      ...(dto.tireBrand !== undefined ? { tireBrand: dto.tireBrand } : {}),
      ...(dto.tireModel !== undefined ? { tireModel: dto.tireModel } : {}),
      ...(dto.tireCompund !== undefined
        ? { tireCompund: dto.tireCompund }
        : {}),
      ...(dto.tireWear !== undefined ? { tireWear: dto.tireWear ?? null } : {}),
      ...(dto.frontTireSize !== undefined
        ? { frontTireSize: dto.frontTireSize ?? null }
        : {}),
      ...(dto.frontPressure !== undefined
        ? { frontPressure: dto.frontPressure ?? null }
        : {}),
      ...(dto.rearTireSize !== undefined
        ? { rearTireSize: dto.rearTireSize ?? null }
        : {}),
      ...(dto.rearPressure !== undefined
        ? { rearPressure: dto.rearPressure ?? null }
        : {}),
      ...(dto.drivingStyle !== undefined
        ? { drivingStyle: dto.drivingStyle }
        : {}),
      ...(dto.fuelLoad !== undefined ? { fuelLoad: dto.fuelLoad ?? null } : {}),
      ...(dto.driverWeight !== undefined
        ? { driverWeight: dto.driverWeight ?? null }
        : {}),
      ...(dto.additionalNotes !== undefined
        ? { additionalNotes: dto.additionalNotes }
        : {}),
    };

    const updated = await this.prisma.labTime.update({
      where: { id: labTimeId },
      data: payload,
      include: {
        garage: {
          select: {
            id: true,
            garageName: true,
          },
        },
      },
    });

    return {
      ...updated,
      vehicle: await this.getVehicleDetails(
        updated.profileId,
        updated.vehicleType as LabVehicleType,
        updated.vehicleId,
      ),
    };
  }

  async delete(userId: string, labTimeId: string) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const existing = await this.prisma.labTime.findFirst({
      where: { id: labTimeId, profileId: profile.id },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Lap time not found');
    }

    await this.prisma.labTime.delete({ where: { id: labTimeId } });
    return { deleted: true };
  }

  private async resolveVehicle(
    profileId: string,
    vehicleType: LabVehicleType,
    vehicleId: string,
    garageId: string,
  ) {
    if (vehicleType === LabVehicleType.CAR) {
      const car = await this.prisma.car.findFirst({
        where: {
          id: vehicleId,
          profileId,
          garageId,
        },
        select: {
          id: true,
          make: true,
          model: true,
          displayName: true,
          image: true,
        },
      });

      if (!car) {
        throw new BadRequestException('Car not found in selected garage');
      }

      return {
        vehicleName:
          car.displayName?.trim() ||
          [car.make, car.model].filter(Boolean).join(' ').trim() ||
          'Car',
      };
    }

    if (vehicleType === LabVehicleType.BIKE) {
      const bike = await this.prisma.bike.findFirst({
        where: {
          id: vehicleId,
          profileId,
          garageId,
        },
        select: {
          id: true,
          make: true,
          model: true,
          displayName: true,
          image: true,
        },
      });

      if (!bike) {
        throw new BadRequestException('Bike not found in selected garage');
      }

      return {
        vehicleName:
          bike.displayName?.trim() ||
          [bike.make, bike.model].filter(Boolean).join(' ').trim() ||
          'Bike',
      };
    }

    throw new BadRequestException('Invalid vehicle type');
  }

  private async getVehicleDetails(
    profileId: string,
    vehicleType: LabVehicleType,
    vehicleId: string,
  ) {
    if (vehicleType === LabVehicleType.CAR) {
      const car = await this.prisma.car.findFirst({
        where: {
          id: vehicleId,
          profileId,
        },
        include: {
          garage: {
            select: {
              id: true,
              garageName: true,
              location: true,
              description: true,
            },
          },
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
          legalNotices: true,
          marketplaceProduct: true,
        },
      });

      return car
        ? {
            type: LabVehicleType.CAR,
            ...car,
          }
        : null;
    }

    if (vehicleType === LabVehicleType.BIKE) {
      const bike = await this.prisma.bike.findFirst({
        where: {
          id: vehicleId,
          profileId,
        },
        include: {
          garage: {
            select: {
              id: true,
              garageName: true,
              location: true,
              description: true,
            },
          },
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
          legalNotices: true,
        },
      });

      return bike
        ? {
            type: LabVehicleType.BIKE,
            ...bike,
          }
        : null;
    }

    return null;
  }
}
