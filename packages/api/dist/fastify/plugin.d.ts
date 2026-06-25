import type { PrismaClient, UserRole } from "@emlak/db";
import { AuthService, type AuthConfig, type JwtPayload, type Permission } from "../auth";
declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: JwtPayload;
        user: JwtPayload;
    }
}
declare module "fastify" {
    interface FastifyInstance {
        authService: AuthService;
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        authorize: (...roles: UserRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
        requirePermission: (...permissions: Permission[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
export interface AuthPluginOptions {
    config: AuthConfig;
    prisma: PrismaClient;
}
declare const _default: import("fastify").FastifyPluginCallback<AuthPluginOptions, import("fastify").RawServerDefault, import("fastify").FastifyTypeProviderDefault, import("fastify").FastifyBaseLogger>;
export default _default;
//# sourceMappingURL=plugin.d.ts.map