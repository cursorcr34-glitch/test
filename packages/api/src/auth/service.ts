import { randomBytes } from "crypto";
import type { PrismaClient } from "@rentacar/db";
import {
  EmailAlreadyRegisteredError,
  InvalidCredentialsError,
  UserInactiveError,
  UserNotFoundError,
} from "./errors.js";
import { createAccessTokenPayload } from "./jwt.js";
import { verifyGoogleIdToken } from "./oauth/index.js";
import {
  hashPassword,
  hashPasswordWithoutValidation,
  verifyPassword,
} from "./password.js";
import type {
  ChangePasswordInput,
  GoogleOAuthInput,
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "./schemas.js";
import { SessionManager } from "./session.js";
import type {
  AuthConfig,
  AuthResult,
  AuthTokens,
  AuthUser,
  OAuthProfile,
  RequestMeta,
  SessionInfo,
} from "./types.js";

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  role: true,
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
        role: "CUSTOMER",
      },
      select: USER_SELECT,
    });

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

    const user = await this.prisma.user.create({
      data: {
        email: profile.email,
        passwordHash: await hashPasswordWithoutValidation(
          cryptoRandomPassword(),
          this.config.bcryptSaltRounds,
        ),
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
        role: "CUSTOMER",
        oauthAccounts: {
          create: {
            provider: profile.provider,
            providerId: profile.providerId,
            email: profile.email,
          },
        },
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
      // Idempotent logout
    }
  }

  async logoutAll(userId: string, exceptSessionId?: string): Promise<number> {
    return this.sessions.revokeAllUserSessions(userId, exceptSessionId);
  }

  async getProfile(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: USER_SELECT,
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return this.toAuthUser(user);
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
      role: AuthUser["role"];
    },
    meta: RequestMeta,
  ): Promise<AuthTokens> {
    const { refreshToken } = await this.sessions.createSession(user.id, meta);

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
    avatarUrl: string | null;
    role: AuthUser["role"];
    createdAt: Date;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

function cryptoRandomPassword(): string {
  return randomBytes(32).toString("base64url");
}
