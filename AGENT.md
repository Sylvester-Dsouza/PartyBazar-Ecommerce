# PartyBazar E-commerce - MedusaJS Project

## Overview
PartyBazar is an e-commerce platform built on **MedusaJS v2.12.1** with a **Next.js 15** storefront.

> [!CAUTION]
> **DATABASE SAFETY**: NEVER reset or force reset the database. Always review migrations carefully and get user approval before running. This is live production data.

## Tech Stack

| Component | Technology | Details |
|-----------|------------|----------|
| Backend | MedusaJS 2.12.1 | Port 9000, hosted on Railway |
| Admin Dashboard | MedusaJS Admin | Port 9000/app |
| Storefront | Next.js 15 + Tailwind | Port 8000, hosted on Railway |
| Database | PostgreSQL | Hosted on **Supabase** |
| Cache/Queue | Redis | Hosted on Railway |
| Search | MeiliSearch | Hosted on Railway |
| File Storage | Supabase S3 Storage | Supabase bucket |
| Email | Resend + React Email | - |
| Payments | Cashfree | - |

## Project Structure

```
PartyBazar-Ecommerce/
├── backend/                    # MedusaJS 2.x Backend
│   ├── src/
│   │   ├── admin/             # Admin dashboard customizations
│   │   │   ├── widgets/       # Custom admin widgets
│   │   │   └── i18n/          # Internationalization
│   │   ├── api/               # Custom API routes
│   │   │   ├── store/         # Storefront API extensions
│   │   │   └── admin/         # Admin API extensions
│   │   ├── modules/           # Custom modules
│   │   │   └── email-notifications/  # Resend email module
│   │   ├── subscribers/       # Event subscribers
│   │   ├── workflows/         # Custom workflows
│   │   ├── jobs/              # Background jobs
│   │   └── scripts/           # Utility scripts
│   ├── medusa-config.ts       # Main configuration
│   └── package.json
│
└── storefront/                # Next.js 15 Storefront
    ├── src/
    │   ├── app/               # Next.js App Router pages
    │   ├── modules/           # Feature modules
    │   └── lib/               # Utilities and SDK
    └── package.json
```

## Key Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm run dev` | backend/ | Start backend + admin |
| `npm run ib` | backend/ | Initialize database (migrations only) |
| `npm run email:dev` | backend/ | Preview email templates |
| `npm run dev` | storefront/ | Start storefront |

> **Note:** We use live data - no seeding to database.

> [!IMPORTANT]
> **SERVERS RUNNING MANUALLY**: The user runs backend and storefront servers manually. Do NOT run `npm run dev` or `npm run build` commands to start servers. The user will handle server management.

## Conventions

### Backend (MedusaJS 2.x)
- **API Routes**: `src/api/{store|admin}/[endpoint]/route.ts`
- **Admin Widgets**: `src/admin/widgets/[name].tsx`
- **Custom Modules**: `src/modules/[module-name]/`
- **Subscribers**: `src/subscribers/[name].ts`
- **Workflows**: `src/workflows/[name]/`

### Storefront (Next.js 15)
- Uses **App Router** with React Server Components
- Styled with **Tailwind CSS**
- Uses `@medusajs/js-sdk` for API calls
- Components from `@medusajs/ui`

## Environment Variables

### Backend (.env)
- `DATABASE_URL` - Supabase PostgreSQL connection
- `REDIS_URL` - Redis connection (Railway)
- `JWT_SECRET`, `COOKIE_SECRET` - Auth secrets
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL` - Email
- `CASHFREE_*` - Cashfree payment credentials
- `S3_*` - Supabase S3 storage credentials
- `MEILISEARCH_*` - Search (Railway)

### Storefront (.env.local)
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Backend URL
- `NEXT_PUBLIC_BASE_URL` - Storefront URL
