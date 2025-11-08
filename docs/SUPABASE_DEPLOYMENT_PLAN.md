# Supabase Deployment Plan

This guide will walk you through deploying your Next.js application with PostgreSQL to Supabase and Vercel.

## Overview

We'll deploy:
- **Database**: Supabase (PostgreSQL with built-in features)
- **Application**: Vercel (Next.js hosting with automatic deployments)

## Phase 1: Supabase Setup

### Step 1.1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended for easier integration)

### Step 1.2: Create New Project
1. Click "New Project"
2. Fill in project details:
   - **Name**: `nextjs-poc` (or your preferred name)
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier (500MB database, 50,000 monthly active users)
3. Click "Create new project"
4. Wait 2-3 minutes for provisioning

### Step 1.3: Get Database Connection String
1. Go to Project Settings (gear icon)
2. Click on "Database" in the sidebar
3. Scroll to "Connection string" section
4. Copy the "Connection string" (URI format)
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 1.4: Configure Connection Pooling (Important!)
For serverless environments like Vercel, use connection pooling:

1. In the same Database settings page
2. Find "Connection pooling" section
3. Copy the "Connection string" with pooling mode
   ```
   postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
4. Mode: Use "Transaction" mode (default)

## Phase 2: Database Migration

### Step 2.1: Update Local Environment
Create a new environment file for Supabase testing:

```bash
cp .env.local .env.supabase
```

Edit `.env.supabase`:
```env
# Supabase Database (with connection pooling for production)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 2.2: Test Connection Locally
```bash
# Temporarily use Supabase URL
cp .env.supabase .env.local

# Push schema to Supabase
npm run db:push

# Verify it worked
npm run db:studio
```

### Step 2.3: Migrate Existing Data (Optional)
If you want to keep your local data:

```bash
# Export data from local database
pg_dump -U postgres -d nextjs_poc --data-only --inserts > data_export.sql

# Import to Supabase (update with your Supabase connection details)
psql "postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres" < data_export.sql
```

Or use Supabase Studio to manually add initial data:
1. Go to your Supabase project
2. Click "Table Editor"
3. Find the "items" table
4. Click "Insert row" to add sample data

### Step 2.4: Verify Database Schema
1. Open Supabase Studio (https://app.supabase.com)
2. Go to "Table Editor"
3. Verify the "items" table exists with correct columns:
   - id (uuid, primary key)
   - name (text)
   - description (text)
   - created_at (timestamp)
   - updated_at (timestamp)

## Phase 3: Application Configuration

### Step 3.1: Update Environment Variables
Create `.env.local` for local development:
```env
# Local development - use Supabase
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

Create `.env.production` (for reference only):
```env
# Production - will be set in Vercel
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

### Step 3.2: Test Locally with Supabase
```bash
# Kill current dev server
# (Find and kill process on port 3000)

# Start dev server with Supabase
npm run dev

# Test in browser: http://localhost:3000
# Try creating, viewing, and deleting items
```

### Step 3.3: Update .gitignore
Ensure sensitive files are ignored:
```bash
echo ".env.local" >> .gitignore
echo ".env.supabase" >> .gitignore
echo ".env.production" >> .gitignore
echo "data_export.sql" >> .gitignore
```

## Phase 4: Vercel Deployment

### Step 4.1: Prepare for Deployment
1. Commit your changes:
```bash
git add .
git commit -m "Configure for Supabase deployment"
```

2. Push to GitHub:
```bash
# If not already on GitHub, create a new repo:
# 1. Go to https://github.com/new
# 2. Create a new repository (e.g., "nextjs-poc")
# 3. Follow instructions to push existing repository

git remote add origin https://github.com/YOUR-USERNAME/nextjs-poc.git
git branch -M main
git push -u origin main
```

### Step 4.2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 4.3: Configure Environment Variables in Vercel
1. Before deploying, expand "Environment Variables"
2. Add the following:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Production, Preview, Development |

3. Click "Deploy"
4. Wait 2-3 minutes for deployment

### Step 4.4: Verify Deployment
1. Once deployed, Vercel will provide a URL: `https://your-project.vercel.app`
2. Visit the URL
3. Test all functionality:
   - View items
   - Create new items
   - Delete items
   - Check validation works

## Phase 5: Post-Deployment

### Step 5.1: Set Up Custom Domain (Optional)
1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions

### Step 5.2: Monitor and Optimize

#### Enable Supabase Monitoring
1. Go to Supabase Dashboard
2. Navigate to "Database" → "Roles"
3. Check connection pooler status
4. Monitor query performance in "Database" → "Query Performance"

#### Configure Supabase Settings (Optional)
1. **Connection Limits**: Adjust if needed
   - Default is usually sufficient
   - Monitor in Database settings

2. **Row Level Security** (for future auth):
   - Go to Authentication → Policies
   - Set up RLS when adding user authentication

3. **Backups**:
   - Free tier: Point-in-time recovery (7 days)
   - Pro tier: Daily backups + point-in-time recovery

### Step 5.3: Set Up Monitoring & Alerts

#### Vercel
1. Go to Project Settings → Integrations
2. Add integrations:
   - Slack (deployment notifications)
   - GitHub (automatic deployments)

#### Supabase
1. Go to Project Settings → Email notifications
2. Enable alerts for:
   - Database size warnings
   - Connection pool saturation
   - CPU usage spikes

## Phase 6: Continuous Deployment

### Automatic Deployments
Vercel automatically deploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel automatically builds and deploys
# Preview URLs are created for pull requests
```

### Environment-Specific Deployments

**Development Branch**:
```bash
git checkout -b development
# Make changes
git push origin development
# Creates preview deployment
```

**Production**:
```bash
git checkout main
git merge development
git push origin main
# Deploys to production
```

## Troubleshooting

### Connection Pool Issues
**Error**: "Connection pool exhausted"

**Solution**:
1. Check connection string uses pooling URL
2. Increase pool size in Supabase:
   - Go to Database Settings
   - Increase "Pool size" (if on paid plan)
3. Optimize queries to close connections faster

### Build Failures on Vercel
**Error**: "DATABASE_URL environment variable is not set"

**Solution**:
1. Verify environment variable is set in Vercel
2. Check the value is correct (no extra spaces)
3. Redeploy: Settings → Deployments → Redeploy

### Database Migration Issues
**Error**: Permission denied

**Solution**:
```bash
# Use direct connection (not pooled) for migrations
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres npm run db:push
```

### Slow Query Performance
1. Check Supabase Database Advisor
2. Add indexes to frequently queried columns:
```sql
-- Example: Add index on name for faster lookups
CREATE INDEX idx_items_name ON items(name);
```

## Cost Estimation

### Free Tier (Recommended for start)
- **Supabase**:
  - 500 MB database
  - 5 GB bandwidth
  - 50,000 monthly active users
  - 2 GB file storage

- **Vercel**:
  - 100 GB bandwidth
  - Unlimited deployments
  - Automatic HTTPS
  - Edge Functions

### When to Upgrade

**Supabase Pro ($25/month)**:
- 8 GB database
- 250 GB bandwidth
- Daily backups
- No pausing of inactive projects

**Vercel Pro ($20/month)**:
- 1 TB bandwidth
- Advanced analytics
- Team collaboration

## Next Steps

After successful deployment:

1. ✅ Add authentication (Supabase Auth)
2. ✅ Implement user-specific items
3. ✅ Add file uploads (Supabase Storage)
4. ✅ Implement real-time features (Supabase Realtime)
5. ✅ Add API rate limiting
6. ✅ Set up monitoring and logging
7. ✅ Implement caching strategy
8. ✅ Add analytics (Vercel Analytics)

## Security Checklist

Before going live:

- [ ] Database password is strong and secure
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] API routes have proper validation
- [ ] Error messages don't leak sensitive info
- [ ] Rate limiting implemented
- [ ] Database connection pooling enabled
- [ ] Regular backups configured

## Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Drizzle ORM Docs**: https://orm.drizzle.team/docs
- **Supabase Discord**: https://discord.supabase.com
- **Vercel Discord**: https://vercel.com/discord

## Rollback Plan

If issues occur:

1. **Revert Deployment**:
   - Go to Vercel Deployments
   - Find previous working deployment
   - Click "Promote to Production"

2. **Database Rollback** (if needed):
   - Supabase Dashboard → Database → Backups
   - Restore from previous backup
   - Re-run migrations if needed

3. **Switch Back to Local**:
   ```bash
   # Update .env.local to use local PostgreSQL
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_poc

   # Restart dev server
   npm run dev
   ```

---

## Quick Reference Commands

```bash
# Test Supabase connection
psql "YOUR_SUPABASE_CONNECTION_STRING" -c "SELECT 1"

# Push schema to Supabase
npm run db:push

# Open Drizzle Studio
npm run db:studio

# Deploy to Vercel (after Git push)
git push origin main

# View Vercel logs
vercel logs

# Local development
npm run dev
```

Good luck with your deployment! 🚀
