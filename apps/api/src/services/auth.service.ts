import bcrypt from 'bcryptjs';
import type { PrismaClient } from '@rentacar/db';
import type { RegisterInput, UpdateProfileInput } from '../schemas/index.js';

const SALT_ROUNDS = 12;

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
      select: userSelect,
    });
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: userSelect,
    });

    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return user;
  }

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        phone: input.phone,
      },
      select: userSelect,
    });
  }
}
