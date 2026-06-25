# @emlak/db

PostgreSQL database layer for the Emlak (Azerbaijan real estate) platform.

## Schema overview

| Model | Purpose |
|-------|---------|
| `User` | Auth accounts with RBAC (`BUYER`, `SELLER`, `AGENT`, `ADMIN`) |
| `AgentProfile` | Extended agent metadata (license, bio AZ/EN/RU, agency) |
| `District` | Launch districts with multilingual names and map coordinates |
| `Property` | Sale/rent listings with filters: district, price, rooms, type |
| `PropertyPhoto` | Listing gallery images |
| `Amenity` / `PropertyAmenity` | Amenities (parking, elevator, sea view, etc.) |
| `FloorPlan` | Floor plan images per listing |
| `Inquiry` | Lead submissions with lifecycle status |
| `InquiryStatusHistory` | Audit trail for inquiry state transitions |
| `Favorite` | User saved properties (mobile + web sync) |

## Search indexes

Composite indexes on `properties` support customer filters and admin analytics:

- `(listing_type, status)` — sale vs rent browse
- `district_id`, `price`, `rooms`, `property_type` — filter queries
- `(status, published_at DESC)` — recent active listings
- `(latitude, longitude)` — map clustering
- `inquiries(status, created_at DESC)` — dashboard conversion metrics

## Setup

```bash
cp packages/db/.env.example packages/db/.env
# Edit DATABASE_URL

npm install
npm run db:migrate:deploy   # production / CI
npm run db:seed             # demo data
```

Development (creates migration if schema changes):

```bash
npm run db:migrate
```

## Demo seed data

- **6 districts**: Nərimanov, Yasamal, Xətai, Səbail, Badamdar, Gəncə
- **10 amenities** with AZ/EN/RU labels
- **8 properties** (sale/rent, multiple types, 1 sold for analytics)
- **4 users** — password `password123` (SHA256 demo hash; replace in auth layer)

| Email | Role |
|-------|------|
| admin@emlak.az | ADMIN |
| agent@emlak.az | AGENT |
| seller@emlak.az | SELLER |
| buyer@emlak.az | BUYER |

## Usage in API

```typescript
import { prisma, UserRole, ListingType } from "@emlak/db";

const listings = await prisma.property.findMany({
  where: {
    status: "ACTIVE",
    listingType: ListingType.SALE,
    district: { slug: "narimanov" },
    price: { gte: 100000, lte: 500000 },
    rooms: { gte: 2 },
  },
  include: { photos: true, district: true, amenities: { include: { amenity: true } } },
});
```
