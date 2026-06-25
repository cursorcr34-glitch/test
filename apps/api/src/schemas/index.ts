import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().nullable().optional(),
});

export const carSearchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  locationId: z.string().optional(),
  locationSlug: z.string().optional(),
  categoryId: z.string().optional(),
  categorySlug: z.string().optional(),
  pickupDate: z.coerce.date().optional(),
  returnDate: z.coerce.date().optional(),
  transmission: z.enum(['AUTOMATIC', 'MANUAL']).optional(),
  fuelType: z.enum(['PETROL', 'DIESEL', 'ELECTRIC', 'HYBRID']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minSeats: z.coerce.number().int().min(1).optional(),
  search: z.string().optional(),
  isPopular: z.coerce.boolean().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'year_desc', 'popularity']).default('popularity'),
  ids: z.string().optional(),
});

export const quoteSchema = z.object({
  pickupDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  addOnIds: z.array(z.string()).default([]),
}).refine((data) => data.returnDate > data.pickupDate, {
  message: 'Return date must be after pickup date',
  path: ['returnDate'],
});

export const createBookingSchema = z.object({
  carId: z.string().min(1),
  pickupLocationId: z.string().min(1),
  returnLocationId: z.string().min(1),
  pickupDate: z.coerce.date(),
  returnDate: z.coerce.date(),
  addOnIds: z.array(z.string()).default([]),
  notes: z.string().max(500).optional(),
}).refine((data) => data.returnDate > data.pickupDate, {
  message: 'Return date must be after pickup date',
  path: ['returnDate'],
});

export const processPaymentSchema = z.object({
  method: z.enum(['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CASH']),
  cardLast4: z.string().length(4).optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CarSearchInput = z.infer<typeof carSearchSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
