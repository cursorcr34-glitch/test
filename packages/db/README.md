# @rentacar/db

PostgreSQL database schema for the Rent-A-Car platform, managed with Prisma.

## Schema Overview

| Domain | Models |
|--------|--------|
| Auth | `User`, `RefreshToken` |
| Locations | `Location` |
| Fleet | `Category`, `Car`, `CarImage`, `CarFeature` |
| Booking | `AddOn`, `Booking`, `BookingAddOn`, `Payment` |

## Setup

```bash
cd packages/db
cp .env.example .env
# Edit DATABASE_URL to point at your PostgreSQL instance

npm install
npm run db:migrate
npm run db:seed
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create and apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run build` | Compile TypeScript exports |

## Usage

```typescript
import { prisma, CarStatus, BookingStatus } from "@rentacar/db";

const availableCars = await prisma.car.findMany({
  where: { status: CarStatus.AVAILABLE },
  include: { category: true, location: true, images: true },
});
```

## Key Indexes

- **Fleet search**: `(status, categoryId, dailyRate)`, `(status, locationId)`, `(isPopular)`
- **Availability**: `(carId, pickupDate, returnDate)` on bookings
- **Account**: `(userId, status)` on bookings
