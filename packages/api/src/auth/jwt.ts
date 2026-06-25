import { createHash, randomBytes } from "crypto";
import type { AuthConfig, JwtPayload, RefreshTokenPayload } from "./types";

export function generateRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

export function createAccessTokenPayload(
  userId: string,
  email: string,
  role: JwtPayload["role"],
): JwtPayload {
  return {
    sub: userId,
    email,
    role,
    type: "access",
  };
}

export function createRefreshTokenPayload(
  userId: string,
  sessionId: string,
): RefreshTokenPayload {
  return {
    sub: userId,
    sessionId,
    type: "refresh",
  };
}

export function parseExpiresInMs(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}

export function getRefreshTokenExpiry(config: AuthConfig): Date {
  const ms = parseExpiresInMs(config.jwtRefreshExpiresIn);
  return new Date(Date.now() + ms);
}

export function hashForLookup(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}
