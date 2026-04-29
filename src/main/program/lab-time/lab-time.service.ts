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
import { CompareLabTimeDto } from './dto/compare-lab-time.dto';
import Papa from 'papaparse';
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

  private parseTelemetryCsvFile(
    file?: Express.Multer.File,
  ): Prisma.InputJsonValue {
    if (!file) return [];

    const csvText = file.buffer.toString('utf-8');

    const lines = csvText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const headerIndex = lines.findIndex((line) =>
      line.toLowerCase().startsWith('record,time,latitude,longitude'),
    );

    if (headerIndex === -1) {
      throw new BadRequestException(
        'Invalid telemetry CSV file: telemetry header not found',
      );
    }

    const telemetryCsv = lines.slice(headerIndex).join('\n');

    const parsed = Papa.parse<Record<string, string>>(telemetryCsv, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
    });

    if (parsed.errors.length > 0) {
      throw new BadRequestException(
        `Invalid telemetry CSV file: ${parsed.errors[0].message}`,
      );
    }

    return parsed.data.map((row) => ({
      record: Number(row['Record']),
      time: row['Time'],
      latitude: Number(row['Latitude']),
      longitude: Number(row['Longitude']),
      altitudeM: Number(row['Altitude (m)']),
      speedMS: Number(row['Speed (m/s)']),
      gForceX: Number(row['GForceX (g)']),
      gForceY: Number(row['GForceY (g)']),
      gForceZ: Number(row['GForceZ (g)']),
      lap: Number(row['Lap']),
      heading: Number(row['Heading']),
    })) as Prisma.InputJsonValue;
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

  async create(
    userId: string,
    dto: CreateLabTimeDto,
    telemetryFile?: Express.Multer.File,
  ) {
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
        trackLayout: selectedLayout?.trackLayout ?? dto.trackLayout ?? '',
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
        telemetryMedia: this.parseTelemetryCsvFile(telemetryFile),
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

  async myLabTimes(userId: string, query: LabTimeQueryDto) {
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
      ...(query.trackLayout
        ? {
            trackLayout: {
              contains: query.trackLayout,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.vehicleType
        ? {
            vehicleType: query.vehicleType,
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
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.labTime.findMany({
        where,
        orderBy: [{ dateSet: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          trackName: true,
          trackLayout: true,
          lapTimeMs: true,
          dateSet: true,
          vehicleName: true,
          profile: {
            select: {
              profileName: true,
              imageUrl: true,
            },
          },
        },
      }),
      this.prisma.labTime.count({ where }),
    ]);

    const formattedItems = items.map((item) => ({
      id: item.id,
      profileName: item.profile?.profileName ?? null,
      profileImageUrl: item.profile?.imageUrl ?? null,
      trackName: item.trackName,
      trackLayout: item.trackLayout ?? null,
      vehicleModel: item.vehicleName ?? null,
      lapTimeMs: item.lapTimeMs,
      dateSet: item.dateSet,
    }));

    return {
      page,
      limit,
      total,
      items: formattedItems,
    };
  }

  async compare(userId: string, query: CompareLabTimeDto) {
    const profile = await this.getActiveProfileOrThrow(userId);

    const [rankingLap, myLap] = await Promise.all([
      this.prisma.labTime.findFirst({
        where: { id: query.rankingLabTimeId },
        include: {
          profile: {
            select: {
              id: true,
              profileName: true,
              imageUrl: true,
              activeType: true,
            },
          },
          garage: {
            select: {
              id: true,
              garageName: true,
              location: true,
              description: true,
            },
          },
        },
      }),
      this.prisma.labTime.findFirst({
        where: {
          id: query.myLabTimeId,
          profileId: profile.id,
        },
        include: {
          profile: {
            select: {
              id: true,
              profileName: true,
              imageUrl: true,
              activeType: true,
            },
          },
          garage: {
            select: {
              id: true,
              garageName: true,
              location: true,
              description: true,
            },
          },
        },
      }),
    ]);

    if (!rankingLap) {
      throw new NotFoundException('Ranking lap time not found');
    }

    if (!myLap) {
      throw new NotFoundException('My lap time not found');
    }

    if (
      rankingLap.trackName.trim().toLowerCase() !==
      myLap.trackName.trim().toLowerCase()
    ) {
      throw new BadRequestException(
        'Comparison requires both lap times to be on the same track',
      );
    }

    const [rankingLapVehicle, myLapVehicle] = await Promise.all([
      this.getVehicleDetails(
        rankingLap.profileId,
        rankingLap.vehicleType as LabVehicleType,
        rankingLap.vehicleId,
      ),
      this.getVehicleDetails(
        myLap.profileId,
        myLap.vehicleType as LabVehicleType,
        myLap.vehicleId,
      ),
    ]);

    const sameLayout =
      (rankingLap.trackLayout ?? '').trim().toLowerCase() ===
      (myLap.trackLayout ?? '').trim().toLowerCase();

    const timeDifferenceMs = Math.abs(rankingLap.lapTimeMs - myLap.lapTimeMs);
    const fasterLapId =
      rankingLap.lapTimeMs < myLap.lapTimeMs
        ? rankingLap.id
        : myLap.lapTimeMs < rankingLap.lapTimeMs
          ? myLap.id
          : null;

    const fasterSide =
      rankingLap.lapTimeMs < myLap.lapTimeMs
        ? 'ranking'
        : myLap.lapTimeMs < rankingLap.lapTimeMs
          ? 'mine'
          : 'tie';

    const [rankingPosition, myPosition] = await Promise.all([
      this.prisma.labTime.count({
        where: {
          trackName: rankingLap.trackName,
          OR: [
            { lapTimeMs: { lt: rankingLap.lapTimeMs } },
            {
              lapTimeMs: rankingLap.lapTimeMs,
              createdAt: { lt: rankingLap.createdAt },
            },
          ],
        },
      }),
      this.prisma.labTime.count({
        where: {
          trackName: myLap.trackName,
          OR: [
            { lapTimeMs: { lt: myLap.lapTimeMs } },
            {
              lapTimeMs: myLap.lapTimeMs,
              createdAt: { lt: myLap.createdAt },
            },
          ],
        },
      }),
    ]);

    const telemetryLimit = query.telemetryLimit ?? 5;

    const rankingTelemetryStats = this.getTelemetryStats(
      rankingLap.telemetryMedia,
    );

    const myTelemetryStats = this.getTelemetryStats(myLap.telemetryMedia);

    return {
      comparison: {
          sameTrack: true,
    sameLayout,
    trackName: myLap.trackName,
    rankingLapPosition: rankingPosition + 1,
    myLapPosition: myPosition + 1,
    fasterSide,
    fasterLapId,
    timeDifferenceMs,
    telemetry: {
      ranking: rankingTelemetryStats,
      mine: myTelemetryStats,
      difference: {
        maxSpeedMS:
          rankingTelemetryStats.maxSpeedMS !== null &&
          myTelemetryStats.maxSpeedMS !== null
            ? myTelemetryStats.maxSpeedMS - rankingTelemetryStats.maxSpeedMS
            : null,
        avgSpeedMS:
          rankingTelemetryStats.avgSpeedMS !== null &&
          myTelemetryStats.avgSpeedMS !== null
            ? myTelemetryStats.avgSpeedMS - rankingTelemetryStats.avgSpeedMS
            : null,
      },
    },
  },
      rankingLap: {
        ...rankingLap,
        vehicle: rankingLapVehicle,
      },
      myLap: {
        ...myLap,
        vehicle: myLapVehicle,
      },
    };
  }

  async followingLabTimes(userId: string, query: LabTimeQueryDto) {
    await this.getActiveProfileOrThrow(userId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const followedUsers = await this.prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    const followedUserIds = followedUsers.map((item) => item.followingId);

    if (followedUserIds.length === 0) {
      return {
        page,
        limit,
        total: 0,
        isLeaderboard: !!query.trackName,
        items: [],
      };
    }

    const where: Prisma.LabTimeWhereInput = {
      profile: {
        userId: {
          in: followedUserIds,
        },
      },
      ...(query.trackName
        ? {
            trackName: {
              contains: query.trackName,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.trackLayout
        ? {
            trackLayout: {
              contains: query.trackLayout,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.vehicleType
        ? {
            vehicleType: query.vehicleType,
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
    };

    const isLeaderboard = !!query.trackName;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.labTime.findMany({
        where,
        orderBy: isLeaderboard
          ? [{ lapTimeMs: 'asc' }, { dateSet: 'asc' }, { createdAt: 'asc' }]
          : [{ dateSet: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          trackName: true,
          trackLayout: true,
          lapTimeMs: true,
          dateSet: true,
          vehicleName: true,
          vehicleType: true,
          profile: {
            select: {
              profileName: true,
              imageUrl: true,
              userId: true,
            },
          },
        },
      }),
      this.prisma.labTime.count({ where }),
    ]);

    const formattedItems = items.map((item, index) => ({
      id: item.id,
      ...(isLeaderboard ? { rank: skip + index + 1 } : {}),
      profileName: item.profile?.profileName ?? null,
      profileImageUrl: item.profile?.imageUrl ?? null,
      trackName: item.trackName,
      trackLayout: item.trackLayout ?? null,
      vehicleModel: item.vehicleName ?? null,
      lapTimeMs: item.lapTimeMs,
      dateSet: item.dateSet,
    }));

    return {
      page,
      limit,
      total,
      isLeaderboard,
      items: formattedItems,
    };
  }

  async list(userId: string, query: LabTimeQueryDto) {
    await this.getActiveProfileOrThrow(userId);

    const telemetryLimit = query.telemetryLimit ?? 10;
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where: Prisma.LabTimeWhereInput = {
      ...(query.trackName
        ? {
            trackName: {
              contains: query.trackName,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.trackLayout
        ? {
            trackLayout: {
              contains: query.trackLayout,
              mode: 'insensitive',
            },
          }
        : {}),
      ...(query.vehicleType
        ? {
            vehicleType: query.vehicleType,
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
    };

    const isLeaderboard = !!query.trackName || !!query.trackLayout;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.labTime.findMany({
        where,
        orderBy: isLeaderboard
          ? [{ lapTimeMs: 'asc' }, { dateSet: 'asc' }, { createdAt: 'asc' }]
          : [{ dateSet: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
        select: {
          id: true,
          trackName: true,
          trackLayout: true,
          lapTimeMs: true,
          dateSet: true,
          vehicleName: true,
          vehicleType: true,
          telemetryMedia: true,
          profile: {
            select: {
              profileName: true,
              imageUrl: true,
            },
          },
        },
      }),
      this.prisma.labTime.count({ where }),
    ]);

    const formattedItems = items.map((item, index) => ({
      id: item.id,
      ...(isLeaderboard ? { rank: skip + index + 1 } : {}),
      profileName: item.profile?.profileName ?? null,
      profileImageUrl: item.profile?.imageUrl ?? null,
      trackName: item.trackName,
      trackLayout: item.trackLayout ?? null,
      vehicleModel: item.vehicleName ?? null,
      lapTimeMs: item.lapTimeMs,
      dateSet: item.dateSet,
      telemetryMedia: Array.isArray(item.telemetryMedia)
        ? item.telemetryMedia.slice(0, telemetryLimit)
        : [],
    }));

    return {
      page,
      limit,
      total,
      isLeaderboard,
      items: formattedItems,
    };
  }

  async get(labTimeId: string) {
    const lap = await this.prisma.labTime.findUnique({
      where: { id: labTimeId },
      include: {
        garage: {
          select: {
            id: true,
            garageName: true,
            location: true,
            description: true,
          },
        },
        profile:{
          select:{
            profileName:true,
            imageUrl:true
          }
        }
      },
    });

    if (!lap) {
      throw new NotFoundException('Lap time not found');
    }

    return {
      ...lap,
      profileName: lap.profile?.profileName ?? null,   // ✅ ADD
      profileImageUrl: lap.profile?.imageUrl ?? null,
      vehicle: await this.getVehicleDetails(
        lap.profileId,
        lap.vehicleType as LabVehicleType,
        lap.vehicleId,
      ),
    };
  }

  async update(
    userId: string,
    labTimeId: string,
    dto: UpdateLabTimeDto,
    telemetryFile?: Express.Multer.File,
  ) {
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
           trackLayout: selectedLayout?.trackLayout ?? dto.trackLayout ?? '',
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
      ...(telemetryFile
        ? { telemetryMedia: this.parseTelemetryCsvFile(telemetryFile) }
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
        },
      });

      if (!car) {
        throw new BadRequestException('Car not found in selected garage');
      }

      return {
        vehicleName: car.model?.trim() || car.displayName?.trim() || 'Car',
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
        },
      });

      if (!bike) {
        throw new BadRequestException('Bike not found in selected garage');
      }

      return {
        vehicleName: bike.model?.trim() || bike.displayName?.trim() || 'Bike',
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

  private getTelemetryPreview(
    telemetryMedia: Prisma.JsonValue | null,
    limit = 50,
  ) {
    if (!Array.isArray(telemetryMedia)) return [];

    return telemetryMedia.slice(0, limit);
  }

  private getTelemetryStats(telemetryMedia: Prisma.JsonValue | null) {
    if (!Array.isArray(telemetryMedia)) {
      return {
        totalRecords: 0,
        maxSpeedMS: null,
        avgSpeedMS: null,
        maxGForceX: null,
        maxGForceY: null,
        maxGForceZ: null,
      };
    }

    const rows = telemetryMedia as any[];

    const numbers = (key: string) =>
      rows
        .map((row) => Number(row?.[key]))
        .filter((value) => Number.isFinite(value));

    const avg = (values: number[]) =>
      values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;

    const speed = numbers('speedMS');
    const gForceX = numbers('gForceX');
    const gForceY = numbers('gForceY');
    const gForceZ = numbers('gForceZ');

    return {
      totalRecords: rows.length,
      maxSpeedMS: speed.length ? Math.max(...speed) : null,
      avgSpeedMS: avg(speed),
      maxGForceX: gForceX.length ? Math.max(...gForceX) : null,
      maxGForceY: gForceY.length ? Math.max(...gForceY) : null,
      maxGForceZ: gForceZ.length ? Math.max(...gForceZ) : null,
    };
  }
}
