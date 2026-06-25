"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthError = exports.WeakPasswordError = exports.InvalidRefreshTokenError = exports.ForbiddenError = exports.InvalidTokenError = exports.UserInactiveError = exports.UserNotFoundError = exports.EmailAlreadyRegisteredError = exports.InvalidCredentialsError = exports.AuthError = void 0;
exports.isAuthError = isAuthError;
class AuthError extends Error {
    statusCode;
    code;
    constructor(message, statusCode, code) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = "AuthError";
    }
}
exports.AuthError = AuthError;
class InvalidCredentialsError extends AuthError {
    constructor() {
        super("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class EmailAlreadyRegisteredError extends AuthError {
    constructor() {
        super("Email already registered", 409, "EMAIL_EXISTS");
    }
}
exports.EmailAlreadyRegisteredError = EmailAlreadyRegisteredError;
class UserNotFoundError extends AuthError {
    constructor() {
        super("User not found", 404, "USER_NOT_FOUND");
    }
}
exports.UserNotFoundError = UserNotFoundError;
class UserInactiveError extends AuthError {
    constructor() {
        super("Account is deactivated", 403, "USER_INACTIVE");
    }
}
exports.UserInactiveError = UserInactiveError;
class InvalidTokenError extends AuthError {
    constructor(message = "Invalid or expired token") {
        super(message, 401, "INVALID_TOKEN");
    }
}
exports.InvalidTokenError = InvalidTokenError;
class ForbiddenError extends AuthError {
    constructor(message = "Insufficient permissions") {
        super(message, 403, "FORBIDDEN");
    }
}
exports.ForbiddenError = ForbiddenError;
class InvalidRefreshTokenError extends AuthError {
    constructor() {
        super("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
    }
}
exports.InvalidRefreshTokenError = InvalidRefreshTokenError;
class WeakPasswordError extends AuthError {
    constructor(message) {
        super(message, 400, "WEAK_PASSWORD");
    }
}
exports.WeakPasswordError = WeakPasswordError;
class OAuthError extends AuthError {
    constructor(message, statusCode = 400) {
        super(message, statusCode, "OAUTH_ERROR");
    }
}
exports.OAuthError = OAuthError;
function isAuthError(error) {
    return error instanceof AuthError;
}
//# sourceMappingURL=errors.js.map