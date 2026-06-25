import type { FastifyInstance } from 'fastify';
import { CarService } from '../services/car.service.js';
import {
  carSearchSchema,
  idParamSchema,
  quoteSchema,
} from '../schemas/index.js';
import type { Env } from '../config/env.js';

export async function carRoutes(fastify: FastifyInstance, opts: { env: Env }) {
  const carService = new CarService(fastify.prisma, opts.env.TAX_RATE);

  fastify.get('/', async (request) => {
    const params = carSearchSchema.parse(request.query);
    return carService.search(params);
  });

  fastify.get('/popular', async (request) => {
    const limit = Number((request.query as { limit?: string }).limit) || 8;
    const cars = await carService.getPopular(Math.min(limit, 20));
    return { data: cars };
  });

  fastify.get('/:id', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);

    try {
      const car = await carService.findById(id);
      return { car };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.get('/:id/availability', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const query = request.query as { pickupDate?: string; returnDate?: string };

    if (!query.pickupDate || !query.returnDate) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'pickupDate and returnDate query parameters are required',
      });
    }

    const pickupDate = new Date(query.pickupDate);
    const returnDate = new Date(query.returnDate);

    if (Number.isNaN(pickupDate.getTime()) || Number.isNaN(returnDate.getTime())) {
      return reply.status(400).send({
        error: 'Validation Error',
        message: 'Invalid date format',
      });
    }

    try {
      const result = await carService.checkAvailability(id, pickupDate, returnDate);
      return result;
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });

  fastify.post('/:id/quote', async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    const input = quoteSchema.parse(request.body);

    try {
      const quote = await carService.calculateQuote(id, input);
      return { quote };
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({ error: error.message });
    }
  });
}
