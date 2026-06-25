import type { FastifyInstance } from 'fastify';
import { InquiryService } from '../services/inquiry.service.js';
import {
  createInquirySchema,
  idParamSchema,
  paginationSchema,
  updateInquiryStatusSchema,
} from '../schemas/index.js';

export async function inquiryRoutes(fastify: FastifyInstance) {
  const inquiryService = new InquiryService(fastify.prisma);

  fastify.post('/', async (request, reply) => {
    const input = createInquirySchema.parse(request.body);
    const userId = request.headers.authorization
      ? await getOptionalUserId(fastify, request)
      : undefined;

    try {
      const inquiry = await inquiryService.create(input, userId);
      return reply.status(201).send({ inquiry });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.get('/', {
    preHandler: [fastify.authorize('AGENT', 'ADMIN')],
  }, async (request) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const status = (request.query as { status?: string }).status;
    return inquiryService.findAll(page, limit, status);
  });

  fastify.get('/mine', {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { page, limit } = paginationSchema.parse(request.query);
    return inquiryService.findByUser(request.user.sub, page, limit);
  });

  fastify.get('/:id', {
    preHandler: [fastify.authorize('AGENT', 'ADMIN')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const inquiry = await inquiryService.findById(id);
      return { inquiry };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.patch('/:id/status', {
    preHandler: [fastify.authorize('AGENT', 'ADMIN')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const { status } = updateInquiryStatusSchema.parse(request.body);

    try {
      const inquiry = await inquiryService.updateStatus(id, status);
      return { inquiry };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}

async function getOptionalUserId(
  fastify: FastifyInstance,
  request: { headers: { authorization?: string }; user?: { sub: string } },
): Promise<string | undefined> {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) return undefined;
    const decoded = fastify.jwt.verify<{ sub: string }>(token);
    return decoded.sub;
  } catch {
    return undefined;
  }
}
