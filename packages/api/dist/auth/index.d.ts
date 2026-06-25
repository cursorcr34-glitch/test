export { AuthService, type TokenSigner } from "./service";
export { SessionManager } from "./session";
export { hashPassword, verifyPassword, validatePasswordStrength, } from "./password";
export { createAccessTokenPayload, createRefreshTokenPayload, generateRefreshToken, parseExpiresInMs, } from "./jwt";
export { getPermissions, hasPermission, hasAnyPermission, hasAllPermissions, hasRole, hasAnyRole, canRegisterAs, REGISTERABLE_ROLES, type Permission, } from "./rbac";
export { registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema, googleOAuthSchema, updateProfileSchema, type RegisterInput, type LoginInput, type RefreshTokenInput, type ChangePasswordInput, type GoogleOAuthInput, type UpdateProfileInput, } from "./schemas";
export { AuthError, InvalidCredentialsError, EmailAlreadyRegisteredError, UserNotFoundError, UserInactiveError, InvalidTokenError, ForbiddenError, InvalidRefreshTokenError, WeakPasswordError, OAuthError, isAuthError, } from "./errors";
export type { JwtPayload, RefreshTokenPayload, AuthUser, AuthTokens, AuthResult, SessionInfo, AuthConfig, RequestMeta, OAuthProvider, OAuthProfile, } from "./types";
export { verifyGoogleIdToken } from "./oauth";
//# sourceMappingURL=index.d.ts.map