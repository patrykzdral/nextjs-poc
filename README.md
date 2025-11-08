# Next.js POC - Full Stack Application

A production-ready Next.js application with PostgreSQL backend, clean architecture, and use case pattern implementation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your database credentials

# Set up database (local PostgreSQL)
./scripts/setup-database.sh

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Visit http://localhost:3000

## 📚 Documentation

### Setup & Configuration
- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Local PostgreSQL setup guide
- **[SETUP_COMPLETE.md](./SETUP_COMPLETE.md)** - What's currently working

### Deployment
- **[SUPABASE_DEPLOYMENT_PLAN.md](./SUPABASE_DEPLOYMENT_PLAN.md)** - Complete deployment guide (40 min)
- **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step checklist
- **[DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)** - Architecture diagrams & scalability

## 🏗️ Architecture

```
Frontend (React/Next.js)
    ↓
API Routes (Next.js API)
    ↓
Use Cases (Business Logic)
    ↓
Repository (Data Access)
    ↓
Drizzle ORM
    ↓
PostgreSQL Database
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **Next.js API Routes** - RESTful API
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe ORM
- **Clean Architecture** - Use cases & repository pattern

### Deployment (Planned)
- **Vercel** - Hosting & CI/CD
- **Supabase** - Managed PostgreSQL

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── items/
│   │       ├── route.ts              # GET, POST /api/items
│   │       └── [id]/route.ts         # GET, DELETE /api/items/:id
│   ├── layout.tsx
│   └── page.tsx                      # Main UI
│
├── lib/
│   ├── db/
│   │   ├── schema.ts                 # Database schema
│   │   └── index.ts                  # Database connection
│   │
│   ├── repositories/
│   │   └── item.repository.ts        # Data access layer
│   │
│   └── use-cases/
│       ├── types.ts                  # Use case interfaces
│       ├── get-all-items.use-case.ts
│       ├── get-item-by-id.use-case.ts
│       ├── create-item.use-case.ts
│       ├── delete-item.use-case.ts
│       └── index.ts
│
├── scripts/
│   └── setup-database.sh             # Database setup automation
│
├── drizzle.config.ts                 # Drizzle configuration
├── package.json
└── tsconfig.json
```

## ✨ Features

### Current Features ✅
- **CRUD Operations** - Create, Read, Update, Delete items
- **Validation** - Input validation with error messages
  - Name: 3-100 characters
  - Description: 10-500 characters
- **Business Rules** - Duplicate name prevention
- **Error Handling** - Proper HTTP status codes
- **Type Safety** - Full TypeScript coverage
- **Clean Architecture** - Separation of concerns
- **Database Persistence** - PostgreSQL with Drizzle ORM
- **Responsive UI** - Mobile-friendly design
- **Dark Mode Support** - Automatic theme detection

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items with optional sorting |
| GET | `/api/items/:id` | Get single item by ID |
| POST | `/api/items` | Create new item |
| DELETE | `/api/items/:id` | Delete item by ID |

### Query Parameters

**GET /api/items**:
- `sortBy` - Sort by field (`name` | `createdAt`)
- `sortOrder` - Sort direction (`asc` | `desc`)

Example: `/api/items?sortBy=name&sortOrder=desc`

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:push      # Push schema to database (dev)
npm run db:generate  # Generate migration files
npm run db:migrate   # Run migrations
npm run db:studio    # Open Drizzle Studio (GUI)
```

## 🧪 Testing the API

### Create Item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "This is a test item description"
  }'
```

### Get All Items
```bash
curl http://localhost:3000/api/items
```

### Get Single Item
```bash
curl http://localhost:3000/api/items/{uuid}
```

### Delete Item
```bash
curl -X DELETE http://localhost:3000/api/items/{uuid}
```

## 🎯 Business Logic

### Validation Rules
- **Name**:
  - Required
  - 3-100 characters
  - Cannot be duplicate
- **Description**:
  - Required
  - 10-500 characters

### Error Handling
- `400` - Validation errors
- `404` - Item not found
- `422` - Business rule violations
- `500` - Server errors

## 🚀 Deployment

Ready to deploy? Follow these guides:

1. **Quick Start**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
2. **Full Guide**: [SUPABASE_DEPLOYMENT_PLAN.md](./SUPABASE_DEPLOYMENT_PLAN.md)
3. **Architecture**: [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)

**Estimated Time**: 30-40 minutes for first deployment

**Target Stack**:
- 🔵 Vercel (Frontend & API)
- 🟢 Supabase (PostgreSQL Database)

## 📊 Database Schema

### Items Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() |
| name | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, DEFAULT now() |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT now() |

## 🔐 Environment Variables

### Required
```env
DATABASE_URL=postgresql://user:password@host:port/database
```

### For Production (Supabase)
```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## 🎨 UI Features

- Responsive design (mobile-first)
- Dark mode support
- Real-time validation feedback
- Loading states
- Error messages
- Success notifications

## 📈 Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] Basic CRUD operations
- [x] PostgreSQL integration
- [x] Use case architecture
- [x] Input validation
- [x] Error handling
- [x] Responsive UI

### Phase 2: Deployment (In Progress)
- [ ] Deploy to Vercel
- [ ] Connect to Supabase
- [ ] Set up CI/CD
- [ ] Configure custom domain

### Phase 3: Authentication (Planned)
- [ ] User registration/login
- [ ] Supabase Auth integration
- [ ] Protected routes
- [ ] User-specific items

### Phase 4: Advanced Features (Future)
- [ ] Pagination
- [ ] Full-text search
- [ ] Item categories
- [ ] File uploads
- [ ] Real-time updates
- [ ] Analytics

## 🤝 Contributing

This is a POC project. To extend it:

1. Clone the repository
2. Create a feature branch
3. Follow the existing architecture patterns
4. Add use cases in `lib/use-cases/`
5. Update repository in `lib/repositories/`
6. Create/update API routes in `app/api/`

## 📝 License

MIT

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database ORM: [Drizzle](https://orm.drizzle.team/)
- Styling: [Tailwind CSS](https://tailwindcss.com/)
- Deployment guides for [Vercel](https://vercel.com/) & [Supabase](https://supabase.com/)

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Last Updated**: November 2025

Need help? Check the documentation files or open an issue!
