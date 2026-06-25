# Emlak — Azerbaijan Real Estate Platform

Full-stack real estate marketplace for the Azerbaijan market.

## Project Structure

```
backend/          # Fastify REST API (TypeScript + Prisma + PostgreSQL)
web/              # Customer web app (Next.js) — coming soon
admin/            # Admin panel — coming soon
mobile/           # React Native app — coming soon
```

## Backend API

See [backend/README.md](backend/README.md) for setup and API documentation.

```bash
cd backend
docker compose up -d    # PostgreSQL
npm install
cp .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev             # http://localhost:3001
```

## Features

- Property browse (sale/rent) with district, price, room, and type filters
- Rich property detail pages with photos, map location, amenities, floor plans
- JWT auth with buyer/seller/agent/admin RBAC
- Inquiry lifecycle management
- Favorites sync
- Admin analytics: sales stats, lead conversion, district heatmap
- Multi-language: AZ / EN / RU
- Launch districts: Nərimanov, Yasamal, Xətai, Səbail, Badamdar, Gəncə
