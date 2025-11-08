# Database Setup Guide

This application uses PostgreSQL as the database with Drizzle ORM.

## Prerequisites

- PostgreSQL installed and running on your machine
- Node.js and npm installed

## Setup Steps

### 1. Install PostgreSQL

If you don't have PostgreSQL installed, you can:

**macOS (using Homebrew):**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. Create Database

Connect to PostgreSQL and create a database:

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE nextjs_poc;

# Create user (optional, if you want a specific user)
CREATE USER your_username WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nextjs_poc TO your_username;

# Exit psql
\q
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and update the DATABASE_URL with your credentials:

```
DATABASE_URL=postgresql://username:password@localhost:5432/nextjs_poc
```

Replace:
- `username` with your PostgreSQL username (default: `postgres`)
- `password` with your PostgreSQL password
- `localhost:5432` with your PostgreSQL host and port
- `nextjs_poc` with your database name

### 4. Run Database Migrations

Generate and push the schema to your database:

```bash
# Generate migration files
npm run db:generate

# Push schema to database (creates tables)
npm run db:push
```

Alternatively, you can use:
```bash
# Run migrations
npm run db:migrate
```

### 5. Verify Setup

You can use Drizzle Studio to view your database:

```bash
npm run db:studio
```

This will open a web interface where you can view and manage your database.

## Database Scripts

- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Run pending migrations
- `npm run db:push` - Push schema changes directly to database (development)
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Schema

The application uses the following schema:

**items table:**
- `id` (UUID, primary key) - Auto-generated unique identifier
- `name` (TEXT, required) - Item name
- `description` (TEXT, required) - Item description
- `created_at` (TIMESTAMP, required) - Creation timestamp
- `updated_at` (TIMESTAMP, required) - Last update timestamp

## Troubleshooting

### Connection Issues

If you get connection errors:

1. Verify PostgreSQL is running:
   ```bash
   # macOS/Linux
   pg_isready

   # Or check service status
   brew services list  # macOS
   sudo systemctl status postgresql  # Linux
   ```

2. Check your DATABASE_URL in `.env.local`

3. Verify the database exists:
   ```bash
   psql -l
   ```

### Permission Issues

If you get permission errors, ensure your user has proper privileges:

```sql
GRANT ALL PRIVILEGES ON DATABASE nextjs_poc TO your_username;
GRANT ALL ON SCHEMA public TO your_username;
```

## Production Deployment

For production, use a hosted PostgreSQL service like:
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app)
- [AWS RDS](https://aws.amazon.com/rds/)
- [Google Cloud SQL](https://cloud.google.com/sql)

Update your production environment variables with the connection string provided by your hosting service.
