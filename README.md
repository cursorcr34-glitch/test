# Emlak.az — Real Estate Platform (Frontend)

Premium customer-facing web app for Azerbaijan's real estate market. Built with Next.js 14 App Router, TypeScript, and CSS design tokens.

## Features

- **Browse listings** — Sale/rent properties with district, price, room, and type filters
- **Property detail** — Photo gallery, map, amenities, floor plan, sticky inquiry panel
- **Multi-language** — AZ / EN / RU with locale switcher
- **Auth** — JWT login/register (buyer, seller, agent roles)
- **Favorites** — Saved listings for authenticated users
- **Admin panel** — Listings, inquiries, agents, analytics dashboard with district heatmap
- **Mock data fallback** — Works offline without backend; connects to API when available

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEFAULT_LOCALE=AZ
```

When `NEXT_PUBLIC_API_URL` is set, the app calls the Fastify backend API. Otherwise, mock data is used automatically.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── admin/            # Admin panel (dashboard, listings, inquiries, agents)
│   ├── properties/       # Browse + detail pages
│   ├── login/            # Auth pages
│   └── favorites/
├── components/
│   ├── ui/               # Button, Badge, Input, Skeleton, Empty/Error states
│   ├── layout/           # Navbar, Footer
│   ├── home/             # Hero, Featured, Districts
│   └── property/         # Cards, Filters, Gallery, Map, Inquiry
├── contexts/             # Auth + Locale providers
├── lib/                  # API client, i18n, format, mock data
└── types/                # TypeScript interfaces
```

## Design System

- CSS variables in `globals.css` (primary, surface, accent, success, danger)
- Inter font via `next/font`
- Responsive breakpoints: 375 / 768 / 1024 / 1280
- 44px minimum touch targets
- Loading skeleton, empty, and error states on all data fetches

## Backend Integration

Connect to the Fastify API on branch `cursor/backend-platform-apis-70ea`:

| Endpoint | Description |
|----------|-------------|
| `GET /api/properties` | Search/filter listings |
| `GET /api/properties/:id` | Property detail |
| `POST /api/inquiries` | Submit inquiry |
| `GET /api/districts` | District list |
| `POST /api/auth/login` | Authentication |
| `GET /api/analytics/dashboard` | Admin stats |

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
