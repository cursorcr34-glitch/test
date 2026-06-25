import { PrismaClient } from '@prisma/client';
import type { CreateInquiryInput } from '../schemas/index.js';

export class InquiryService {
  constructor(private prisma: PrismaClient) {}

  async create(input: CreateInquiryInput, userId?: string) {
    const property = await this.prisma.property.findUnique({
      where: { id: input.propertyId },
    });

    if (!property) {
      throw Object.assign(new Error('Property not found'), { statusCode: 404 });
    }

    if (property.status !== 'ACTIVE') {
      throw Object.assign(new Error('Property is not available for inquiries'), { statusCode: 400 });
    }

    return this.prisma.inquiry.create({
      data: {
        propertyId: input.propertyId,
        userId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
      },
      include: {
        property: {
          select: {
            id: true,
            titleAz: true,
            titleEn: true,
            titleRu: true,
            district: true,
            price: true,
          },
        },
      },
    });
  }

  async findAll(page: number, limit: number, status?: string) {
    const where = status ? { status: status as never } : {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              titleAz: true,
              titleEn: true,
              titleRu: true,
              district: true,
              price: true,
            },
          },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.inquiry.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        property: true,
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    if (!inquiry) {
      throw Object.assign(new Error('Inquiry not found'), { statusCode: 404 });
    }

    return inquiry;
  }

  async updateStatus(id: string, status: string) {
    const inquiry = await this.prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) {
      throw Object.assign(new Error('Inquiry not found'), { statusCode: 404 });
    }

    return this.prisma.inquiry.update({
      where: { id },
      data: { status: status as never },
      include: {
        property: {
          select: { id: true, titleAz: true, district: true, price: true },
        },
      },
    });
  }

  async findByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.inquiry.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: {
            select: {
              id: true,
              titleAz: true,
              titleEn: true,
              titleRu: true,
              district: true,
              price: true,
              photos: true,
            },
          },
        },
      }),
      this.prisma.inquiry.count({ where: { userId } }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
