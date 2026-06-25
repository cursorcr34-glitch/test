export declare class AuthError extends Error {
    readonly statusCode: number;
    readonly code: string;
    constructor(message: string, statusCode: number, code: string);
}
export declare class InvalidCredentialsError extends AuthError {
    constructor();
}
export declare class EmailAlreadyRegisteredError extends AuthError {
    constructor();
}
export declare class UserNotFoundError extends AuthError {
    constructor();
}
export declare class UserInactiveError extends AuthError {
    constructor();
}
export declare class InvalidTokenError extends AuthError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AuthError {
    constructor(message?: string);
}
export declare class InvalidRefreshTokenError extends AuthError {
    constructor();
}
export declare class WeakPasswordError extends AuthError {
    constructor(message: string);
}
export declare class OAuthError extends AuthError {
    constructor(message: string, statusCode?: number);
}
export declare function isAuthError(error: unknown): error is AuthError;
//# sourceMappingURL=errors.d.ts.map