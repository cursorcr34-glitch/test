import type { PrismaClient } from "@emlak/db";
import { createAccessTokenPayload } from "./jwt";
import type { ChangePasswordInput, GoogleOAuthInput, LoginInput, RegisterInput, UpdateProfileInput } from "./schemas";
import type { AuthConfig, AuthResult, AuthTokens, AuthUser, RequestMeta, SessionInfo } from "./types";
export interface TokenSigner {
    signAccess(payload: ReturnType<typeof createAccessTokenPayload>): string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly config;
    private readonly tokenSigner;
    private readonly sessions;
    constructor(prisma: PrismaClient, config: AuthConfig, tokenSigner: TokenSigner);
    register(input: RegisterInput, meta?: RequestMeta): Promise<AuthResult>;
    login(input: LoginInput, meta?: RequestMeta): Promise<AuthResult>;
    loginWithGoogle(input: GoogleOAuthInput, meta?: RequestMeta): Promise<AuthResult>;
    refreshTokens(refreshToken: string, meta?: RequestMeta): Promise<AuthTokens>;
    logout(refreshToken: string): Promise<void>;
    logoutAll(userId: string, exceptSessionId?: string): Promise<number>;
    getProfile(userId: string): Promise<AuthUser & {
        agentProfile?: unknown;
    }>;
    updateProfile(userId: string, input: UpdateProfileInput): Promise<AuthUser>;
    changePassword(userId: string, input: ChangePasswordInput): Promise<void>;
    listSessions(userId: string): Promise<SessionInfo[]>;
    revokeSession(userId: string, sessionId: string): Promise<void>;
    private issueTokens;
    private linkOAuthAccount;
    private toAuthUser;
}
//# sourceMappingURL=service.d.ts.map