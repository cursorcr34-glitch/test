import type { FastifyInstance } from 'fastify';
import { PropertyService } from '../services/property.service.js';
import {
  createPropertySchema,
  idParamSchema,
  propertySearchSchema,
  updatePropertySchema,
} from '../schemas/index.js';

export async function propertyRoutes(fastify: FastifyInstance) {
  const propertyService = new PropertyService(fastify.prisma);

  fastify.get('/', async (request) => {
    const params = propertySearchSchema.parse(request.query);
    return propertyService.search(params);
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const locale = (request.query as { locale?: 'AZ' | 'EN' | 'RU' }).locale ?? 'AZ';

    try {
      const property = await propertyService.findById(id, locale);
      return { property };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.post('/', {
    preHandler: [fastify.authorize('SELLER', 'AGENT', 'ADMIN')],
  }, async (request, reply) => {
    const input = createPropertySchema.parse(request.body);

    try {
      const property = await propertyService.create(request.user.sub, input);
      return reply.status(201).send({ property });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.patch('/:id', {
    preHandler: [fastify.authorize('SELLER', 'AGENT', 'ADMIN')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const input = updatePropertySchema.parse(request.body);

    try {
      const property = await propertyService.update(id, request.user.sub, request.user.role, input);
      return { property };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.delete('/:id', {
    preHandler: [fastify.authorize('SELLER', 'ADMIN')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const result = await propertyService.delete(id, request.user.sub, request.user.role);
      return result;
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}
