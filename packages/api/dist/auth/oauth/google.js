"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = verifyGoogleIdToken;
const errors_1 = require("../errors");
const GOOGLE_TOKEN_INFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";
async function verifyGoogleIdToken(idToken, config) {
    if (!config.googleClientId) {
        throw new errors_1.OAuthError("Google OAuth is not configured", 503);
    }
    const response = await fetch(`${GOOGLE_TOKEN_INFO_URL}${idToken}`);
    if (!response.ok) {
        throw new errors_1.OAuthError("Invalid Google ID token", 401);
    }
    const payload = (await response.json());
    if (payload.error) {
        throw new errors_1.OAuthError(payload.error, 401);
    }
    if (payload.aud !== config.googleClientId) {
        throw new errors_1.OAuthError("Google token audience mismatch", 401);
    }
    if (!payload.email_verified) {
        throw new errors_1.OAuthError("Google email is not verified", 401);
    }
    const nameParts = (payload.name ?? "").split(" ");
    const firstName = payload.given_name ?? nameParts[0] ?? "User";
    const lastName = payload.family_name ?? (nameParts.slice(1).join(" ") || "Account");
    return {
        provider: "google",
        providerId: payload.sub,
        email: payload.email.toLowerCase(),
        firstName,
        lastName,
        avatarUrl: payload.picture,
    };
}
//# sourceMappingURL=google.js.map