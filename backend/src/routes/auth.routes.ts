import type { FastifyInstance } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { loginSchema, registerSchema } from '../schemas/index.js';
import type { JwtPayload } from '../types/index.js';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma);

  fastify.post('/register', async (request, reply) => {
    const input = registerSchema.parse(request.body);

    try {
      const user = await authService.register(input);
      const token = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      } satisfies JwtPayload);

      return reply.status(201).send({ user, token });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({
        error: error.message,
      });
    }
  });

  fastify.post('/login', async (request, reply) => {
    const input = loginSchema.parse(request.body);

    try {
      const user = await authService.login(input.email, input.password);
      const token = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
      } satisfies JwtPayload);

      return reply.send({ user, token });
    } catch (err) {
      const error = err as Error & { statusCode?: number };
      return reply.status(error.statusCode ?? 500).send({
        error: error.message,
      });
    }
  });

  fastify.get('/me', {
    preHandler: [fastify.authenticate],
  }, async (request) => {
    const profile = await authService.getProfile(request.user.sub);
    return { user: profile };
  });
}
