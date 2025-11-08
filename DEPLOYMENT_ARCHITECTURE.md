# Deployment Architecture

## Current Architecture (Local Development)

```
┌─────────────────────────────────────────────────────────────┐
│  Developer Machine                                          │
│                                                             │
│  ┌──────────────┐         ┌──────────────────────────┐    │
│  │              │         │                          │    │
│  │   Browser    │────────▶│   Next.js Dev Server     │    │
│  │ localhost    │         │   Port 3000              │    │
│  │   :3000      │◀────────│                          │    │
│  │              │         │   - API Routes           │    │
│  └──────────────┘         │   - Use Cases            │    │
│                           │   - Repository Layer     │    │
│                           │   - Drizzle ORM          │    │
│                           └────────────┬─────────────┘    │
│                                        │                   │
│                                        │ PostgreSQL        │
│                                        │ Connection        │
│                                        ▼                   │
│                           ┌──────────────────────────┐    │
│                           │                          │    │
│                           │   PostgreSQL Database    │    │
│                           │   Port 5432              │    │
│                           │   Database: nextjs_poc   │    │
│                           │                          │    │
│                           └──────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Target Architecture (Production with Supabase + Vercel)

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│                         Global CDN Layer                               │
│                                                                        │
│  ┌──────────────┐                                                     │
│  │              │                                                     │
│  │   Browser    │                                                     │
│  │   (Users)    │                                                     │
│  │              │                                                     │
│  └──────┬───────┘                                                     │
│         │                                                             │
│         │ HTTPS                                                       │
│         ▼                                                             │
└─────────┼─────────────────────────────────────────────────────────────┘
          │
          │
┌─────────▼──────────────────────────────────────────────────────────────┐
│                                                                         │
│  Vercel Platform (your-app.vercel.app)                                │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Edge Network (Multiple Regions)                              │   │
│  │                                                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │   │
│  │  │              │  │              │  │              │       │   │
│  │  │  Next.js     │  │  Next.js     │  │  Next.js     │       │   │
│  │  │  Serverless  │  │  Serverless  │  │  Serverless  │       │   │
│  │  │  Function    │  │  Function    │  │  Function    │       │   │
│  │  │              │  │              │  │              │       │   │
│  │  │  US-East     │  │  EU-West     │  │  Asia-Pacific│       │   │
│  │  │              │  │              │  │              │       │   │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │   │
│  │         │                 │                 │                │   │
│  │         └─────────────────┼─────────────────┘                │   │
│  │                           │                                  │   │
│  └───────────────────────────┼──────────────────────────────────┘   │
│                              │                                       │
│  ┌───────────────────────────┼──────────────────────────────────┐   │
│  │  Application Layer        │                                  │   │
│  │                           │                                  │   │
│  │    - API Routes          │                                  │   │
│  │    - Use Cases           │                                  │   │
│  │    - Repository Layer    │                                  │   │
│  │    - Drizzle ORM         │                                  │   │
│  │                           │                                  │   │
│  └───────────────────────────┼──────────────────────────────────┘   │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               │ Connection Pooling
                               │ (PgBouncer)
                               │
┌──────────────────────────────▼───────────────────────────────────────┐
│                                                                       │
│  Supabase Platform (db.xxx.supabase.co)                             │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  Connection Pooler (Port 6543)                                │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────┐        │  │
│  │  │  PgBouncer (Transaction Mode)                    │        │  │
│  │  │  - Manages connection pool                        │        │  │
│  │  │  - Optimized for serverless                       │        │  │
│  │  │  - Handles 1000+ connections                      │        │  │
│  │  └──────────────────┬───────────────────────────────┘        │  │
│  │                     │                                         │  │
│  └─────────────────────┼─────────────────────────────────────────┘  │
│                        │                                            │
│  ┌─────────────────────▼─────────────────────────────────────────┐  │
│  │  PostgreSQL Database (Port 5432)                              │  │
│  │                                                                │  │
│  │  Database: postgres                                           │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Tables                                              │    │  │
│  │  │  - items (id, name, description, timestamps)        │    │  │
│  │  │  - Future: users, sessions, etc.                    │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                                │  │
│  │  ┌──────────────────────────────────────────────────────┐    │  │
│  │  │  Features                                            │    │  │
│  │  │  - Automatic backups                                 │    │  │
│  │  │  - Point-in-time recovery                           │    │  │
│  │  │  - Real-time subscriptions                          │    │  │
│  │  │  - Database branching                               │    │  │
│  │  └──────────────────────────────────────────────────────┘    │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Create Item Request

```
User Browser
     │
     │ POST /api/items
     │ { name: "Item", description: "..." }
     │
     ▼
Vercel Edge (Closest region)
     │
     │ Route to serverless function
     │
     ▼
Next.js API Route (/api/items/route.ts)
     │
     │ Validate input
     │
     ▼
CreateItemUseCase
     │
     │ 1. Validate (3-100 chars)
     │ 2. Check duplicate name
     │
     ▼
ItemRepository
     │
     │ itemRepository.create()
     │
     ▼
Drizzle ORM
     │
     │ INSERT INTO items...
     │
     ▼
Supabase Connection Pooler
     │
     │ Get connection from pool
     │
     ▼
PostgreSQL Database
     │
     │ Execute INSERT
     │ Return new row with UUID
     │
     ▼
Response bubbles back up
     │
     ▼
User Browser
     │
     │ 201 Created
     │ { item: { id: "uuid", ... } }
```

### 2. Get All Items Request

```
User Browser
     │
     │ GET /api/items
     │
     ▼
Vercel CDN (Cached if configured)
     │
     │ If not cached, forward to function
     │
     ▼
Next.js API Route
     │
     ▼
GetAllItemsUseCase
     │
     ▼
ItemRepository
     │
     │ SELECT * FROM items ORDER BY created_at
     │
     ▼
Drizzle ORM → Supabase → PostgreSQL
     │
     ▼
Response with items array
```

## Deployment Flow

```
Developer Machine
     │
     │ git add .
     │ git commit -m "..."
     │ git push origin main
     │
     ▼
GitHub Repository
     │
     │ Webhook triggered
     │
     ▼
Vercel Build System
     │
     ├─▶ Install dependencies (npm install)
     │
     ├─▶ Build Next.js app (npm run build)
     │   │
     │   ├─▶ Compile TypeScript
     │   ├─▶ Bundle client code
     │   ├─▶ Generate serverless functions
     │   └─▶ Optimize assets
     │
     ├─▶ Run checks
     │   │
     │   ├─▶ Type checking
     │   └─▶ Linting
     │
     └─▶ Deploy to Edge Network
         │
         ├─▶ Deploy static assets to CDN
         ├─▶ Deploy serverless functions
         └─▶ Configure routing
              │
              ▼
         Production Live! ✅
              │
              ▼
         Notify via email/Slack
```

## Environment Variables Flow

```
Local Development (.env.local)
     │
     ├─▶ DATABASE_URL=postgresql://localhost...
     └─▶ npm run dev

Production (Vercel Environment Variables)
     │
     ├─▶ DATABASE_URL=postgresql://xxx.supabase.com...
     └─▶ Injected at build time
```

## Security Layers

```
┌────────────────────────────────────────────────┐
│  Layer 1: HTTPS/TLS (Automatic)               │
│  - All traffic encrypted                       │
│  - Managed by Vercel                           │
└────────────────────┬───────────────────────────┘
                     │
┌────────────────────▼───────────────────────────┐
│  Layer 2: Vercel Edge Network                 │
│  - DDoS protection                             │
│  - Rate limiting                               │
│  - Geographic restrictions (optional)          │
└────────────────────┬───────────────────────────┘
                     │
┌────────────────────▼───────────────────────────┐
│  Layer 3: Application Validation              │
│  - Input validation (Use Cases)                │
│  - Business rules enforcement                  │
│  - Type safety (TypeScript)                    │
└────────────────────┬───────────────────────────┘
                     │
┌────────────────────▼───────────────────────────┐
│  Layer 4: Database Security                   │
│  - Connection pooling                          │
│  - Encrypted connections (SSL)                 │
│  - Row Level Security (RLS) - optional         │
│  - Backups & Point-in-time recovery            │
└────────────────────────────────────────────────┘
```

## Scalability

### Current Capacity (Free Tiers)

**Supabase Free**:
- 500 MB database storage
- 5 GB bandwidth/month
- 50,000 monthly active users
- 2 CPU cores
- 1 GB RAM

**Vercel Free**:
- 100 GB bandwidth/month
- Unlimited deployments
- 100 serverless function executions/day
- 10-second function timeout

### Scaling Strategy

```
Traffic Growth:

Small
(0-1k users/day)
     │ Free Tier ✅
     │
     ▼
Medium
(1k-10k users/day)
     │ Supabase Pro ($25/mo)
     │ Vercel Pro ($20/mo)
     │
     ▼
Large
(10k-100k users/day)
     │ Supabase Team ($599/mo)
     │ Vercel Enterprise
     │ Add caching layer (Redis)
     │
     ▼
Very Large
(100k+ users/day)
     │ Supabase Enterprise
     │ Multi-region deployment
     │ CDN optimization
     │ Database read replicas
```

## Monitoring Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Monitoring Stack                                        │
│                                                          │
│  ┌────────────────┐    ┌──────────────────┐            │
│  │  Vercel        │    │  Supabase        │            │
│  │  Analytics     │    │  Dashboard       │            │
│  │                │    │                  │            │
│  │  - Pageviews   │    │  - DB Size       │            │
│  │  - Performance │    │  - Connections   │            │
│  │  - Errors      │    │  - Query perf    │            │
│  │  - Web Vitals  │    │  - Bandwidth     │            │
│  └────────┬───────┘    └────────┬─────────┘            │
│           │                     │                       │
│           └──────────┬──────────┘                       │
│                      │                                  │
│           ┌──────────▼────────────┐                     │
│           │                       │                     │
│           │  Notification System  │                     │
│           │  - Email              │                     │
│           │  - Slack              │                     │
│           │  - Discord            │                     │
│           │                       │                     │
│           └───────────────────────┘                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Backup & Recovery Strategy

```
Production Database (Supabase)
     │
     ├─▶ Automatic Backups (Daily)
     │   └─▶ Retained for 7 days (Free tier)
     │       30 days (Pro tier)
     │
     ├─▶ Point-in-time Recovery
     │   └─▶ Restore to any second within retention
     │
     └─▶ Manual Exports (Optional)
         └─▶ pg_dump for extra safety

Vercel Deployments
     │
     ├─▶ All deployments saved
     │   └─▶ Instant rollback available
     │
     └─▶ Git history
         └─▶ Source code version control
```

## Cost Projection

### Month 1-3 (MVP Launch)
```
Supabase: $0 (Free tier)
Vercel:   $0 (Free tier)
Domain:   $12/year (optional)
─────────────────────
Total:    ~$0-1/month
```

### Month 4-12 (Growth Phase)
```
Supabase Pro: $25/month
Vercel Pro:   $20/month
Domain:       $1/month
─────────────────────
Total:        $46/month
```

### Year 2+ (Scale Phase)
```
Supabase Team: $599/month
Vercel Team:   $20/user/month
CDN/Caching:   $50/month (optional)
────────────────────────────
Total:         $670+/month
```

---

**Last Updated**: November 2025
**Next Review**: After authentication implementation
