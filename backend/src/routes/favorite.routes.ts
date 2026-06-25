import type { FastifyInstance } from 'fastify';
import { FavoriteService } from '../services/favorite.service.js';
import { favoriteSchema, idParamSchema, paginationSchema } from '../schemas/index.js';

export async function favoriteRoutes(fastify: FastifyInstance) {
  const favoriteService = new FavoriteService(fastify.prisma);

  fastify.get('/', {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const { page, limit } = paginationSchema.parse(request.query);
    return favoriteService.list(request.user.sub, page, limit);
  });

  fastify.post('/', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { propertyId } = favoriteSchema.parse(request.body);

    try {
      const favorite = await favoriteService.add(request.user.sub, propertyId);
      return reply.status(201).send({ favorite });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.delete('/:propertyId', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { propertyId } = favoriteSchema.parse({ propertyId: (request.params as { propertyId: string }).propertyId });

    try {
      const result = await favoriteService.remove(request.user.sub, propertyId);
      return result;
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.get('/check/:propertyId', {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const propertyId = (request.params as { propertyId: string }).propertyId;
    return favoriteService.check(request.user.sub, propertyId);
  });
}
