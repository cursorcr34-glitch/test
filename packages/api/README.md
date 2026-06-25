# @rentacar/auth

Shared authentication module for the Rent-A-Car platform.

## Features

- **JWT access tokens** (short-lived) + **refresh token rotation** (server-side sessions)
- **RBAC** with `CUSTOMER`, `STAFF`, and `ADMIN` roles and fine-grained permissions
- **Secure password handling** — bcrypt (12 rounds), strength validation
- **Google OAuth** — sign in / register via Google ID token
- **Session management** — list, revoke individual sessions, logout all devices
- **Fastify plugin** — drop-in `authenticate`, `authorize`, and `requirePermission` guards

## Usage

```typescript
import { loadAuthConfig, authPlugin, authRoutes } from "@rentacar/auth";

const authConfig = loadAuthConfig();

await app.register(authPlugin, { config: authConfig, prisma });
await app.register(authRoutes, { prefix: "/api/auth" });
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | — | Required, min 32 chars |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | Access token TTL |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token / session TTL |
| `BCRYPT_SALT_ROUNDS` | `12` | bcrypt cost factor |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Google OAuth client secret |

## Auth Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register customer account |
| POST | `/login` | — | Email/password login |
| POST | `/oauth/google` | — | Google OAuth login |
| POST | `/refresh` | — | Rotate refresh token |
| POST | `/logout` | — | Revoke session |
| GET | `/me` | JWT | Current profile |
| PATCH | `/me` | JWT | Update profile |
| POST | `/change-password` | JWT | Change password |
| GET | `/sessions` | JWT | List active sessions |
| DELETE | `/sessions/:id` | JWT | Revoke a session |
| POST | `/logout-all` | JWT | Revoke all sessions |
