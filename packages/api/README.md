# @emlak/api

Shared authentication module for the Emlak real estate platform.

## Features

- **JWT authentication** — short-lived access tokens (15m) with typed payloads
- **Session management** — refresh token rotation with server-side session store
- **RBAC** — buyer, seller, agent, and admin role permissions
- **Secure passwords** — bcrypt hashing (12 rounds) with strength validation
- **Google OAuth** — sign in / register via Google ID token
- **Fastify integration** — plugin with `authenticate`, `authorize`, and `requirePermission` guards

## Usage

```typescript
import Fastify from "fastify";
import { prisma } from "@emlak/db";
import { authPlugin, authRoutes, loadAuthConfig } from "@emlak/api";

const app = Fastify();
const authConfig = loadAuthConfig();

await app.register(authPlugin, { config: authConfig, prisma });
await app.register(authRoutes, { prefix: "/api/auth" });
```

## Auth Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register buyer/seller/agent |
| POST | `/login` | — | Email/password login |
| POST | `/oauth/google` | — | Google OAuth login/register |
| POST | `/refresh` | — | Rotate refresh token |
| POST | `/logout` | — | Revoke session |
| GET | `/me` | JWT | Get current user profile |
| PATCH | `/me` | JWT | Update profile |
| POST | `/change-password` | JWT | Change password |
| GET | `/sessions` | JWT | List active sessions |
| DELETE | `/sessions/:id` | JWT | Revoke a session |
| POST | `/logout-all` | JWT | Revoke all sessions |

## RBAC Roles

- **BUYER** — browse, inquire, favorites
- **SELLER** — buyer + manage own listings
- **AGENT** — seller + assigned inquiries, agent profile, analytics
- **ADMIN** — full platform access

## Environment

See `.env.example` for required variables.
