"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.googleOAuthSchema = exports.changePasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(255).toLowerCase().trim(),
    password: zod_1.z.string().min(8).max(128),
    firstName: zod_1.z.string().min(1).max(100).trim(),
    lastName: zod_1.z.string().min(1).max(100).trim(),
    phone: zod_1.z
        .string()
        .min(7)
        .max(20)
        .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format")
        .optional(),
    role: zod_1.z.enum(["BUYER", "SELLER", "AGENT"]).default("BUYER"),
    locale: zod_1.z.enum(["AZ", "EN", "RU"]).default("AZ"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().toLowerCase().trim(),
    password: zod_1.z.string().min(1),
});
exports.refreshTokenSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1),
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1),
    newPassword: zod_1.z.string().min(8).max(128),
});
exports.googleOAuthSchema = zod_1.z.object({
    idToken: zod_1.z.string().min(1),
    role: zod_1.z.enum(["BUYER", "SELLER", "AGENT"]).default("BUYER"),
    locale: zod_1.z.enum(["AZ", "EN", "RU"]).default("AZ"),
});
exports.updateProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(100).trim().optional(),
    lastName: zod_1.z.string().min(1).max(100).trim().optional(),
    phone: zod_1.z
        .string()
        .min(7)
        .max(20)
        .regex(/^\+?[0-9\s\-()]+$/)
        .optional()
        .nullable(),
    locale: zod_1.z.enum(["AZ", "EN", "RU"]).optional(),
    avatarUrl: zod_1.z.string().url().optional().nullable(),
});
//# sourceMappingURL=schemas.js.map