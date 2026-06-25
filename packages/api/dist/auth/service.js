"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const crypto_1 = require("crypto");
const errors_1 = require("./errors");
const jwt_1 = require("./jwt");
const oauth_1 = require("./oauth");
const password_1 = require("./password");
const rbac_1 = require("./rbac");
const session_1 = require("./session");
const USER_SELECT = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
    locale: true,
    avatarUrl: true,
    isActive: true,
    createdAt: true,
};
class AuthService {
    prisma;
    config;
    tokenSigner;
    sessions;
    constructor(prisma, config, tokenSigner) {
        this.prisma = prisma;
        this.config = config;
        this.tokenSigner = tokenSigner;
        this.sessions = new session_1.SessionManager(prisma, config);
    }
    async register(input, meta = {}) {
        if (!(0, rbac_1.canRegisterAs)(input.role)) {
            throw new errors_1.ForbiddenError("Cannot register with this role");
        }
        const existing = await this.prisma.user.findUnique({
            where: { email: input.email },
        });
        if (existing) {
            throw new errors_1.EmailAlreadyRegisteredError();
        }
        const passwordHash = await (0, password_1.hashPassword)(input.password, this.config.bcryptSaltRounds);
        const user = await this.prisma.user.create({
            data: {
                email: input.email,
                passwordHash,
                firstName: input.firstName,
                lastName: input.lastName,
                phone: input.phone,
                role: input.role,
                locale: input.locale,
            },
            select: USER_SELECT,
        });
        if (input.role === "AGENT") {
            await this.prisma.agentProfile.create({
                data: { userId: user.id },
            });
        }
        const tokens = await this.issueTokens(user, meta);
        return { user: this.toAuthUser(user), tokens };
    }
    async login(input, meta = {}) {
        const user = await this.prisma.user.findUnique({
            where: { email: input.email },
            select: { ...USER_SELECT, passwordHash: true },
        });
        if (!user) {
            throw new errors_1.InvalidCredentialsError();
        }
        if (!user.isActive) {
            throw new errors_1.UserInactiveError();
        }
        const valid = await (0, password_1.verifyPassword)(input.password, user.passwordHash);
        if (!valid) {
            throw new errors_1.InvalidCredentialsError();
        }
        const { passwordHash: _, ...safeUser } = user;
        const tokens = await this.issueTokens(safeUser, meta);
        return { user: this.toAuthUser(safeUser), tokens };
    }
    async loginWithGoogle(input, meta = {}) {
        const profile = await (0, oauth_1.verifyGoogleIdToken)(input.idToken, this.config);
        const linked = await this.prisma.oAuthAccount.findUnique({
            where: {
                provider_providerId: {
                    provider: profile.provider,
                    providerId: profile.providerId,
                },
            },
            include: { user: { select: USER_SELECT } },
        });
        if (linked) {
            if (!linked.user.isActive) {
                throw new errors_1.UserInactiveError();
            }
            const tokens = await this.issueTokens(linked.user, meta);
            return { user: this.toAuthUser(linked.user), tokens };
        }
        const existingUser = await this.prisma.user.findUnique({
            where: { email: profile.email },
            select: USER_SELECT,
        });
        if (existingUser) {
            await this.linkOAuthAccount(existingUser.id, profile);
            if (!existingUser.isActive) {
                throw new errors_1.UserInactiveError();
            }
            const tokens = await this.issueTokens(existingUser, meta);
            return { user: this.toAuthUser(existingUser), tokens };
        }
        if (!(0, rbac_1.canRegisterAs)(input.role)) {
            throw new errors_1.ForbiddenError("Cannot register with this role");
        }
        const user = await this.prisma.user.create({
            data: {
                email: profile.email,
                passwordHash: await (0, password_1.hashPassword)(cryptoRandomPassword(), this.config.bcryptSaltRounds),
                firstName: profile.firstName,
                lastName: profile.lastName,
                avatarUrl: profile.avatarUrl,
                role: input.role,
                locale: input.locale,
                oauthAccounts: {
                    create: {
                        provider: profile.provider,
                        providerId: profile.providerId,
                        email: profile.email,
                    },
                },
                ...(input.role === "AGENT"
                    ? { agentProfile: { create: {} } }
                    : {}),
            },
            select: USER_SELECT,
        });
        const tokens = await this.issueTokens(user, meta);
        return { user: this.toAuthUser(user), tokens };
    }
    async refreshTokens(refreshToken, meta = {}) {
        const { userId, sessionId, refreshToken: newRefreshToken } = await this.sessions.rotateRefreshToken(refreshToken, meta);
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: USER_SELECT,
        });
        if (!user || !user.isActive) {
            await this.sessions.revokeSession(sessionId);
            throw new errors_1.InvalidCredentialsError();
        }
        const accessToken = this.tokenSigner.signAccess((0, jwt_1.createAccessTokenPayload)(user.id, user.email, user.role));
        return {
            accessToken,
            refreshToken: newRefreshToken,
            expiresIn: this.config.jwtAccessExpiresIn,
        };
    }
    async logout(refreshToken) {
        try {
            const { sessionId } = await this.sessions.validateRefreshToken(refreshToken);
            await this.sessions.revokeSession(sessionId);
        }
        catch {
            // Idempotent logout — invalid token is treated as already logged out
        }
    }
    async logoutAll(userId, exceptSessionId) {
        return this.sessions.revokeAllUserSessions(userId, exceptSessionId);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                ...USER_SELECT,
                agentProfile: {
                    select: {
                        id: true,
                        licenseNo: true,
                        bioAz: true,
                        bioEn: true,
                        bioRu: true,
                        agencyName: true,
                        rating: true,
                        listingsCount: true,
                        isVerified: true,
                    },
                },
            },
        });
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        return user;
    }
    async updateProfile(userId, input) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(input.firstName !== undefined ? { firstName: input.firstName } : {}),
                ...(input.lastName !== undefined ? { lastName: input.lastName } : {}),
                ...(input.phone !== undefined ? { phone: input.phone } : {}),
                ...(input.locale !== undefined ? { locale: input.locale } : {}),
                ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
            },
            select: USER_SELECT,
        });
        return this.toAuthUser(user);
    }
    async changePassword(userId, input) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { passwordHash: true },
        });
        if (!user) {
            throw new errors_1.UserNotFoundError();
        }
        const valid = await (0, password_1.verifyPassword)(input.currentPassword, user.passwordHash);
        if (!valid) {
            throw new errors_1.InvalidCredentialsError();
        }
        const passwordHash = await (0, password_1.hashPassword)(input.newPassword, this.config.bcryptSaltRounds);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: userId },
                data: { passwordHash },
            }),
            this.prisma.session.updateMany({
                where: { userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
    }
    async listSessions(userId) {
        return this.sessions.listUserSessions(userId);
    }
    async revokeSession(userId, sessionId) {
        const session = await this.prisma.session.findFirst({
            where: { id: sessionId, userId },
        });
        if (!session) {
            throw new errors_1.UserNotFoundError();
        }
        await this.sessions.revokeSession(sessionId);
    }
    async issueTokens(user, meta) {
        const { sessionId, refreshToken } = await this.sessions.createSession(user.id, meta);
        const accessToken = this.tokenSigner.signAccess((0, jwt_1.createAccessTokenPayload)(user.id, user.email, user.role));
        return {
            accessToken,
            refreshToken,
            expiresIn: this.config.jwtAccessExpiresIn,
        };
    }
    async linkOAuthAccount(userId, profile) {
        await this.prisma.oAuthAccount.upsert({
            where: {
                provider_providerId: {
                    provider: profile.provider,
                    providerId: profile.providerId,
                },
            },
            create: {
                userId,
                provider: profile.provider,
                providerId: profile.providerId,
                email: profile.email,
            },
            update: { email: profile.email },
        });
    }
    toAuthUser(user) {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            locale: user.locale,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
    }
}
exports.AuthService = AuthService;
function cryptoRandomPassword() {
    return (0, crypto_1.randomBytes)(32).toString("base64url");
}
//# sourceMappingURL=service.js.map