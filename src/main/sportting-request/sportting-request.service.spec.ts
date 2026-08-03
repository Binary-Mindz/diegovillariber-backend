import { getQueueToken } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '@/common/prisma/prisma.service';
import { SpottingRequestService } from './sportting-request.service';
import { SpottingMatcherService } from './spotting-matcher.service';

describe('SpottingRequestService', () => {
  let service: SpottingRequestService;
  let prisma: {
    spottingRequest: {
      findFirst: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      spottingRequest: {
        findFirst: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpottingRequestService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
        {
          provide: SpottingMatcherService,
          useValue: {},
        },
        {
          provide: getQueueToken('spotting-match'),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SpottingRequestService>(SpottingRequestService);
  });

  it('deletes a spotting request owned by the current user', async () => {
    prisma.spottingRequest.findFirst.mockResolvedValue({ id: 'request-1' });
    prisma.spottingRequest.delete.mockResolvedValue({ id: 'request-1' });

    await expect(
      service.deleteSpottingRequest('user-1', 'request-1'),
    ).resolves.toEqual({ id: 'request-1' });

    expect(prisma.spottingRequest.findFirst).toHaveBeenCalledWith({
      where: { id: 'request-1', userId: 'user-1' },
      select: { id: true },
    });
    expect(prisma.spottingRequest.delete).toHaveBeenCalledWith({
      where: { id: 'request-1' },
    });
  });

  it('throws NotFoundException when the request does not belong to the current user', async () => {
    prisma.spottingRequest.findFirst.mockResolvedValue(null);

    await expect(
      service.deleteSpottingRequest('user-1', 'request-1'),
    ).rejects.toThrow(NotFoundException);
    expect(prisma.spottingRequest.delete).not.toHaveBeenCalled();
  });
});
