export type Role = 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
export type ListingType = 'SALE' | 'RENT';
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'COMMERCIAL' | 'LAND';
export type PropertyStatus = 'DRAFT' | 'ACTIVE' | 'SOLD' | 'RENTED' | 'ARCHIVED';
export type District = 'NARIMANOV' | 'YASAMAL' | 'XETAI' | 'SEBAIL' | 'BADAMDAR' | 'GENCE';
export type InquiryStatus = 'NEW' | 'CONTACTED' | 'VIEWING' | 'NEGOTIATING' | 'CLOSED' | 'REJECTED';
export type Locale = 'AZ' | 'EN' | 'RU';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: Role;
  locale: Locale;
  agentProfile?: Agent | null;
}

export interface Agent {
  id: string;
  userId: string;
  licenseNumber: string;
  bioAz?: string | null;
  bioEn?: string | null;
  bioRu?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  user?: User;
}

export interface Property {
  id: string;
  titleAz: string;
  titleEn: string;
  titleRu: string;
  descriptionAz: string;
  descriptionEn: string;
  descriptionRu: string;
  price: number | string;
  currency: string;
  listingType: ListingType;
  propertyType: PropertyType;
  rooms: number;
  area: number;
  floor?: number | null;
  totalFloors?: number | null;
  district: District;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  photos: string[];
  floorPlanUrl?: string | null;
  status: PropertyStatus;
  ownerId: string;
  agentId?: string | null;
  createdAt: string;
  updatedAt: string;
  title?: string;
  description?: string;
  districtName?: string;
  priceFormatted?: string;
  agent?: Agent | null;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  userId?: string | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  property?: Property;
}

export interface DistrictInfo {
  id: District;
  slug: string;
  nameAz: string;
  nameEn: string;
  nameRu: string;
  city: string;
  listingCount?: number;
  avgPrice?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PropertySearchParams {
  listingType?: ListingType;
  propertyType?: PropertyType;
  district?: District;
  minPrice?: number;
  maxPrice?: number;
  minRooms?: number;
  maxRooms?: number;
  status?: PropertyStatus;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'createdAt' | 'area' | 'rooms';
  sortOrder?: 'asc' | 'desc';
  locale?: Locale;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardStats {
  totalListings: number;
  activeListings: number;
  totalInquiries: number;
  newInquiries: number;
  closedDeals: number;
  conversionRate: number;
  totalSalesValue: number;
  avgPrice: number;
  inquiriesByStatus: Record<InquiryStatus, number>;
  listingsByType: Record<ListingType, number>;
}

export interface HeatmapEntry {
  district: District;
  districtName: string;
  listingCount: number;
  inquiryCount: number;
  avgPrice: number;
  intensity: number;
}

export interface DashboardData {
  stats: DashboardStats;
  heatmap: HeatmapEntry[];
}
