import { PrismaClient } from '@prisma/client';
import { DISTRICTS } from '../types/index.js';

export class AnalyticsService {
  constructor(private prisma: PrismaClient) {}

  async getDashboardStats() {
    const [
      totalProperties,
      activeListings,
      soldProperties,
      rentedProperties,
      totalInquiries,
      newInquiries,
      closedInquiries,
      totalAgents,
      totalUsers,
    ] = await Promise.all([
      this.prisma.property.count(),
      this.prisma.property.count({ where: { status: 'ACTIVE' } }),
      this.prisma.property.count({ where: { status: 'SOLD' } }),
      this.prisma.property.count({ where: { status: 'RENTED' } }),
      this.prisma.inquiry.count(),
      this.prisma.inquiry.count({ where: { status: 'NEW' } }),
      this.prisma.inquiry.count({ where: { status: 'CLOSED' } }),
      this.prisma.agent.count({ where: { isActive: true } }),
      this.prisma.user.count(),
    ]);

    const conversionRate = totalInquiries > 0
      ? Math.round((closedInquiries / totalInquiries) * 10000) / 100
      : 0;

    const saleStats = await this.prisma.property.groupBy({
      by: ['listingType'],
      _count: { id: true },
      _avg: { price: true },
    });

    const inquiriesByStatus = await this.prisma.inquiry.groupBy({
      by: ['status'],
      _count: { id: true },
    });

    return {
      overview: {
        totalProperties,
        activeListings,
        soldProperties,
        rentedProperties,
        totalInquiries,
        newInquiries,
        closedInquiries,
        totalAgents,
        totalUsers,
        conversionRate,
      },
      salesStats: saleStats.map((s) => ({
        listingType: s.listingType,
        count: s._count.id,
        averagePrice: s._avg.price ? Number(s._avg.price) : 0,
      })),
      leadConversion: inquiriesByStatus.map((s) => ({
        status: s.status,
        count: s._count.id,
      })),
    };
  }

  async getDistrictHeatmap() {
    const [propertyCounts, inquiryCounts] = await Promise.all([
      this.prisma.property.groupBy({
        by: ['district'],
        where: { status: 'ACTIVE' },
        _count: { id: true },
        _avg: { price: true },
      }),
      this.prisma.inquiry.groupBy({
        by: ['propertyId'],
        _count: { id: true },
      }),
    ]);

    const propertyInquiryMap = new Map<string, number>();
    if (inquiryCounts.length > 0) {
      const properties = await this.prisma.property.findMany({
        where: { id: { in: inquiryCounts.map((i) => i.propertyId) } },
        select: { id: true, district: true },
      });

      for (const inquiry of inquiryCounts) {
        const property = properties.find((p) => p.id === inquiry.propertyId);
        if (property) {
          const current = propertyInquiryMap.get(property.district) ?? 0;
          propertyInquiryMap.set(property.district, current + inquiry._count.id);
        }
      }
    }

    return DISTRICTS.map((district) => {
      const propData = propertyCounts.find((p) => p.district === district.id);
      return {
        district: district.id,
        nameAz: district.nameAz,
        nameEn: district.nameEn,
        nameRu: district.nameRu,
        city: district.city,
        activeListings: propData?._count.id ?? 0,
        averagePrice: propData?._avg.price ? Number(propData._avg.price) : 0,
        inquiryCount: propertyInquiryMap.get(district.id) ?? 0,
      };
    });
  }
}
