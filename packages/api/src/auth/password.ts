import bcrypt from "bcryptjs";
import { WeakPasswordError } from "./errors.js";

const DEFAULT_SALT_ROUNDS = 12;

const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
};

export function validatePasswordStrength(password: string): void {
  if (password.length < PASSWORD_RULES.minLength) {
    throw new WeakPasswordError(
      `Password must be at least ${PASSWORD_RULES.minLength} characters`,
    );
  }

  if (password.length > PASSWORD_RULES.maxLength) {
    throw new WeakPasswordError(
      `Password must be at most ${PASSWORD_RULES.maxLength} characters`,
    );
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    throw new WeakPasswordError(
      "Password must contain at least one uppercase letter",
    );
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    throw new WeakPasswordError(
      "Password must contain at least one lowercase letter",
    );
  }

  if (PASSWORD_RULES.requireDigit && !/\d/.test(password)) {
    throw new WeakPasswordError("Password must contain at least one digit");
  }
}

export async function hashPassword(
  password: string,
  saltRounds = DEFAULT_SALT_ROUNDS,
): Promise<string> {
  validatePasswordStrength(password);
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}

export async function hashPasswordWithoutValidation(
  password: string,
  saltRounds = DEFAULT_SALT_ROUNDS,
): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}
