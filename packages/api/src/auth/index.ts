export { AuthService, type TokenSigner } from "./service.js";
export { SessionManager } from "./session.js";
export {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  hashPasswordWithoutValidation,
} from "./password.js";
export {
  createAccessTokenPayload,
  createRefreshTokenPayload,
  generateRefreshToken,
  parseExpiresInMs,
} from "./jwt.js";
export {
  getPermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  canRegisterAs,
  REGISTERABLE_ROLES,
  type Permission,
} from "./rbac.js";
export {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  googleOAuthSchema,
  updateProfileSchema,
  type RegisterInput,
  type LoginInput,
  type RefreshTokenInput,
  type ChangePasswordInput,
  type GoogleOAuthInput,
  type UpdateProfileInput,
} from "./schemas.js";
export {
  AuthError,
  InvalidCredentialsError,
  EmailAlreadyRegisteredError,
  UserNotFoundError,
  UserInactiveError,
  InvalidTokenError,
  ForbiddenError,
  InvalidRefreshTokenError,
  WeakPasswordError,
  OAuthError,
  isAuthError,
} from "./errors.js";
export type {
  JwtPayload,
  RefreshTokenPayload,
  AuthUser,
  AuthTokens,
  AuthResult,
  SessionInfo,
  AuthConfig,
  RequestMeta,
  OAuthProvider,
  OAuthProfile,
} from "./types.js";
export { verifyGoogleIdToken } from "./oauth/index.js";
