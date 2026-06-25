import type { AuthConfig, OAuthProfile } from "../types";
import { OAuthError } from "../errors";

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified?: boolean;
  given_name?: string;
  family_name?: string;
  name?: string;
  picture?: string;
}

const GOOGLE_TOKEN_INFO_URL =
  "https://oauth2.googleapis.com/tokeninfo?id_token=";

export async function verifyGoogleIdToken(
  idToken: string,
  config: AuthConfig,
): Promise<OAuthProfile> {
  if (!config.googleClientId) {
    throw new OAuthError("Google OAuth is not configured", 503);
  }

  const response = await fetch(`${GOOGLE_TOKEN_INFO_URL}${idToken}`);

  if (!response.ok) {
    throw new OAuthError("Invalid Google ID token", 401);
  }

  const payload = (await response.json()) as GoogleTokenPayload & {
    aud?: string;
    error?: string;
  };

  if (payload.error) {
    throw new OAuthError(payload.error, 401);
  }

  if (payload.aud !== config.googleClientId) {
    throw new OAuthError("Google token audience mismatch", 401);
  }

  if (!payload.email_verified) {
    throw new OAuthError("Google email is not verified", 401);
  }

  const nameParts = (payload.name ?? "").split(" ");
  const firstName = payload.given_name ?? nameParts[0] ?? "User";
  const lastName =
    payload.family_name ?? (nameParts.slice(1).join(" ") || "Account");

  return {
    provider: "google",
    providerId: payload.sub,
    email: payload.email.toLowerCase(),
    firstName,
    lastName,
    avatarUrl: payload.picture,
  };
}
