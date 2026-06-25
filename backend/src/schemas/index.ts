import { District, InquiryStatus, ListingType, Locale, PropertyStatus, PropertyType, Role } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20).optional(),
  role: z.enum(['BUYER', 'SELLER', 'AGENT']).default('BUYER'),
  locale: z.enum(['AZ', 'EN', 'RU']).default('AZ'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const propertySearchSchema = z.object({
  listingType: z.enum(['SALE', 'RENT']).optional(),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND']).optional(),
  district: z.enum(['NARIMANOV', 'YASAMAL', 'XETAI', 'SEBAIL', 'BADAMDAR', 'GENCE']).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRooms: z.coerce.number().int().min(0).optional(),
  maxRooms: z.coerce.number().int().min(0).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'SOLD', 'RENTED', 'ARCHIVED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['price', 'createdAt', 'area', 'rooms']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  locale: z.enum(['AZ', 'EN', 'RU']).default('AZ'),
});

export const createPropertySchema = z.object({
  titleAz: z.string().min(3).max(200),
  titleEn: z.string().min(3).max(200),
  titleRu: z.string().min(3).max(200),
  descriptionAz: z.string().min(10),
  descriptionEn: z.string().min(10),
  descriptionRu: z.string().min(10),
  price: z.number().positive(),
  listingType: z.enum(['SALE', 'RENT']),
  propertyType: z.enum(['APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND']),
  rooms: z.number().int().min(0),
  area: z.number().positive(),
  floor: z.number().int().optional(),
  totalFloors: z.number().int().optional(),
  district: z.enum(['NARIMANOV', 'YASAMAL', 'XETAI', 'SEBAIL', 'BADAMDAR', 'GENCE']),
  address: z.string().min(5),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  amenities: z.array(z.string()).default([]),
  photos: z.array(z.string().url()).min(1),
  floorPlanUrl: z.string().url().optional(),
  status: z.enum(['DRAFT', 'ACTIVE']).default('DRAFT'),
  agentId: z.string().optional(),
});

export const updatePropertySchema = createPropertySchema.partial();

export const createInquirySchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  message: z.string().min(10).max(2000),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'VIEWING', 'NEGOTIATING', 'CLOSED', 'REJECTED']),
});

export const createAgentSchema = z.object({
  userId: z.string().min(1),
  licenseNumber: z.string().min(3).max(50),
  bioAz: z.string().optional(),
  bioEn: z.string().optional(),
  bioRu: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateAgentSchema = createAgentSchema.partial().omit({ userId: true });

export const favoriteSchema = z.object({
  propertyId: z.string().min(1),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PropertySearchInput = z.infer<typeof propertySearchSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertySchema>;
export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

export { District, InquiryStatus, ListingType, Locale, PropertyStatus, PropertyType, Role };
