import type { PrismaClient } from "@rentacar/db";
import {
  generateRefreshToken,
  getRefreshTokenExpiry,
  hashForLookup,
} from "./jwt.js";
import type { AuthConfig, RequestMeta, SessionInfo } from "./types.js";
import { InvalidRefreshTokenError } from "./errors.js";

export class SessionManager {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly config: AuthConfig,
  ) {}

  async createSession(
    userId: string,
    meta: RequestMeta = {},
  ): Promise<{ sessionId: string; refreshToken: string; expiresAt: Date }> {
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashForLookup(refreshToken);
    const expiresAt = getRefreshTokenExpiry(this.config);

    const session = await this.prisma.session.create({
      data: {
        userId,
        refreshTokenHash,
        userAgent: meta.userAgent,
        ipAddress: meta.ipAddress,
        expiresAt,
      },
    });

    return { sessionId: session.id, refreshToken, expiresAt };
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: string; sessionId: string }> {
    const refreshTokenHash = hashForLookup(refreshToken);

    const session = await this.prisma.session.findUnique({
      where: { refreshTokenHash },
      select: { id: true, userId: true, revokedAt: true, expiresAt: true },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date()
    ) {
      throw new InvalidRefreshTokenError();
    }

    return { userId: session.userId, sessionId: session.id };
  }

  async rotateRefreshToken(
    oldRefreshToken: string,
    meta: RequestMeta = {},
  ): Promise<{
    userId: string;
    sessionId: string;
    refreshToken: string;
    expiresAt: Date;
  }> {
    const { userId, sessionId } =
      await this.validateRefreshToken(oldRefreshToken);

    await this.revokeSession(sessionId);

    const newSession = await this.createSession(userId, meta);
    return { userId, ...newSession };
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllUserSessions(
    userId: string,
    exceptSessionId?: string,
  ): Promise<number> {
    const result = await this.prisma.session.updateMany({
      where: {
        userId,
        revokedAt: null,
        ...(exceptSessionId ? { id: { not: exceptSessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });

    return result.count;
  }

  async listUserSessions(userId: string): Promise<SessionInfo[]> {
    const sessions = await this.prisma.session.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return sessions;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const result = await this.prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null, lt: thirtyDaysAgo } },
        ],
      },
    });

    return result.count;
  }
}

export { hashForLookup };
