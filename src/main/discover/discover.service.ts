import { Injectable } from '@nestjs/common';
import {
  GlobalSearchDto,
  GlobalSearchType,
} from './dto/global-search-query.dto';
import { PrismaService } from '@/common/prisma/prisma.service';
import { GetTrendingHashtagsDto } from './dto/get-trending-hashtag.dto';

@Injectable()
export class DiscoverService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(dto: GlobalSearchDto) {
    const keyword = dto.keyword?.trim() ?? '';
    const normalizedKeyword = keyword.replace(/^#/, '').trim();
    const isHashtagSearch = keyword.startsWith('#');
    const type = dto.type ?? GlobalSearchType.ALL;
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const shouldSearchUsers =
      type === GlobalSearchType.ALL || type === GlobalSearchType.USER;
    const shouldSearchPosts =
      type === GlobalSearchType.ALL || type === GlobalSearchType.POST;
    const shouldSearchEvents =
      type === GlobalSearchType.ALL || type === GlobalSearchType.EVENT;

    const userWhere =
      keyword.length > 0
        ? {
            OR: [
              {
                email: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                phone: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                profile: {
                  some: {
                    profileName: {
                      contains: keyword,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }
        : {};

    const postWhere =
      keyword.length > 0
        ? {
            OR: [
              // normal search
              {
                caption: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                locationName: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                locationAddress: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                postLocation: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },

              // 🔥 hashtag search (always active if keyword আছে)
              ...(normalizedKeyword
                ? [
                    {
                      hashtags: {
                        some: {
                          tag: {
                            contains: normalizedKeyword,
                            mode: 'insensitive' as const,
                          },
                        },
                      },
                    },
                  ]
                : []),
            ],
          }
        : {};
    const eventWhere =
      keyword.length > 0
        ? {
            OR: [
              {
                eventTitle: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                description: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                location: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
              {
                locationAddress: {
                  contains: keyword,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {};

    const [users, usersCount, posts, postsCount, events, eventsCount] =
      await Promise.all([
        shouldSearchUsers
          ? this.prisma.user.findMany({
              where: userWhere,
              orderBy: {
                createdAt: 'desc',
              },
              skip,
              take: limit,
              select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                accountStatus: true,
                totalPoints: true,
                likeCount: true,
                commentCount: true,
                shareCount: true,
                createdAt: true,
                profile: {
                  select: {
                    id: true,
                    profileName: true,
                    imageUrl: true,
                  },
                },
              },
            })
          : Promise.resolve([]),

        shouldSearchUsers
          ? this.prisma.user.count({
              where: userWhere,
            })
          : Promise.resolve(0),

        shouldSearchPosts
          ? this.prisma.post.findMany({
              where: postWhere,
              orderBy: {
                createdAt: 'desc',
              },
              skip,
              take: limit,
              select: {
                id: true,
                caption: true,
                mediaUrl: true,
                mediaType: true,
                postType: true,
                vehicleCategory: true,
                locationName: true,
                locationAddress: true,
                postLocation: true,
                like: true,
                comment: true,
                share: true,
                createdAt: true,
                hashtags: {
                  select: {
                    id: true,
                    tag: true,
                  },
                },
                user: {
                  select: {
                    id: true,
                    email: true,
                    profile: {
                      select: {
                        id: true,
                        profileName: true,
                        imageUrl: true,
                      },
                    },
                  },
                },
                profile: {
                  select: {
                    id: true,
                    profileName: true,
                    imageUrl: true,
                  },
                },
                car: {
                  select: {
                    id: true,
                  },
                },
              },
            })
          : Promise.resolve([]),

        shouldSearchPosts
          ? this.prisma.post.count({
              where: postWhere,
            })
          : Promise.resolve(0),

        shouldSearchEvents
          ? this.prisma.event.findMany({
              where: eventWhere,
              orderBy: [{ startDate: 'asc' }, { createdAt: 'desc' }],
              skip,
              take: limit,
              select: {
                id: true,
                coverImage: true,
                eventTitle: true,
                description: true,
                location: true,
                locationAddress: true,
                websiteLink: true,
                price: true,
                eventType: true,
                eventStatus: true,
                startDate: true,
                endDate: true,
                createdAt: true,
                owner: {
                  select: {
                    id: true,
                    email: true,
                    profile: {
                      select: {
                        id: true,
                        profileName: true,
                        imageUrl: true,
                      },
                    },
                  },
                },
              },
            })
          : Promise.resolve([]),

        shouldSearchEvents
          ? this.prisma.event.count({
              where: eventWhere,
            })
          : Promise.resolve(0),
      ]);

    return {
      keyword,
      type,
      pagination: {
        page,
        limit,
      },
      users: {
        total: usersCount,
        items: users,
      },
      posts: {
        total: postsCount,
        items: posts,
      },
      events: {
        total: eventsCount,
        items: events,
      },
    };
  }

  async getTrendingHashtags(dto: GetTrendingHashtagsDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      posts: {
        some: {},
      },
    };

    const [hashtags, total] = await Promise.all([
      this.prisma.hashtag.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ usageCount: 'desc' }, { updatedAt: 'desc' }],
        include: {
          _count: {
            select: {
              posts: true,
            },
          },
          posts: {
            where: {
              mediaUrl: {
                isEmpty: false,
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              id: true,
              mediaUrl: true,
              mediaType: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prisma.hashtag.count({ where }),
    ]);

    const items = hashtags.map((hashtag) => ({
      id: hashtag.id,
      tag: hashtag.tag,
      description: hashtag.description,
      usageCount: hashtag.usageCount,
      postsCount: hashtag._count.posts,
      previewMediaUrl: hashtag.posts[0]?.mediaUrl?.[0] ?? null,
      previewMediaType: hashtag.posts[0]?.mediaType ?? null,
      previewPostId: hashtag.posts[0]?.id ?? null,
      createdAt: hashtag.createdAt,
      updatedAt: hashtag.updatedAt,
    }));

    return {
      page,
      limit,
      total,
      items,
    };
  }
}
