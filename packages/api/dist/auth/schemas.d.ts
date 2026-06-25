import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodDefault<z.ZodEnum<["BUYER", "SELLER", "AGENT"]>>;
    locale: z.ZodDefault<z.ZodEnum<["AZ", "EN", "RU"]>>;
}, "strip", z.ZodTypeAny, {
    role: "BUYER" | "SELLER" | "AGENT";
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    locale: "AZ" | "EN" | "RU";
    phone?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: "BUYER" | "SELLER" | "AGENT" | undefined;
    phone?: string | undefined;
    locale?: "AZ" | "EN" | "RU" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
}>;
export declare const googleOAuthSchema: z.ZodObject<{
    idToken: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["BUYER", "SELLER", "AGENT"]>>;
    locale: z.ZodDefault<z.ZodEnum<["AZ", "EN", "RU"]>>;
}, "strip", z.ZodTypeAny, {
    role: "BUYER" | "SELLER" | "AGENT";
    locale: "AZ" | "EN" | "RU";
    idToken: string;
}, {
    idToken: string;
    role?: "BUYER" | "SELLER" | "AGENT" | undefined;
    locale?: "AZ" | "EN" | "RU" | undefined;
}>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    locale: z.ZodOptional<z.ZodEnum<["AZ", "EN", "RU"]>>;
    avatarUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | null | undefined;
    phone?: string | null | undefined;
    locale?: "AZ" | "EN" | "RU" | undefined;
}, {
    firstName?: string | undefined;
    lastName?: string | undefined;
    avatarUrl?: string | null | undefined;
    phone?: string | null | undefined;
    locale?: "AZ" | "EN" | "RU" | undefined;
}>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
//# sourceMappingURL=schemas.d.ts.map