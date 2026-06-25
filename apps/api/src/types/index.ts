import type { Role } from '@rentacar/db';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
