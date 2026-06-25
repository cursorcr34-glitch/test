import type { PrismaClient } from "@emlak/db";
import { hashForLookup } from "./jwt";
import type { AuthConfig, RequestMeta, SessionInfo } from "./types";
export declare class SessionManager {
    private readonly prisma;
    private readonly config;
    constructor(prisma: PrismaClient, config: AuthConfig);
    createSession(userId: string, meta?: RequestMeta): Promise<{
        sessionId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    validateRefreshToken(refreshToken: string): Promise<{
        userId: string;
        sessionId: string;
    }>;
    rotateRefreshToken(oldRefreshToken: string, meta?: RequestMeta): Promise<{
        userId: string;
        sessionId: string;
        refreshToken: string;
        expiresAt: Date;
    }>;
    revokeSession(sessionId: string): Promise<void>;
    revokeAllUserSessions(userId: string, exceptSessionId?: string): Promise<number>;
    listUserSessions(userId: string): Promise<SessionInfo[]>;
    cleanupExpiredSessions(): Promise<number>;
}
export { hashForLookup };
//# sourceMappingURL=session.d.ts.map