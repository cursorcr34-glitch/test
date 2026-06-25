import type { FastifyInstance } from 'fastify';
import { BookingService } from '../services/booking.service.js';
import {
  createBookingSchema,
  idParamSchema,
  processPaymentSchema,
  updateBookingStatusSchema,
} from '../schemas/index.js';
import type { Env } from '../config/env.js';

export async function bookingRoutes(fastify: FastifyInstance, opts: { env: Env }) {
  const bookingService = new BookingService(fastify.prisma, opts.env.TAX_RATE);

  fastify.post('/', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const input = createBookingSchema.parse(request.body);

    try {
      const booking = await bookingService.create(request.user.sub, input);
      return reply.status(201).send({ booking });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.get('/mine', {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const query = request.query as { page?: string; limit?: string };
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    return bookingService.listByUser(request.user.sub, page, Math.min(limit, 50));
  });

  fastify.get('/:id', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const booking = await bookingService.findById(
        id,
        request.user.sub,
        request.user.role,
      );
      return { booking };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.post('/:id/cancel', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const booking = await bookingService.cancel(
        id,
        request.user.sub,
        request.user.role,
      );
      return { booking };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.post('/:id/payment', {
    preHandler: [fastify.authenticate],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const input = processPaymentSchema.parse(request.body);

    try {
      const booking = await bookingService.processPayment(id, request.user.sub, input);
      return { booking };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}

export async function adminBookingRoutes(fastify: FastifyInstance, opts: { env: Env }) {
  const bookingService = new BookingService(fastify.prisma, opts.env.TAX_RATE);

  fastify.get('/', {
    preHandler: [fastify.authorize('ADMIN', 'STAFF')],
  }, async (request) => {
    const query = request.query as { page?: string; limit?: string; status?: string };
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    return bookingService.listAll(page, Math.min(limit, 100), query.status);
  });

  fastify.patch('/:id/status', {
    preHandler: [fastify.authorize('ADMIN', 'STAFF')],
  }, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const { status } = updateBookingStatusSchema.parse(request.body);

    try {
      const booking = await bookingService.updateStatus(id, status);
      return { booking };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}
