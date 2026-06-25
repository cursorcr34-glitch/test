import { Prisma, PrismaClient } from '@prisma/client';
import type { CreatePropertyInput, PropertySearchInput, UpdatePropertyInput } from '../schemas/index.js';
import { localizeProperty } from '../types/index.js';

export class PropertyService {
  constructor(private prisma: PrismaClient) {}

  async search(params: PropertySearchInput) {
    const where: Prisma.PropertyWhereInput = {
      status: params.status ?? 'ACTIVE',
    };

    if (params.listingType) where.listingType = params.listingType;
    if (params.propertyType) where.propertyType = params.propertyType;
    if (params.district) where.district = params.district;
    if (params.minRooms !== undefined || params.maxRooms !== undefined) {
      where.rooms = {};
      if (params.minRooms !== undefined) where.rooms.gte = params.minRooms;
      if (params.maxRooms !== undefined) where.rooms.lte = params.maxRooms;
    }
    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.price = {};
      if (params.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    const skip = (params.page - 1) * params.limit;

    const [items, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { [params.sortBy]: params.sortOrder },
        include: {
          owner: { select: { id: true, name: true } },
          agent: {
            select: {
              id: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      items: items.map((p) => localizeProperty(p, params.locale)),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async findById(id: string, locale: 'AZ' | 'EN' | 'RU' = 'AZ') {
    const property = await this.prisma.property.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
        agent: {
          select: {
            id: true,
            licenseNumber: true,
            avatarUrl: true,
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
      },
    });

    if (!property) {
      throw Object.assign(new Error('Property not found'), { statusCode: 404 });
    }

    return localizeProperty(property, locale);
  }

  async create(ownerId: string, input: CreatePropertyInput) {
    return this.prisma.property.create({
      data: {
        ...input,
        ownerId,
        price: input.price,
      },
      include: {
        owner: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, userId: string, userRole: string, input: UpdatePropertyInput) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw Object.assign(new Error('Property not found'), { statusCode: 404 });
    }

    if (property.ownerId !== userId && userRole !== 'ADMIN' && userRole !== 'AGENT') {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    }

    return this.prisma.property.update({
      where: { id },
      data: input,
      include: {
        owner: { select: { id: true, name: true } },
      },
    });
  }

  async delete(id: string, userId: string, userRole: string) {
    const property = await this.prisma.property.findUnique({ where: { id } });
    if (!property) {
      throw Object.assign(new Error('Property not found'), { statusCode: 404 });
    }

    if (property.ownerId !== userId && userRole !== 'ADMIN') {
      throw Object.assign(new Error('Forbidden'), { statusCode: 403 });
    }

    await this.prisma.property.delete({ where: { id } });
    return { success: true };
  }
}
