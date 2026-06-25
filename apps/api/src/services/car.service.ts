import type { Prisma, PrismaClient } from '@rentacar/db';
import type { CarSearchInput, QuoteInput } from '../schemas/index.js';
import {
  calculateRentalDays,
  decimalToNumber,
  roundMoney,
} from '../utils/index.js';

const ACTIVE_BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'ACTIVE'] as const;

const carInclude = {
  category: { select: { id: true, name: true, slug: true } },
  location: { select: { id: true, name: true, slug: true, city: true } },
  images: { orderBy: { sortOrder: 'asc' as const } },
  features: { orderBy: { category: 'asc' as const } },
} satisfies Prisma.CarInclude;

function serializeCar(car: Prisma.CarGetPayload<{ include: typeof carInclude }>) {
  return {
    id: car.id,
    slug: car.slug,
    make: car.make,
    model: car.model,
    year: car.year,
    category: car.category,
    location: car.location,
    dailyRate: decimalToNumber(car.dailyRate),
    currency: car.currency,
    transmission: car.transmission,
    fuelType: car.fuelType,
    seats: car.seats,
    doors: car.doors,
    luggage: car.luggage,
    horsepower: car.horsepower,
    mileageLimit: car.mileageLimit,
    color: car.color,
    status: car.status,
    isPopular: car.isPopular,
    description: car.description,
    images: car.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    features: car.features.map((f) => ({
      id: f.id,
      name: f.name,
      category: f.category,
    })),
  };
}

export class CarService {
  constructor(
    private prisma: PrismaClient,
    private taxRate: number,
  ) {}

  private buildWhere(params: CarSearchInput): Prisma.CarWhereInput {
    const where: Prisma.CarWhereInput = {
      status: 'AVAILABLE',
    };

    if (params.locationId) where.locationId = params.locationId;
    if (params.locationSlug) {
      where.location = { slug: params.locationSlug };
    }
    if (params.categoryId) where.categoryId = params.categoryId;
    if (params.categorySlug) {
      where.category = { slug: params.categorySlug };
    }
    if (params.transmission) where.transmission = params.transmission;
    if (params.fuelType) where.fuelType = params.fuelType;
    if (params.minSeats) where.seats = { gte: params.minSeats };
    if (params.isPopular !== undefined) where.isPopular = params.isPopular;

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      where.dailyRate = {};
      if (params.minPrice !== undefined) where.dailyRate.gte = params.minPrice;
      if (params.maxPrice !== undefined) where.dailyRate.lte = params.maxPrice;
    }

    if (params.search) {
      where.OR = [
        { make: { contains: params.search, mode: 'insensitive' } },
        { model: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.ids) {
      const idList = params.ids.split(',').map((id) => id.trim()).filter(Boolean);
      if (idList.length > 0) where.id = { in: idList };
    }

    if (params.pickupDate && params.returnDate) {
      where.NOT = {
        bookings: {
          some: {
            status: { in: [...ACTIVE_BOOKING_STATUSES] },
            pickupDate: { lt: params.returnDate },
            returnDate: { gt: params.pickupDate },
          },
        },
      };
    }

    return where;
  }

  private buildOrderBy(sort: CarSearchInput['sort']): Prisma.CarOrderByWithRelationInput[] {
    switch (sort) {
      case 'price_asc':
        return [{ dailyRate: 'asc' }];
      case 'price_desc':
        return [{ dailyRate: 'desc' }];
      case 'year_desc':
        return [{ year: 'desc' }];
      case 'popularity':
      default:
        return [{ isPopular: 'desc' }, { dailyRate: 'asc' }];
    }
  }

  async search(params: CarSearchInput) {
    const where = this.buildWhere(params);
    const skip = (params.page - 1) * params.limit;

    const [cars, total] = await Promise.all([
      this.prisma.car.findMany({
        where,
        include: carInclude,
        orderBy: this.buildOrderBy(params.sort),
        skip,
        take: params.limit,
      }),
      this.prisma.car.count({ where }),
    ]);

    return {
      data: cars.map(serializeCar),
      meta: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getPopular(limit = 8) {
    const cars = await this.prisma.car.findMany({
      where: { status: 'AVAILABLE', isPopular: true },
      include: carInclude,
      orderBy: [{ dailyRate: 'asc' }],
      take: limit,
    });

    return cars.map(serializeCar);
  }

  async findById(id: string) {
    const car = await this.prisma.car.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: carInclude,
    });

    if (!car) {
      throw Object.assign(new Error('Car not found'), { statusCode: 404 });
    }

    return serializeCar(car);
  }

  async checkAvailability(carId: string, pickupDate: Date, returnDate: Date) {
    const car = await this.prisma.car.findUnique({ where: { id: carId } });
    if (!car) {
      throw Object.assign(new Error('Car not found'), { statusCode: 404 });
    }

    if (car.status !== 'AVAILABLE') {
      return { available: false, reason: 'Car is not available for rental' };
    }

    const conflict = await this.prisma.booking.findFirst({
      where: {
        carId,
        status: { in: [...ACTIVE_BOOKING_STATUSES] },
        pickupDate: { lt: returnDate },
        returnDate: { gt: pickupDate },
      },
    });

    if (conflict) {
      return { available: false, reason: 'Car is already booked for selected dates' };
    }

    return { available: true };
  }

  async calculateQuote(carId: string, input: QuoteInput) {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { category: true, location: true },
    });

    if (!car) {
      throw Object.assign(new Error('Car not found'), { statusCode: 404 });
    }

    const availability = await this.checkAvailability(carId, input.pickupDate, input.returnDate);
    if (!availability.available) {
      throw Object.assign(new Error(availability.reason ?? 'Car not available'), { statusCode: 409 });
    }

    const rentalDays = calculateRentalDays(input.pickupDate, input.returnDate);
    const dailyRate = decimalToNumber(car.dailyRate);
    const subtotal = roundMoney(dailyRate * rentalDays);

    let addOnsTotal = 0;
    const addOnBreakdown: Array<{
      id: string;
      name: string;
      pricingType: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    if (input.addOnIds.length > 0) {
      const addOns = await this.prisma.addOn.findMany({
        where: { id: { in: input.addOnIds }, isActive: true },
      });

      for (const addOn of addOns) {
        const unitPrice = decimalToNumber(addOn.price);
        const totalPrice =
          addOn.pricingType === 'PER_DAY'
            ? roundMoney(unitPrice * rentalDays)
            : unitPrice;

        addOnsTotal += totalPrice;
        addOnBreakdown.push({
          id: addOn.id,
          name: addOn.name,
          pricingType: addOn.pricingType,
          unitPrice,
          quantity: 1,
          totalPrice,
        });
      }
    }

    addOnsTotal = roundMoney(addOnsTotal);
    const taxAmount = roundMoney((subtotal + addOnsTotal) * this.taxRate);
    const totalAmount = roundMoney(subtotal + addOnsTotal + taxAmount);

    return {
      car: {
        id: car.id,
        slug: car.slug,
        make: car.make,
        model: car.model,
        dailyRate,
        currency: car.currency,
      },
      pickupDate: input.pickupDate,
      returnDate: input.returnDate,
      rentalDays,
      subtotal,
      addOns: addOnBreakdown,
      addOnsTotal,
      taxRate: this.taxRate,
      taxAmount,
      totalAmount,
      currency: car.currency,
    };
  }
}
