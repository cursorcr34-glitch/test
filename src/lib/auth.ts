'use client';

import type { User } from '@/types';

const TOKEN_KEY = 'emlak_token';
const USER_KEY = 'emlak_user';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAdminOrAgent(user: User | null): boolean {
  return user?.role === 'ADMIN' || user?.role === 'AGENT';
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'ADMIN';
}
