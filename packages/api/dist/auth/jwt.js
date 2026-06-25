"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = generateRefreshToken;
exports.createAccessTokenPayload = createAccessTokenPayload;
exports.createRefreshTokenPayload = createRefreshTokenPayload;
exports.parseExpiresInMs = parseExpiresInMs;
exports.getRefreshTokenExpiry = getRefreshTokenExpiry;
exports.hashForLookup = hashForLookup;
const crypto_1 = require("crypto");
function generateRefreshToken() {
    return (0, crypto_1.randomBytes)(48).toString("base64url");
}
function createAccessTokenPayload(userId, email, role) {
    return {
        sub: userId,
        email,
        role,
        type: "access",
    };
}
function createRefreshTokenPayload(userId, sessionId) {
    return {
        sub: userId,
        sessionId,
        type: "refresh",
    };
}
function parseExpiresInMs(expiresIn) {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
        throw new Error(`Invalid expiresIn format: ${expiresIn}`);
    }
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        case "d":
            return value * 24 * 60 * 60 * 1000;
        default:
            throw new Error(`Unknown time unit: ${unit}`);
    }
}
function getRefreshTokenExpiry(config) {
    const ms = parseExpiresInMs(config.jwtRefreshExpiresIn);
    return new Date(Date.now() + ms);
}
function hashForLookup(value) {
    return (0, crypto_1.createHash)("sha256").update(value).digest("hex");
}
//# sourceMappingURL=jwt.js.map