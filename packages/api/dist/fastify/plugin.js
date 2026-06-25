"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const auth_1 = require("../auth");
exports.default = (0, fastify_plugin_1.default)(async (fastify, { config, prisma }) => {
    await fastify.register(jwt_1.default, {
        secret: config.jwtSecret,
        sign: { expiresIn: config.jwtAccessExpiresIn },
    });
    const authService = new auth_1.AuthService(prisma, config, {
        signAccess: (payload) => fastify.jwt.sign(payload),
    });
    fastify.decorate("authService", authService);
    fastify.decorate("authenticate", async (request, reply) => {
        try {
            await request.jwtVerify();
            if (request.user.type !== "access") {
                return reply.status(401).send({
                    error: "Unauthorized",
                    message: "Invalid token type",
                });
            }
        }
        catch {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Invalid or expired token",
            });
        }
    });
    fastify.decorate("authorize", (...roles) => async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Invalid or expired token",
            });
        }
        if (!(0, auth_1.hasAnyRole)(request.user.role, roles)) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "Insufficient permissions",
            });
        }
    });
    fastify.decorate("requirePermission", (...permissions) => async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch {
            return reply.status(401).send({
                error: "Unauthorized",
                message: "Invalid or expired token",
            });
        }
        const allowed = permissions.some((p) => (0, auth_1.hasPermission)(request.user.role, p));
        if (!allowed) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "Insufficient permissions",
            });
        }
    });
}, { name: "emlak-auth" });
//# sourceMappingURL=plugin.js.map