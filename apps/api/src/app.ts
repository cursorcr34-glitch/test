import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import { ZodError } from 'zod';
import prismaPlugin from './plugins/prisma.js';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.routes.js';
import { carRoutes } from './routes/car.routes.js';
import { bookingRoutes, adminBookingRoutes } from './routes/booking.routes.js';
import { locationRoutes } from './routes/location.routes.js';
import { categoryRoutes } from './routes/category.routes.js';
import { addOnRoutes } from './routes/addon.routes.js';
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
    service: 'rentacar-api',
  }));

  await app.register(authRoutes, { prefix: '/api/auth' });
  await app.register(locationRoutes, { prefix: '/api/locations' });
  await app.register(categoryRoutes, { prefix: '/api/categories' });
  await app.register(carRoutes, { prefix: '/api/cars', env });
  await app.register(addOnRoutes, { prefix: '/api/add-ons' });
  await app.register(bookingRoutes, { prefix: '/api/bookings', env });
  await app.register(adminBookingRoutes, { prefix: '/api/admin/bookings', env });

  return app;
}
