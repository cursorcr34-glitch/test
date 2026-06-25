export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
}

export class EmailAlreadyRegisteredError extends AuthError {
  constructor() {
    super("Email already registered", 409, "EMAIL_EXISTS");
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super("User not found", 404, "USER_NOT_FOUND");
  }
}

export class UserInactiveError extends AuthError {
  constructor() {
    super("Account is deactivated", 403, "USER_INACTIVE");
  }
}

export class InvalidTokenError extends AuthError {
  constructor(message = "Invalid or expired token") {
    super(message, 401, "INVALID_TOKEN");
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = "Insufficient permissions") {
    super(message, 403, "FORBIDDEN");
  }
}

export class InvalidRefreshTokenError extends AuthError {
  constructor() {
    super("Invalid or expired refresh token", 401, "INVALID_REFRESH_TOKEN");
  }
}

export class WeakPasswordError extends AuthError {
  constructor(message: string) {
    super(message, 400, "WEAK_PASSWORD");
  }
}

export class OAuthError extends AuthError {
  constructor(message: string, statusCode = 400) {
    super(message, statusCode, "OAUTH_ERROR");
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
