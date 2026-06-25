import type { FastifyInstance } from 'fastify';
import { LocationService } from '../services/location.service.js';
import { slugParamSchema } from '../schemas/index.js';

export async function locationRoutes(fastify: FastifyInstance) {
  const locationService = new LocationService(fastify.prisma);

  fastify.get('/', async () => {
    const locations = await locationService.list();
    return { data: locations };
  });

  fastify.get('/:slug', async (request, reply) => {
    const { slug } = slugParamSchema.parse(request.params);

    try {
      const location = await locationService.findBySlug(slug);
      return { location };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}
