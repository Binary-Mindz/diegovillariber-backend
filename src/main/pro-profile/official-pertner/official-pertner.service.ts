import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOfficialPartnerDto } from './dto/create-official-pertner.dto';
import { UpdateOfficialPartnerDto } from './dto/update-official-pertner.dto';
import { OfficialPartnerQueryDto, OfficialPartnerRequestStatusDto } from './dto/official-pertner.dto';
import { UpdateOfficialPartnerStatusDto } from './dto/update-request-status.dto';
import { OfficialPartnerRequestStatus } from 'generated/prisma/enums';


@Injectable()
export class OfficialPartnerService {
  constructor(private readonly prisma: PrismaService) { }

  async createRequest(userId: string, dto: CreateOfficialPartnerDto) {
    // user can have only one request because userId is unique
    const existing = await this.prisma.officialPartner.findUnique({
      where: { userId },
    });

    if (existing) {
      throw new BadRequestException('You already have an official partner request.');
    }

    return this.prisma.officialPartner.create({
      data: {
        userId,
        requestStatus: 'PENDING',
        brandLogo: dto.brandLogo ?? null,
        brandName: dto.brandName,
        contactName: dto.contactName,
        contactEmail: dto.contactEmail,
        brandDescription: dto.brandDescription ?? null,
        websiteUrl: dto.websiteUrl ?? null,
        industry: dto.industry ?? null,
        country: dto.country ?? null,
        companyRegistrationNumber: dto.companyRegistrationNumber ?? null,
      },
      include: {
        user: true, // optional
      },
    });
  }

  async getMyRequest(userId: string) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { userId },
      include: { user: true }, // optional
    });

    if (!request) throw new NotFoundException('Official partner request not found.');
    return request;
  }

  async updateMyRequest(userId: string, dto: UpdateOfficialPartnerDto) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { userId },
    });

    if (!request) throw new NotFoundException('Official partner request not found.');

    // usually users can edit only while pending
    if (request.requestStatus !== 'PENDING') {
      throw new ForbiddenException('You can update only while status is PENDING.');
    }

    return this.prisma.officialPartner.update({
      where: { userId },
      data: {
        brandLogo: dto.brandLogo ?? undefined,
        brandName: dto.brandName ?? undefined,
        contactName: dto.contactName ?? undefined,
        contactEmail: dto.contactEmail ?? undefined,
        brandDescription: dto.brandDescription ?? undefined,
        websiteUrl: dto.websiteUrl ?? undefined,
        industry: dto.industry ?? undefined,
        country: dto.country ?? undefined,
        companyRegistrationNumber: dto.companyRegistrationNumber ?? undefined,
      },
    });
  }

  async deleteMyRequest(userId: string) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { userId },
    });

    if (!request) throw new NotFoundException('Official partner request not found.');

    // if you want: prevent delete after approved
    // if (request.requestStatus === 'APPROVED') throw new ForbiddenException('Cannot delete an approved partner.');

    await this.prisma.officialPartner.delete({ where: { userId } });
    return { deleted: true };
  }

  /** -----------------------
   * ADMIN
   * ----------------------*/

  async list(query: OfficialPartnerQueryDto) {
    const page = Math.max(parseInt(query.page ?? '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(query.limit ?? '10', 10), 1), 100);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) where.requestStatus = query.status;

    if (query.search?.trim()) {
      const s = query.search.trim();
      where.OR = [
        { brandName: { contains: s, mode: 'insensitive' } },
        { contactName: { contains: s, mode: 'insensitive' } },
        { contactEmail: { contains: s, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.officialPartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: true }, // optional
      }),
      this.prisma.officialPartner.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async getById(id: string) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { id },
      include: { user: true }, // optional
    });

    if (!request) throw new NotFoundException('Official partner request not found.');
    return request;
  }

  async updateStatus(id: string, dto: UpdateOfficialPartnerStatusDto) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { id },
    });

    if (!request) {
      throw new NotFoundException('Official partner request not found.');
    }

    const updated = await this.prisma.officialPartner.update({
      where: { id },
      data: {
        requestStatus:
          dto.requestStatus as OfficialPartnerRequestStatus,
      },
    });

    if (dto.requestStatus === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: request.userId },
        data: { role: 'OFFICIAL_PARTNER' },
      });
    }

    if (dto.requestStatus === 'REJECTED') {
      await this.prisma.user.update({
        where: { id: request.userId },
        data: { role: 'USER' },
      });
    }

    return updated;
  }

}
