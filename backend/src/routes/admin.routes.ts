import type { FastifyInstance } from 'fastify';
import { AgentService } from '../services/agent.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import {
  createAgentSchema,
  idParamSchema,
  paginationSchema,
  updateAgentSchema,
} from '../schemas/index.js';

export async function agentRoutes(fastify: FastifyInstance) {
  const agentService = new AgentService(fastify.prisma);

  fastify.get('/', async (request) => {
    const { page, limit } = paginationSchema.parse(request.query);
    const activeOnly = (request.query as { activeOnly?: string }).activeOnly !== 'false';
    return agentService.findAll(page, limit, activeOnly);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const agent = await agentService.findById(id);
      return { agent };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.post('/', {
    preHandler: [fastify.authorize('ADMIN')],
  }, async (request, reply) => {
    const input = createAgentSchema.parse(request.body);

    try {
      const agent = await agentService.create(input);
      return reply.status(201).send({ agent });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authorize('ADMIN', 'AGENT')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const input = updateAgentSchema.parse(request.body);

    try {
      const agent = await agentService.update(id, input);
      return { agent };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authorize('ADMIN')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      await agentService.deactivate(id);
      return { success: true };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}

export async function analyticsRoutes(fastify: FastifyInstance) {
  const analyticsService = new AnalyticsService(fastify.prisma);

  fastify.get('/dashboard', {
    preHandler: [fastify.authorize('ADMIN', 'AGENT')],
  }, async () => {
    const stats = await analyticsService.getDashboardStats();
    return stats;
  });

  fastify.get('/heatmap', {
    preHandler: [fastify.authorize('ADMIN', 'AGENT')],
  }, async () => {
    const heatmap = await analyticsService.getDistrictHeatmap();
    return { heatmap };
  });
}
