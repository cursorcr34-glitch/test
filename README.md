# Rent-A-Car Platform

Full-stack rent-a-car platform with Fastify REST API, PostgreSQL, and Next.js frontend.

## Structure

```
packages/db/     — Prisma schema, migrations, seed data
apps/api/        — Fastify REST API (@rentacar/api)
```

## Quick Start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp packages/db/.env.example packages/db/.env
cp apps/api/.env.example apps/api/.env
```

### 4. Run migrations & seed

```bash
npm run db:migrate
npm run db:seed
```

### 5. Start API server

```bash
npm run dev
```

API runs at `http://localhost:3001`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | — | Health check |
| POST | `/api/auth/register` | — | Register customer |
| POST | `/api/auth/login` | — | Login |
| GET | `/api/auth/me` | JWT | Current user profile |
| PATCH | `/api/auth/me` | JWT | Update profile |
| GET | `/api/locations` | — | List pickup locations |
| GET | `/api/locations/:slug` | — | Location detail |
| GET | `/api/categories` | — | List car categories |
| GET | `/api/cars` | — | Search/filter fleet |
| GET | `/api/cars/popular` | — | Popular cars carousel |
| GET | `/api/cars/:id` | — | Car detail (id or slug) |
| GET | `/api/cars/:id/availability` | — | Check date availability |
| POST | `/api/cars/:id/quote` | — | Price calculator |
| GET | `/api/add-ons` | — | List rental add-ons |
| POST | `/api/bookings` | JWT | Create booking |
| GET | `/api/bookings/mine` | JWT | User's bookings |
| GET | `/api/bookings/:id` | JWT | Booking detail |
| POST | `/api/bookings/:id/cancel` | JWT | Cancel booking |
| POST | `/api/bookings/:id/payment` | JWT | Process payment |
| GET | `/api/admin/bookings` | Staff/Admin | All bookings |
| PATCH | `/api/admin/bookings/:id/status` | Staff/Admin | Update status |

## Search Parameters (`GET /api/cars`)

- `locationId`, `locationSlug` — filter by location
- `categoryId`, `categorySlug` — filter by category
- `pickupDate`, `returnDate` — availability filter
- `transmission`, `fuelType`, `minSeats`, `minPrice`, `maxPrice`
- `search` — make/model text search
- `isPopular`, `ids` (comma-separated for comparison)
- `sort` — `price_asc`, `price_desc`, `year_desc`, `popularity`
- `page`, `limit` — pagination
