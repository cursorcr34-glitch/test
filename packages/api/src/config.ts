import type { AuthConfig } from "./auth/types.js";

export function loadAuthConfig(env: NodeJS.ProcessEnv = process.env): AuthConfig {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set and at least 32 characters long",
    );
  }

  return {
    jwtSecret,
    jwtAccessExpiresIn: env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    jwtRefreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN ?? "7d",
    bcryptSaltRounds: env.BCRYPT_SALT_ROUNDS
      ? parseInt(env.BCRYPT_SALT_ROUNDS, 10)
      : 12,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  };
}
