import { PrismaService } from '@/common/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateOfficialPartnerDto } from './dto/create-official-pertner.dto';
import { UpdateOfficialPartnerDto } from './dto/update-official-pertner.dto';
import { UpdateOfficialPartnerStatusDto } from './dto/update-request-status.dto';
import { OfficialPartnerRequestStatus, Role } from 'generated/prisma/enums';
import { OfficialPartnerQueryDto, OfficialPartnerTab } from './dto/official-partner.query.dto';
import { Prisma } from 'generated/prisma/client';
import { QueryMode } from 'generated/prisma/internal/prismaNamespace';


@Injectable()
export class OfficialPartnerService {
  constructor(private readonly prisma: PrismaService) { }

    async createRequest(userId: string, dto: CreateOfficialPartnerDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) throw new BadRequestException('User not found');

    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Admin cannot create official partner request.');
    }

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
      include: { user: true },
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
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.OfficialPartnerWhereInput = {};

    if (query.tab === OfficialPartnerTab.APPROVED_PARTNERS) {
      where.requestStatus = OfficialPartnerRequestStatus.APPROVED;
    } else if (query.tab === OfficialPartnerTab.APPLICATIONS) {
      if (query.status) where.requestStatus = query.status;
    } else if (query.tab === OfficialPartnerTab.CAMPAIGNS) {
    }

    if (query.search?.trim()) {
      const s = query.search.trim();
      where.OR = [
        { brandName: { contains: s, mode: QueryMode.insensitive } },
        { contactName: { contains: s, mode: QueryMode.insensitive } },
        { contactEmail: { contains: s, mode: QueryMode.insensitive } },
      ];
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.officialPartner.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, role: true } },
        },
      }),
      this.prisma.officialPartner.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getById(id: string) {
    const request = await this.prisma.officialPartner.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    });

    if (!request) throw new NotFoundException('Official partner request not found.');
    return request;
  }

  async updateStatus(id: string, dto: UpdateOfficialPartnerStatusDto) {
    const request = await this.prisma.officialPartner.findUnique({ where: { id } });
    if (!request) throw new NotFoundException('Official partner request not found.');

    // ✅ Transaction: update request + update user role
    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.officialPartner.update({
        where: { id },
        data: { requestStatus: dto.requestStatus },
      });

      if (dto.requestStatus === OfficialPartnerRequestStatus.APPROVED) {
        await tx.user.update({
          where: { id: request.userId },
          data: { role: Role.OFFICIAL_PARTNER },
        });
      }

      if (dto.requestStatus === OfficialPartnerRequestStatus.REJECTED) {
        await tx.user.update({
          where: { id: request.userId },
          data: { role: Role.USER },
        });
      }

      // if PENDING -> keep USER role as-is (optional)
      return updated;
    });

    return result;
  }

}
