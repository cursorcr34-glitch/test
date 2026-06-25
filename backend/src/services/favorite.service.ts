import { PrismaClient } from '@prisma/client';

export class FavoriteService {
  constructor(private prisma: PrismaClient) {}

  async list(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            include: {
              owner: { select: { id: true, name: true } },
            },
          },
        },
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      items: items.map((f) => f.property),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async add(userId: string, propertyId: string) {
    const property = await this.prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) {
      throw Object.assign(new Error('Property not found'), { statusCode: 404 });
    }

    const existing = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (existing) {
      throw Object.assign(new Error('Property already in favorites'), { statusCode: 409 });
    }

    return this.prisma.favorite.create({
      data: { userId, propertyId },
      include: { property: true },
    });
  }

  async remove(userId: string, propertyId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    if (!favorite) {
      throw Object.assign(new Error('Favorite not found'), { statusCode: 404 });
    }

    await this.prisma.favorite.delete({
      where: { userId_propertyId: { userId, propertyId } },
    });

    return { success: true };
  }

  async check(userId: string, propertyId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_propertyId: { userId, propertyId } },
    });

    return { isFavorite: !!favorite };
  }
}
