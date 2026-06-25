import type { FastifyInstance, FastifyRequest } from "fastify";
import {
  changePasswordSchema,
  googleOAuthSchema,
  isAuthError,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  updateProfileSchema,
} from "../auth/index.js";

function getRequestMeta(request: FastifyRequest) {
  return {
    userAgent: request.headers["user-agent"],
    ipAddress: request.ip,
  };
}

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/register", async (request, reply) => {
    try {
      const input = registerSchema.parse(request.body);
      const result = await fastify.authService.register(
        input,
        getRequestMeta(request),
      );

      return reply.status(201).send({
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  fastify.post("/login", async (request, reply) => {
    try {
      const input = loginSchema.parse(request.body);
      const result = await fastify.authService.login(
        input,
        getRequestMeta(request),
      );

      return reply.send({
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  fastify.post("/oauth/google", async (request, reply) => {
    try {
      const input = googleOAuthSchema.parse(request.body);
      const result = await fastify.authService.loginWithGoogle(
        input,
        getRequestMeta(request),
      );

      return reply.send({
        user: result.user,
        accessToken: result.tokens.accessToken,
        refreshToken: result.tokens.refreshToken,
        expiresIn: result.tokens.expiresIn,
      });
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  fastify.post("/refresh", async (request, reply) => {
    try {
      const input = refreshTokenSchema.parse(request.body);
      const tokens = await fastify.authService.refreshTokens(
        input.refreshToken,
        getRequestMeta(request),
      );

      return reply.send(tokens);
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  fastify.post("/logout", async (request, reply) => {
    try {
      const input = refreshTokenSchema.parse(request.body);
      await fastify.authService.logout(input.refreshToken);
      return reply.status(204).send();
    } catch (error) {
      return handleAuthError(error, reply);
    }
  });

  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const user = await fastify.authService.getProfile(request.user.sub);
        return reply.send({ user });
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );

  fastify.patch(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const input = updateProfileSchema.parse(request.body);
        const user = await fastify.authService.updateProfile(
          request.user.sub,
          input,
        );
        return reply.send({ user });
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );

  fastify.post(
    "/change-password",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const input = changePasswordSchema.parse(request.body);
        await fastify.authService.changePassword(request.user.sub, input);
        return reply.status(204).send();
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );

  fastify.get(
    "/sessions",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const sessions = await fastify.authService.listSessions(
          request.user.sub,
        );
        return reply.send({ sessions });
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );

  fastify.delete(
    "/sessions/:sessionId",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const { sessionId } = request.params as { sessionId: string };
        await fastify.authService.revokeSession(request.user.sub, sessionId);
        return reply.status(204).send();
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );

  fastify.post(
    "/logout-all",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const count = await fastify.authService.logoutAll(request.user.sub);
        return reply.send({ revoked: count });
      } catch (error) {
        return handleAuthError(error, reply);
      }
    },
  );
}

function handleAuthError(
  error: unknown,
  reply: { status: (code: number) => { send: (body: unknown) => unknown } },
) {
  if (isAuthError(error)) {
    return reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
  }

  if (error instanceof Error && "issues" in error) {
    return reply.status(400).send({
      error: "VALIDATION_ERROR",
      message: "Invalid request data",
    });
  }

  throw error;
}
