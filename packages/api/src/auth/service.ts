import { randomBytes } from "crypto";
import type { PrismaClient, UserRole } from "@emlak/db";
import {
  EmailAlreadyRegisteredError,
  ForbiddenError,
  InvalidCredentialsError,
  UserInactiveError,
  UserNotFoundError,
} from "./errors";
import { createAccessTokenPayload } from "./jwt";
import { verifyGoogleIdToken } from "./oauth";
import { hashPassword, verifyPassword } from "./password";
import { canRegisterAs } from "./rbac";
import type {
  ChangePasswordInput,
  GoogleOAuthInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./schemas";
import { SessionManager } from "./session";
import type {
  AuthConfig,
  AuthResult,
  AuthTokens,
  AuthUser,
  OAuthProfile,
  RequestMeta,
  SessionInfo,
} from "./types";

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
} as const;

export interface TokenSigner {
  signAccess(payload: ReturnType<typeof createAccessTokenPayload>): string;
}

export class AuthService {
  private readonly sessions: SessionManager;

  constructor(
    private readonly prisma: PrismaClient,
    private readonly config: AuthConfig,
    private readonly tokenSigner: TokenSigner,
  ) {
    this.sessions = new SessionManager(prisma, config);
  }

  async register(
    input: RegisterInput,
    meta: RequestMeta = {},
  ): Promise<AuthResult> {
    if (!canRegisterAs(input.role as UserRole)) {
      throw new ForbiddenError("Cannot register with this role");
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new EmailAlreadyRegisteredError();
    }

    const passwordHash = await hashPassword(
      input.password,
      this.config.bcryptSaltRounds,
    );

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
        role: input.role as UserRole,
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

  async login(input: LoginInput, meta: RequestMeta = {}): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { ...USER_SELECT, passwordHash: true },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new UserInactiveError();
    }

    const valid = await verifyPassword(input.password, user.passwordHash);
    if (!valid) {
      throw new InvalidCredentialsError();
    }

    const { passwordHash: _, ...safeUser } = user;
    const tokens = await this.issueTokens(safeUser, meta);
    return { user: this.toAuthUser(safeUser), tokens };
  }

  async loginWithGoogle(
    input: GoogleOAuthInput,
    meta: RequestMeta = {},
  ): Promise<AuthResult> {
    const profile = await verifyGoogleIdToken(input.idToken, this.config);

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
        throw new UserInactiveError();
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
        throw new UserInactiveError();
      }

      const tokens = await this.issueTokens(existingUser, meta);
      return { user: this.toAuthUser(existingUser), tokens };
    }

    if (!canRegisterAs(input.role as UserRole)) {
      throw new ForbiddenError("Cannot register with this role");
    }

    const user = await this.prisma.user.create({
      data: {
        email: profile.email,
        passwordHash: await hashPassword(
          cryptoRandomPassword(),
          this.config.bcryptSaltRounds,
        ),
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        role: input.role as UserRole,
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

  async refreshTokens(
    refreshToken: string,
    meta: RequestMeta = {},
  ): Promise<AuthTokens> {
    const { userId, sessionId, refreshToken: newRefreshToken } =
      await this.sessions.rotateRefreshToken(refreshToken, meta);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });

    if (!user || !user.isActive) {
      await this.sessions.revokeSession(sessionId);
      throw new InvalidCredentialsError();
    }

    const accessToken = this.tokenSigner.signAccess(
      createAccessTokenPayload(user.id, user.email, user.role),
    );

    return {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn: this.config.jwtAccessExpiresIn,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      const { sessionId } =
        await this.sessions.validateRefreshToken(refreshToken);
      await this.sessions.revokeSession(sessionId);
    } catch {
      // Idempotent logout — invalid token is treated as already logged out
    }
  }

  async logoutAll(userId: string, exceptSessionId?: string): Promise<number> {
    return this.sessions.revokeAllUserSessions(userId, exceptSessionId);
  }

  async getProfile(userId: string): Promise<AuthUser & { agentProfile?: unknown }> {
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
      throw new UserNotFoundError();
    }

    return user;
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput,
  ): Promise<AuthUser> {
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

  async changePassword(
    userId: string,
    input: ChangePasswordInput,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    const valid = await verifyPassword(
      input.currentPassword,
      user.passwordHash,
    );
    if (!valid) {
      throw new InvalidCredentialsError();
    }

    const passwordHash = await hashPassword(
      input.newPassword,
      this.config.bcryptSaltRounds,
    );

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

  async listSessions(userId: string): Promise<SessionInfo[]> {
    return this.sessions.listUserSessions(userId);
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    const session = await this.prisma.session.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      throw new UserNotFoundError();
    }

    await this.sessions.revokeSession(sessionId);
  }

  private async issueTokens(
    user: {
      id: string;
      email: string;
      role: UserRole;
    },
    meta: RequestMeta,
  ): Promise<AuthTokens> {
    const { sessionId, refreshToken } = await this.sessions.createSession(
      user.id,
      meta,
    );

    const accessToken = this.tokenSigner.signAccess(
      createAccessTokenPayload(user.id, user.email, user.role),
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: this.config.jwtAccessExpiresIn,
    };
  }

  private async linkOAuthAccount(
    userId: string,
    profile: OAuthProfile,
  ): Promise<void> {
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

  private toAuthUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: UserRole;
    locale: AuthUser["locale"];
    avatarUrl: string | null;
    createdAt: Date;
  }): AuthUser {
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

function cryptoRandomPassword(): string {
  return randomBytes(32).toString("base64url");
}
