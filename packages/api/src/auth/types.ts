import type { Role } from "@rentacar/db";

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  type: "refresh";
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: Role;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResult {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface SessionInfo {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  expiresAt: Date;
}

export interface AuthConfig {
  jwtSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  bcryptSaltRounds?: number;
  googleClientId?: string;
  googleClientSecret?: string;
}

export interface RequestMeta {
  userAgent?: string;
  ipAddress?: string;
}

export type OAuthProvider = "google";

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}
