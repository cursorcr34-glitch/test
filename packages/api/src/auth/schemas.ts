import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  password: z.string().min(8).max(128),
  firstName: z.string().min(1).max(100).trim(),
  lastName: z.string().min(1).max(100).trim(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number format")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export const googleOAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).trim().optional(),
  lastName: z.string().min(1).max(100).trim().optional(),
  phone: z
    .string()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9\s\-()]+$/)
    .optional()
    .nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GoogleOAuthInput = z.infer<typeof googleOAuthSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
