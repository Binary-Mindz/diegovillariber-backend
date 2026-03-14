import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';

@Injectable()
export class AdminHeaderService {
  constructor(private readonly prisma: PrismaService) {}

  async createHeader(dto: CreateHeaderDto) {
    const existingHeader = await this.prisma.header.findUnique({
      where: {
        headerName: dto.headerName,
      },
    });

    if (existingHeader) {
      throw new ConflictException('Header name already exists');
    }

    const header = await this.prisma.header.create({
      data: {
        selectHeader: dto.selectHeader,
        headerName: dto.headerName,
        brandName: dto.brandName,
        bannerImage: dto.bannerImage,
      },
    });

    return header;
  }

  async getAllHeaders() {
    const headers = await this.prisma.header.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return headers;
  }

  async getHeaderById(id: string) {
    const header = await this.prisma.header.findUnique({
      where: { id },
    });

    if (!header) {
      throw new NotFoundException('Header not found');
    }

    return header;
  }

  async updateHeader(id: string, dto: UpdateHeaderDto) {
    const existingHeader = await this.prisma.header.findUnique({
      where: { id },
    });

    if (!existingHeader) {
      throw new NotFoundException('Header not found');
    }

    if (dto.headerName && dto.headerName !== existingHeader.headerName) {
      const duplicateHeader = await this.prisma.header.findUnique({
        where: {
          headerName: dto.headerName,
        },
      });

      if (duplicateHeader) {
        throw new ConflictException('Header name already exists');
      }
    }

    const updatedHeader = await this.prisma.header.update({
      where: { id },
      data: {
        ...(dto.selectHeader !== undefined && {
          selectHeader: dto.selectHeader,
        }),
        ...(dto.headerName !== undefined && {
          headerName: dto.headerName,
        }),
        ...(dto.brandName !== undefined && {
          brandName: dto.brandName,
        }),
        ...(dto.bannerImage !== undefined && {
          bannerImage: dto.bannerImage,
        }),
      },
    });

    return updatedHeader;
  }

  async deleteHeader(id: string) {
    const existingHeader = await this.prisma.header.findUnique({
      where: { id },
    });

    if (!existingHeader) {
      throw new NotFoundException('Header not found');
    }

    await this.prisma.header.delete({
      where: { id },
    });

    return {
      id,
      deleted: true,
    };
  }
}