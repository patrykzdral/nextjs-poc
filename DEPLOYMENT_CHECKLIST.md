# Quick Deployment Checklist

Use this checklist to deploy your application step-by-step.

## Pre-Deployment

- [ ] Read `SUPABASE_DEPLOYMENT_PLAN.md` for full details
- [ ] Ensure all code is working locally
- [ ] All changes committed to Git
- [ ] `.env.local` is in `.gitignore`

## Step 1: Supabase Setup (10 minutes)

- [ ] Go to https://supabase.com and create account
- [ ] Create new project:
  - Name: `nextjs-poc`
  - Generate strong password (save it!)
  - Choose region
- [ ] Wait for project provisioning (2-3 min)
- [ ] Copy connection string from Settings → Database
- [ ] Copy connection pooling URL (Transaction mode)
  ```
  postgresql://postgres:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

## Step 2: Migrate Database (5 minutes)

- [ ] Update `.env.local` with Supabase pooling URL:
  ```env
  DATABASE_URL=postgresql://postgres:[PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```

- [ ] Push schema to Supabase:
  ```bash
  npm run db:push
  ```

- [ ] Verify in Supabase Studio:
  - Go to Table Editor
  - Check `items` table exists

- [ ] Test locally:
  ```bash
  npm run dev
  # Visit http://localhost:3000
  # Test CRUD operations
  ```

## Step 3: GitHub Setup (5 minutes)

- [ ] Create GitHub repository at https://github.com/new
  - Repository name: `nextjs-poc`
  - Visibility: Public or Private

- [ ] Push code to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR-USERNAME/nextjs-poc.git
  git branch -M main
  git push -u origin main
  ```

- [ ] Verify code is on GitHub

## Step 4: Vercel Deployment (5 minutes)

- [ ] Go to https://vercel.com
- [ ] Sign up/Login with GitHub
- [ ] Click "Add New Project"
- [ ] Import your GitHub repository
- [ ] Add Environment Variables:
  - Name: `DATABASE_URL`
  - Value: Your Supabase connection string (with pooling)
  - Environment: Production, Preview, Development

- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 min)

## Step 5: Testing (5 minutes)

- [ ] Open deployed URL: `https://your-project.vercel.app`
- [ ] Test functionality:
  - [ ] View items page loads
  - [ ] Create new item works
  - [ ] Delete item works
  - [ ] Validation works (try short name)
  - [ ] Duplicate name prevention works
- [ ] Check data persists in Supabase:
  - Open Supabase Studio
  - View items table
  - Confirm items created via app are visible

## Step 6: Post-Deployment Setup (10 minutes)

- [ ] Enable Vercel Analytics (optional):
  - Project Settings → Analytics → Enable

- [ ] Set up deployment notifications:
  - Project Settings → Integrations → Slack/Discord

- [ ] Configure domain (optional):
  - Settings → Domains → Add custom domain

- [ ] Set up monitoring:
  - [ ] Supabase: Enable email notifications
  - [ ] Vercel: Monitor deployment status

## Verification Checklist

Test your production site:

- [ ] Homepage loads without errors
- [ ] Can view existing items
- [ ] Can create new items
- [ ] Validation errors display correctly
- [ ] Can delete items
- [ ] Data persists after page refresh
- [ ] HTTPS is enabled (automatic on Vercel)
- [ ] Mobile view works

## Common Issues & Quick Fixes

### "Database connection failed"
```bash
# Check environment variable in Vercel
# Go to Settings → Environment Variables
# Verify DATABASE_URL is correct
# Redeploy: Deployments → Three dots → Redeploy
```

### "Permission denied on schema public"
```bash
# Use direct connection (not pooled) for db:push
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres npm run db:push
```

### "Build failed on Vercel"
```bash
# Check build logs in Vercel dashboard
# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check environment variables are set
# 3. Try: npm run build locally first
```

## Continuous Deployment

After initial setup, future deployments are automatic:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys! 🎉
# Check deployment at https://vercel.com/dashboard
```

## Rollback If Needed

If something breaks:

1. **Vercel**:
   - Go to Deployments
   - Find last working version
   - Click "Promote to Production"

2. **Database**:
   - Supabase Dashboard → Database → Backups
   - Restore from backup

## Success Criteria

Your deployment is successful when:

✅ App is accessible via Vercel URL
✅ All CRUD operations work
✅ Data persists in Supabase
✅ No console errors
✅ Validation rules work
✅ HTTPS is enabled
✅ Mobile responsive

## Next Session: Authentication

After deployment works, consider adding:
- [ ] User authentication (Supabase Auth)
- [ ] User-specific items
- [ ] Authorization rules
- [ ] Social login (Google, GitHub)

## Time Estimate

- **First-time setup**: ~40 minutes
- **Future deployments**: Automatic (Git push)
- **Rollback**: ~2 minutes

---

**Note**: Keep your Supabase password secure! Store it in a password manager.

**Support**: Check `SUPABASE_DEPLOYMENT_PLAN.md` for detailed troubleshooting.
