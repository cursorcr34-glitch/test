import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { PrismaClient, UserRole } from "@emlak/db";
import {
  AuthService,
  hasAnyRole,
  type AuthConfig,
  type JwtPayload,
  type Permission,
  hasPermission,
} from "../auth";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authService: AuthService;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
    authorize: (
      ...roles: UserRole[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requirePermission: (
      ...permissions: Permission[]
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export interface AuthPluginOptions {
  config: AuthConfig;
  prisma: PrismaClient;
}

export default fp<AuthPluginOptions>(
  async (fastify, { config, prisma }) => {
    await fastify.register(jwt, {
      secret: config.jwtSecret,
      sign: { expiresIn: config.jwtAccessExpiresIn },
    });

    const authService = new AuthService(prisma, config, {
      signAccess: (payload) => fastify.jwt.sign(payload),
    });

    fastify.decorate("authService", authService);

    fastify.decorate(
      "authenticate",
      async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
          if (request.user.type !== "access") {
            return reply.status(401).send({
              error: "Unauthorized",
              message: "Invalid token type",
            });
          }
        } catch {
          return reply.status(401).send({
            error: "Unauthorized",
            message: "Invalid or expired token",
          });
        }
      },
    );

    fastify.decorate(
      "authorize",
      (...roles: UserRole[]) =>
        async (request: FastifyRequest, reply: FastifyReply) => {
          try {
            await request.jwtVerify();
          } catch {
            return reply.status(401).send({
              error: "Unauthorized",
              message: "Invalid or expired token",
            });
          }

          if (!hasAnyRole(request.user.role, roles)) {
            return reply.status(403).send({
              error: "Forbidden",
              message: "Insufficient permissions",
            });
          }
        },
    );

    fastify.decorate(
      "requirePermission",
      (...permissions: Permission[]) =>
        async (request: FastifyRequest, reply: FastifyReply) => {
          try {
            await request.jwtVerify();
          } catch {
            return reply.status(401).send({
              error: "Unauthorized",
              message: "Invalid or expired token",
            });
          }

          const allowed = permissions.some((p) =>
            hasPermission(request.user.role, p),
          );

          if (!allowed) {
            return reply.status(403).send({
              error: "Forbidden",
              message: "Insufficient permissions",
            });
          }
        },
    );
  },
  { name: "emlak-auth" },
);
