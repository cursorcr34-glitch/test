import type { PrismaClient } from '@rentacar/db';
import { decimalToNumber } from '../utils/index.js';

export class LocationService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const locations = await this.prisma.location.findMany({
      where: { isActive: true },
      orderBy: [{ city: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { cars: { where: { status: 'AVAILABLE' } } } },
      },
    });

    return locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      city: loc.city,
      address: loc.address,
      latitude: loc.latitude,
      longitude: loc.longitude,
      availableCars: loc._count.cars,
    }));
  }

  async findBySlug(slug: string) {
    const location = await this.prisma.location.findUnique({
      where: { slug },
      include: {
        _count: { select: { cars: { where: { status: 'AVAILABLE' } } } },
      },
    });

    if (!location || !location.isActive) {
      throw Object.assign(new Error('Location not found'), { statusCode: 404 });
    }

    const avgRate = await this.prisma.car.aggregate({
      where: { locationId: location.id, status: 'AVAILABLE' },
      _avg: { dailyRate: true },
    });

    return {
      id: location.id,
      name: location.name,
      slug: location.slug,
      city: location.city,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      availableCars: location._count.cars,
      averageDailyRate: decimalToNumber(avgRate._avg.dailyRate),
    };
  }
}
