import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import prismaPlugin from './plugins/prisma.js';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.routes.js';
import { propertyRoutes } from './routes/property.routes.js';
import { inquiryRoutes } from './routes/inquiry.routes.js';
import { favoriteRoutes } from './routes/favorite.routes.js';
import { districtRoutes } from './routes/district.routes.js';
import { agentRoutes, analyticsRoutes } from './routes/admin.routes.js';
import type { Env } from './config/env.js';

export async function buildApp(env: Env) {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  });

  await app.register(sensible);
  await app.register(prismaPlugin);
  await app.register(authPlugin);

  app.setErrorHandler((error: Error & { statusCode?: number }, _request, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid request data',
        details: error.flatten().fieldErrors,
      });
    }

    const statusCode = error.statusCode ?? 500;
    app.log.error(error);

    return reply.status(statusCode).send({
      error: error.name ?? 'Internal Server Error',
      message: error.message ?? 'An unexpected error occurred',
    });
  });

  app.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'emlak-api',
  }));

  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(propertyRoutes, { prefix: '/api/properties' });
  await app.register(inquiryRoutes, { prefix: '/api/inquiries' });
  await app.register(favoriteRoutes, { prefix: '/api/favorites' });
  await app.register(districtRoutes, { prefix: '/api/districts' });
  await app.register(agentRoutes, { prefix: '/api/agents' });
  await app.register(analyticsRoutes, { prefix: '/api/analytics' });

  return app;
}
