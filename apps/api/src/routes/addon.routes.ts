import type { FastifyInstance } from 'fastify';
import { AddOnService } from '../services/addon.service.js';

export async function addOnRoutes(fastify: FastifyInstance) {
  const addOnService = new AddOnService(fastify.prisma);

  fastify.get('/', async () => {
    const addOns = await addOnService.list();
    return { data: addOns };
  });
}
