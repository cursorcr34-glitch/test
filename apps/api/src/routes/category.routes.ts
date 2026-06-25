import type { FastifyInstance } from 'fastify';
import { CategoryService } from '../services/category.service.js';

export async function categoryRoutes(fastify: FastifyInstance) {
  const categoryService = new CategoryService(fastify.prisma);

  fastify.get('/', async () => {
    const categories = await categoryService.list();
    return { data: categories };
  });
}
