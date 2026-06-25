import { PrismaClient } from '@prisma/client';

type CreateAgentInput = {
  userId: string;
  licenseNumber: string;
  bioAz?: string;
  bioEn?: string;
  bioRu?: string;
  avatarUrl?: string;
};

export class AgentService {
  constructor(private prisma: PrismaClient) {}

  async findAll(page: number, limit: number, activeOnly = true) {
    const where = activeOnly ? { isActive: true } : {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.agent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          _count: { select: { properties: true } },
        },
      }),
      this.prisma.agent.count({ where }),
    ]);

    return {
      items,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const agent = await this.prisma.agent.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        properties: {
          where: { status: 'ACTIVE' },
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!agent) {
      throw Object.assign(new Error('Agent not found'), { statusCode: 404 });
    }

    return agent;
  }

  async create(input: CreateAgentInput) {
    const user = await this.prisma.user.findUnique({ where: { id: input.userId } });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    if (user.role !== 'AGENT') {
      await this.prisma.user.update({
        where: { id: input.userId },
        data: { role: 'AGENT' },
      });
    }

    const existing = await this.prisma.agent.findUnique({ where: { userId: input.userId } });
    if (existing) {
      throw Object.assign(new Error('Agent profile already exists'), { statusCode: 409 });
    }

    return this.prisma.agent.create({
      data: input,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  async update(id: string, input: Partial<CreateAgentInput>) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      throw Object.assign(new Error('Agent not found'), { statusCode: 404 });
    }

    return this.prisma.agent.update({
      where: { id },
      data: input,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
      },
    });
  }

  async deactivate(id: string) {
    const agent = await this.prisma.agent.findUnique({ where: { id } });
    if (!agent) {
      throw Object.assign(new Error('Agent not found'), { statusCode: 404 });
    }

    return this.prisma.agent.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
