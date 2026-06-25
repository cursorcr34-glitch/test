import type { Prisma, PrismaClient } from '@rentacar/db';
import type { CreateBookingInput, ProcessPaymentInput } from '../schemas/index.js';
import { CarService } from './car.service.js';
import {
  calculateRentalDays,
  decimalToNumber,
  generateBookingNumber,
  roundMoney,
} from '../utils/index.js';

const bookingInclude = {
  car: {
    include: {
      category: { select: { id: true, name: true, slug: true } },
      location: { select: { id: true, name: true, slug: true, city: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
  pickupLocation: { select: { id: true, name: true, slug: true, city: true, address: true } },
  returnLocation: { select: { id: true, name: true, slug: true, city: true, address: true } },
  addOns: {
    include: {
      addOn: { select: { id: true, name: true, slug: true, pricingType: true } },
    },
  },
  payment: true,
} satisfies Prisma.BookingInclude;

type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>;

function serializeBooking(booking: BookingWithRelations) {
  return {
    id: booking.id,
    bookingNumber: booking.bookingNumber,
    status: booking.status,
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
    rentalDays: booking.rentalDays,
    dailyRate: decimalToNumber(booking.dailyRate),
    subtotal: decimalToNumber(booking.subtotal),
    addOnsTotal: decimalToNumber(booking.addOnsTotal),
    taxRate: decimalToNumber(booking.taxRate),
    taxAmount: decimalToNumber(booking.taxAmount),
    totalAmount: decimalToNumber(booking.totalAmount),
    currency: booking.currency,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
    car: {
      id: booking.car.id,
      slug: booking.car.slug,
      make: booking.car.make,
      model: booking.car.model,
      year: booking.car.year,
      category: booking.car.category,
      location: booking.car.location,
      image: booking.car.images[0]?.url ?? null,
    },
    pickupLocation: booking.pickupLocation,
    returnLocation: booking.returnLocation,
    addOns: booking.addOns.map((ba) => ({
      id: ba.id,
      addOn: ba.addOn,
      quantity: ba.quantity,
      unitPrice: decimalToNumber(ba.unitPrice),
      totalPrice: decimalToNumber(ba.totalPrice),
    })),
    payment: booking.payment
      ? {
          id: booking.payment.id,
          amount: decimalToNumber(booking.payment.amount),
          currency: booking.payment.currency,
          status: booking.payment.status,
          method: booking.payment.method,
          transactionId: booking.payment.transactionId,
          paidAt: booking.payment.paidAt,
        }
      : null,
  };
}

export class BookingService {
  private carService: CarService;

  constructor(
    private prisma: PrismaClient,
    taxRate: number,
  ) {
    this.carService = new CarService(prisma, taxRate);
  }

  async create(userId: string, input: CreateBookingInput) {
    const quote = await this.carService.calculateQuote(input.carId, {
      pickupDate: input.pickupDate,
      returnDate: input.returnDate,
      addOnIds: input.addOnIds,
    });

    const [pickupLocation, returnLocation] = await Promise.all([
      this.prisma.location.findUnique({ where: { id: input.pickupLocationId } }),
      this.prisma.location.findUnique({ where: { id: input.returnLocationId } }),
    ]);

    if (!pickupLocation?.isActive) {
      throw Object.assign(new Error('Invalid pickup location'), { statusCode: 400 });
    }
    if (!returnLocation?.isActive) {
      throw Object.assign(new Error('Invalid return location'), { statusCode: 400 });
    }

    const bookingNumber = await generateBookingNumber(this.prisma);
    const rentalDays = calculateRentalDays(input.pickupDate, input.returnDate);

    const booking = await this.prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        carId: input.carId,
        pickupLocationId: input.pickupLocationId,
        returnLocationId: input.returnLocationId,
        pickupDate: input.pickupDate,
        returnDate: input.returnDate,
        status: 'PENDING',
        dailyRate: quote.car.dailyRate,
        rentalDays,
        subtotal: quote.subtotal,
        addOnsTotal: quote.addOnsTotal,
        taxRate: quote.taxRate,
        taxAmount: quote.taxAmount,
        totalAmount: quote.totalAmount,
        currency: quote.currency,
        notes: input.notes,
        addOns: {
          create: quote.addOns.map((addOn) => ({
            addOnId: addOn.id,
            quantity: addOn.quantity,
            unitPrice: addOn.unitPrice,
            totalPrice: addOn.totalPrice,
          })),
        },
      },
      include: bookingInclude,
    });

    return serializeBooking(booking);
  }

  async findById(id: string, userId?: string, role?: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        OR: [{ id }, { bookingNumber: id }],
      },
      include: bookingInclude,
    });

    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    const isStaff = role === 'ADMIN' || role === 'STAFF';
    if (!isStaff && booking.userId !== userId) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    return serializeBooking(booking);
  }

  async listByUser(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        include: bookingInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where: { userId } }),
    ]);

    return {
      data: bookings.map(serializeBooking),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listAll(page = 1, limit = 20, status?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.BookingWhereInput = status
      ? { status: status as Prisma.EnumBookingStatusFilter['equals'] }
      : {};

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          ...bookingInclude,
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings.map((b) => ({
        ...serializeBooking(b),
        user: (b as BookingWithRelations & { user: { id: string; email: string; firstName: string; lastName: string } }).user,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async cancel(id: string, userId: string, role?: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    const isStaff = role === 'ADMIN' || role === 'STAFF';
    if (!isStaff && booking.userId !== userId) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      throw Object.assign(new Error('Booking cannot be cancelled'), { statusCode: 400 });
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: bookingInclude,
    });

    return serializeBooking(updated);
  }

  async processPayment(id: string, userId: string, input: ProcessPaymentInput) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { payment: true },
    });

    if (!booking || booking.userId !== userId) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    if (booking.status !== 'PENDING') {
      throw Object.assign(new Error('Payment can only be processed for pending bookings'), {
        statusCode: 400,
      });
    }

    if (booking.payment?.status === 'COMPLETED') {
      throw Object.assign(new Error('Payment already completed'), { statusCode: 400 });
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (booking.payment) {
        await tx.payment.update({
          where: { id: booking.payment.id },
          data: {
            status: 'COMPLETED',
            method: input.method,
            transactionId,
            paidAt: new Date(),
          },
        });
      } else {
        await tx.payment.create({
          data: {
            bookingId: booking.id,
            amount: booking.totalAmount,
            currency: booking.currency,
            status: 'COMPLETED',
            method: input.method,
            transactionId,
            paidAt: new Date(),
          },
        });
      }

      return tx.booking.update({
        where: { id },
        data: { status: 'CONFIRMED' },
        include: bookingInclude,
      });
    });

    return serializeBooking(updated);
  }

  async updateStatus(id: string, status: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw Object.assign(new Error('Booking not found'), { statusCode: 404 });
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: status as typeof booking.status },
      include: bookingInclude,
    });

    return serializeBooking(updated);
  }
}
