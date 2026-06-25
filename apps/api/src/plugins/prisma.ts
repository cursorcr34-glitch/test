import fp from 'fastify-plugin';
import { prisma } from '@rentacar/db';
import type { FastifyInstance } from 'fastify';
import type { PrismaClient } from '@rentacar/db';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  await prisma.$connect();
  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async () => {
    await prisma.$disconnect();
  });
});
