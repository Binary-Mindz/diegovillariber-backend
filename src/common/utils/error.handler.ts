import { BadRequestException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';


export function handlePrismaError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        throw new BadRequestException('Duplicate value violates unique constraint');

      case 'P2003':
        throw new BadRequestException('Related record not found for foreign key');

      case 'P2025':
        throw new BadRequestException('Requested record was not found');

      default:
        throw error;
    }
  }

  throw error;
}