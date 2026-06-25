import type { AuthConfig, JwtPayload, RefreshTokenPayload } from "./types";
export declare function generateRefreshToken(): string;
export declare function createAccessTokenPayload(userId: string, email: string, role: JwtPayload["role"]): JwtPayload;
export declare function createRefreshTokenPayload(userId: string, sessionId: string): RefreshTokenPayload;
export declare function parseExpiresInMs(expiresIn: string): number;
export declare function getRefreshTokenExpiry(config: AuthConfig): Date;
export declare function hashForLookup(value: string): string;
//# sourceMappingURL=jwt.d.ts.map