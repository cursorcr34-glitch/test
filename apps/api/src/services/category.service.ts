import type { PrismaClient } from '@rentacar/db';

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { cars: { where: { status: 'AVAILABLE' } } } },
      },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      sortOrder: cat.sortOrder,
      availableCars: cat._count.cars,
    }));
  }
}
