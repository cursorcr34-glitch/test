"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashForLookup = exports.SessionManager = void 0;
const jwt_1 = require("./jwt");
Object.defineProperty(exports, "hashForLookup", { enumerable: true, get: function () { return jwt_1.hashForLookup; } });
const errors_1 = require("./errors");
class SessionManager {
    prisma;
    config;
    constructor(prisma, config) {
        this.prisma = prisma;
        this.config = config;
    }
    async createSession(userId, meta = {}) {
        const refreshToken = (0, jwt_1.generateRefreshToken)();
        const refreshTokenHash = (0, jwt_1.hashForLookup)(refreshToken);
        const expiresAt = (0, jwt_1.getRefreshTokenExpiry)(this.config);
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
    async validateRefreshToken(refreshToken) {
        const refreshTokenHash = (0, jwt_1.hashForLookup)(refreshToken);
        const session = await this.prisma.session.findUnique({
            where: { refreshTokenHash },
            select: { id: true, userId: true, revokedAt: true, expiresAt: true },
        });
        if (!session ||
            session.revokedAt ||
            session.expiresAt <= new Date()) {
            throw new errors_1.InvalidRefreshTokenError();
        }
        return { userId: session.userId, sessionId: session.id };
    }
    async rotateRefreshToken(oldRefreshToken, meta = {}) {
        const { userId, sessionId } = await this.validateRefreshToken(oldRefreshToken);
        await this.revokeSession(sessionId);
        const newSession = await this.createSession(userId, meta);
        return { userId, ...newSession };
    }
    async revokeSession(sessionId) {
        await this.prisma.session.update({
            where: { id: sessionId },
            data: { revokedAt: new Date() },
        });
    }
    async revokeAllUserSessions(userId, exceptSessionId) {
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
    async listUserSessions(userId) {
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
    async cleanupExpiredSessions() {
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
exports.SessionManager = SessionManager;
//# sourceMappingURL=session.js.map