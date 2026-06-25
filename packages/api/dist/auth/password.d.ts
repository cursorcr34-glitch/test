export declare function validatePasswordStrength(password: string): void;
export declare function hashPassword(password: string, saltRounds?: number): Promise<string>;
export declare function verifyPassword(password: string, passwordHash: string): Promise<boolean>;
export declare function hashToken(token: string): Promise<string>;
export declare function verifyTokenHash(token: string, hash: string): Promise<boolean>;
//# sourceMappingURL=password.d.ts.map