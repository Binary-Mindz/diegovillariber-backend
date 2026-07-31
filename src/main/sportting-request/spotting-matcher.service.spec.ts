import { Test, TestingModule } from '@nestjs/testing';
import { SpottingMatcherService } from './spotting-matcher.service';
import { PrismaService } from '@/common/prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

describe('SpottingMatcherService', () => {
  let service: SpottingMatcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpottingMatcherService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: NotificationService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SpottingMatcherService>(SpottingMatcherService);
  });

  describe('isSearchMatched', () => {
    const callIsSearchMatched = (request: any, post: any): boolean => {
      return (service as any).isSearchMatched(request, post);
    };

    it('should match when hashtags are separate (e.g. #lamborghini and #aventador)', () => {
      const request = { brand: 'lamborghini', model: 'aventador' };
      const post = {
        caption: 'Nice car',
        hashtags: [{ tag: 'lamborghini' }, { tag: 'aventador' }],
      };

      expect(callIsSearchMatched(request, post)).toBe(true);
    });

    it('should match when hashtag is combined (e.g. #lamborghiniaventador)', () => {
      const request = { brand: 'lamborghini', model: 'aventador' };
      const post = {
        caption: null,
        hashtags: [{ tag: 'lamborghiniaventador' }],
      };

      expect(callIsSearchMatched(request, post)).toBe(true);
    });

    it('should match when brand is in caption and model is in hashtag', () => {
      const request = { brand: 'lamborghini', model: 'aventador' };
      const post = {
        caption: 'Spotted a cool Lamborghini today!',
        hashtags: [{ tag: 'aventador' }],
      };

      expect(callIsSearchMatched(request, post)).toBe(true);
    });

    it('should match multi-word model with separate hashtags', () => {
      const request = { brand: 'BMW', model: 'M3 Competition' };
      const post = {
        caption: null,
        hashtags: [{ tag: 'bmw' }, { tag: 'm3' }, { tag: 'competition' }],
      };

      expect(callIsSearchMatched(request, post)).toBe(true);
    });

    it('should NOT match if one of the required request tokens is missing', () => {
      const request = { brand: 'lamborghini', model: 'aventador' };
      const post = {
        caption: 'Spotted a cool Ferrari!',
        hashtags: [{ tag: 'lamborghini' }],
      };

      expect(callIsSearchMatched(request, post)).toBe(false);
    });
  });
});
