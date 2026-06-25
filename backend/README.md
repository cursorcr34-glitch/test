# Emlak Backend API

REST API for the Azerbaijan Real Estate (Emlak) platform.

## Stack

- **Fastify 5** with TypeScript
- **PostgreSQL** with **Prisma ORM**
- **JWT** authentication with RBAC (buyer, seller, agent, admin)
- **Zod** validation

## Quick Start

```bash
# Start PostgreSQL
docker compose up -d

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate Prisma client and push schema
npm run db:generate
npm run db:push

# Seed sample data
npm run db:seed

# Start dev server
npm run dev
```

API runs at `http://localhost:3001`.

## API Endpoints

### Auth (`/api/auth`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | — | Register (buyer/seller/agent) |
| POST | `/login` | — | Login, returns JWT |
| GET | `/me` | JWT | Current user profile |

### Properties (`/api/properties`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | Search/filter listings |
| GET | `/:id` | — | Property detail |
| POST | `/` | Seller/Agent/Admin | Create listing |
| PATCH | `/:id` | Seller/Agent/Admin | Update listing |
| DELETE | `/:id` | Seller/Admin | Delete listing |

**Search filters:** `listingType`, `propertyType`, `district`, `minPrice`, `maxPrice`, `minRooms`, `maxRooms`, `page`, `limit`, `sortBy`, `sortOrder`, `locale`

### Inquiries (`/api/inquiries`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/` | Optional JWT | Submit inquiry |
| GET | `/` | Agent/Admin | List all inquiries |
| GET | `/mine` | JWT | User's inquiries |
| GET | `/:id` | Agent/Admin | Inquiry detail |
| PATCH | `/:id/status` | Agent/Admin | Update lifecycle status |

### Favorites (`/api/favorites`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | JWT | List favorites |
| POST | `/` | JWT | Add favorite |
| DELETE | `/:propertyId` | JWT | Remove favorite |
| GET | `/check/:propertyId` | JWT | Check if favorited |

### Districts (`/api/districts`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | All districts with listing counts |
| GET | `/:slug` | — | District detail |

### Agents (`/api/agents`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | — | List agents |
| GET | `/:id` | — | Agent profile |
| POST | `/` | Admin | Create agent |
| PATCH | `/:id` | Admin/Agent | Update agent |
| DELETE | `/:id` | Admin | Deactivate agent |

### Analytics (`/api/analytics`)
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | Agent/Admin | Sales stats & lead conversion |
| GET | `/heatmap` | Agent/Admin | District heatmap data |

## Test Accounts

After seeding (password: `password123`):

| Role | Email |
|------|-------|
| Admin | admin@emlak.az |
| Seller | seller@emlak.az |
| Agent | agent@emlak.az |
| Buyer | buyer@emlak.az |

## Districts

Nərimanov, Yasamal, Xətai, Səbail, Badamdar, Gəncə

## Multi-language

Pass `locale=AZ|EN|RU` query param on property and district endpoints for localized content.
