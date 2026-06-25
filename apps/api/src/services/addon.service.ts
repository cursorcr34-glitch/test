import type { PrismaClient } from '@rentacar/db';
import { decimalToNumber } from '../utils/index.js';

export class AddOnService {
  constructor(private prisma: PrismaClient) {}

  async list() {
    const addOns = await this.prisma.addOn.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });

    return addOns.map((addOn) => ({
      id: addOn.id,
      name: addOn.name,
      slug: addOn.slug,
      description: addOn.description,
      pricingType: addOn.pricingType,
      price: decimalToNumber(addOn.price),
      currency: addOn.currency,
    }));
  }
}
