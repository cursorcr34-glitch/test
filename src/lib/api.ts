import type {
  Agent,
  AuthResponse,
  DashboardData,
  DistrictInfo,
  Inquiry,
  Locale,
  PaginatedResponse,
  Property,
  PropertySearchParams,
  User,
} from '@/types';
import {
  MOCK_AGENTS,
  MOCK_DASHBOARD,
  MOCK_DISTRICTS,
  MOCK_INQUIRIES,
  filterMockProperties,
  getMockProperty,
} from './mock-data';

export type CreateInquiryInput = {
  propertyId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('emlak_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  useMock = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  if (!API_URL || useMock) {
    throw new ApiError('Using mock data', 0);
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new ApiError(body.message ?? 'Request failed', res.status);
  }

  return res.json();
}

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function buildQuery(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') qs.set(k, String(v));
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      return request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    async register(data: {
      email: string;
      password: string;
      name: string;
      phone?: string;
      role?: string;
      locale?: Locale;
    }): Promise<AuthResponse> {
      return request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    async me(): Promise<User> {
      return request('/api/auth/me');
    },
  },

  properties: {
    async search(params: PropertySearchParams = {}): Promise<PaginatedResponse<Property>> {
      return withFallback(
        () => request(`/api/properties${buildQuery(params as Record<string, string | number | undefined>)}`),
        filterMockProperties(params),
      );
    },
    async getById(id: string, locale: Locale = 'AZ'): Promise<Property> {
      return withFallback(
        () => request(`/api/properties/${id}?locale=${locale}`),
        getMockProperty(id) ?? MOCK_PROPERTIES_FALLBACK(id),
      );
    },
    async create(data: Partial<Property>): Promise<Property> {
      return request('/api/properties', { method: 'POST', body: JSON.stringify(data) });
    },
    async update(id: string, data: Partial<Property>): Promise<Property> {
      return request(`/api/properties/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    },
    async delete(id: string): Promise<void> {
      return request(`/api/properties/${id}`, { method: 'DELETE' });
    },
  },

  districts: {
    async list(): Promise<DistrictInfo[]> {
      return withFallback(() => request('/api/districts'), MOCK_DISTRICTS);
    },
    async getBySlug(slug: string): Promise<DistrictInfo> {
      return withFallback(
        () => request(`/api/districts/${slug}`),
        MOCK_DISTRICTS.find((d) => d.slug === slug) ?? MOCK_DISTRICTS[0],
      );
    },
  },

  inquiries: {
    async create(data: CreateInquiryInput): Promise<Inquiry> {
      try {
        return await request('/api/inquiries', { method: 'POST', body: JSON.stringify(data) });
      } catch {
        return {
          id: `mock-${Date.now()}`,
          ...data,
          status: 'NEW',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
    },
    async list(): Promise<Inquiry[]> {
      return withFallback(() => request('/api/inquiries'), MOCK_INQUIRIES);
    },
    async updateStatus(id: string, status: string): Promise<Inquiry> {
      return withFallback(
        () => request(`/api/inquiries/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        { ...MOCK_INQUIRIES.find((i) => i.id === id)!, status: status as Inquiry['status'] },
      );
    },
  },

  favorites: {
    async list(): Promise<Property[]> {
      return withFallback(async () => {
        const res = await request<{ data: Property[] }>('/api/favorites');
        return res.data ?? (res as unknown as Property[]);
      }, []);
    },
    async add(propertyId: string): Promise<void> {
      return request('/api/favorites', { method: 'POST', body: JSON.stringify({ propertyId }) });
    },
    async remove(propertyId: string): Promise<void> {
      return request(`/api/favorites/${propertyId}`, { method: 'DELETE' });
    },
    async check(propertyId: string): Promise<boolean> {
      return withFallback(
        () => request<{ favorited: boolean }>(`/api/favorites/check/${propertyId}`).then((r) => r.favorited),
        false,
      );
    },
  },

  agents: {
    async list(): Promise<Agent[]> {
      return withFallback(() => request('/api/agents'), MOCK_AGENTS);
    },
  },

  analytics: {
    async dashboard(): Promise<DashboardData> {
      return withFallback(
        async () => {
          const [stats, heatmapRes] = await Promise.all([
            request<DashboardData['stats']>('/api/analytics/dashboard'),
            request<{ data: DashboardData['heatmap'] }>('/api/analytics/heatmap'),
          ]);
          return { stats, heatmap: heatmapRes.data ?? (heatmapRes as unknown as DashboardData['heatmap']) };
        },
        MOCK_DASHBOARD,
      );
    },
  },
};

function MOCK_PROPERTIES_FALLBACK(id: string): Property {
  const p = getMockProperty(id);
  if (p) return p;
  throw new ApiError('Property not found', 404);
}

export { ApiError };
