import { PrismaService } from "@/common/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AdminUserManagementService {
  constructor(private readonly prisma: PrismaService) { }

   async getAllUsersWithStats() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,

        profile: {
          select: {
            imageUrl: true,
            cars: {
              select: { id: true },
            },
          },
        },

        _count: {
          select: {
            posts: true,
            productLists: true, 
          },
        },
      },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      image: user.profile?.[0]?.imageUrl ?? null,

      totalPost: user._count.posts,
      totalCar: user.profile?.[0]?.cars.length ?? 0,
      totalCreatedAd: user._count.productLists,
    }));
  }

}