# Fix Supabase Connection - Step by Step

## Problem
Your current connection string uses **direct connection** (port 5432) and the DNS is not resolving.

**Current (incorrect):**
```
postgresql://postgres:bU6FXqBA2Wk7@db.kcdpzymdygejjyyltslr.supabase.co:5432/postgres
```

## Solution
Get the **connection pooling** URL from Supabase.

---

## Step 1: Go to Supabase Dashboard

1. Open https://app.supabase.com
2. Click on your project: **kcdpzymdygejjyyltslr**

## Step 2: Check Project Status

Look at the top of the page:
- ✅ **Green dot** = Project is active and ready
- 🟡 **Yellow/Orange** = Project is still provisioning (wait 2-3 minutes)
- 🔴 **Red/Paused** = Project is paused (click "Restore" button)

**If still provisioning**: Wait and refresh the page every minute

## Step 3: Get Connection Pooling URL

### Visual Guide:

```
┌─────────────────────────────────────────────────┐
│ Supabase Dashboard                              │
│                                                 │
│  1. Click ⚙️ "Settings" (bottom left sidebar)  │
│                                                 │
│  2. Click "Database" in the settings menu       │
│                                                 │
│  3. Scroll down to "Connection string" section  │
│                                                 │
│  4. You'll see tabs: [URI] [Nodejs] [.NET]...  │
│     Click on [URI]                              │
│                                                 │
│  5. Look for dropdown "Mode:"                   │
│     Select "Transaction" (recommended)          │
│     Or "Session"                                │
│                                                 │
│  6. The connection string will look like:       │
│     postgresql://postgres.PROJECT_REF:...       │
│                                                 │
│  7. Click "Copy" button or select and copy      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### What to Look For

The **correct** connection string should have these characteristics:

✅ **Hostname pattern**: `aws-0-[region].pooler.supabase.com`
✅ **Port**: `6543` (not 5432)
✅ **Username format**: `postgres.PROJECT_REF` (with a dot)
✅ **May include**: `?pgbouncer=true` at the end

**Example format:**
```
postgresql://postgres.kcdpzymdygejjyyltslr:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

## Step 4: Update .env.local

Replace your DATABASE_URL in `.env.local`:

```bash
# Open .env.local in your editor
# Replace the entire DATABASE_URL line with the new one

DATABASE_URL=postgresql://postgres.kcdpzymdygejjyyltslr:[YOUR_PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Your password from before:** `bU6FXqBA2Wk7`

So it should look something like:
```
DATABASE_URL=postgresql://postgres.kcdpzymdygejjyyltslr:bU6FXqBA2Wk7@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## Step 5: Test the Connection

Run the test script:

```bash
./scripts/test-supabase-connection.sh
```

**Expected output if successful:**
```
🔍 Testing Supabase Connection...

📡 Testing DNS resolution for: aws-0-us-west-1.pooler.supabase.com
✅ DNS resolution successful

🔌 Testing database connection...
✅ Database connection successful!

📊 Testing table access...
⚠️  'items' table not found (run: npm run db:push)

Connection string format check:
✅ Using connection pooling (correct for production)

Done!
```

## Step 6: Push Schema to Supabase

If connection is successful:

```bash
npm run db:push
```

**Expected output:**
```
[✓] Pulling schema from database...
[✓] Changes applied
```

## Step 7: Verify in Supabase

1. Go back to Supabase Dashboard
2. Click **"Table Editor"** in the left sidebar
3. You should see the **"items"** table

## Step 8: Test Your App

```bash
# Start dev server
npm run dev

# Visit http://localhost:3000
# Try creating an item
# Check Supabase Table Editor to see if it appears
```

---

## Common Issues & Solutions

### Issue 1: DNS Still Not Resolving
**Error:** `ENOTFOUND` or `No answer`

**Solutions:**
1. Wait 5 more minutes (project still provisioning)
2. Check project status in Supabase (may be paused)
3. Verify you copied the entire connection string
4. Try restarting your project in Supabase

### Issue 2: Connection Refused
**Error:** `Connection refused`

**Solutions:**
1. Check you're using port **6543** (pooling), not 5432
2. Verify password is correct
3. Check firewall settings

### Issue 3: Authentication Failed
**Error:** `password authentication failed`

**Solutions:**
1. Double-check password in connection string
2. Get password from Supabase Settings → Database → "Reset database password"
3. Make sure no extra spaces in .env.local

### Issue 4: Still Using Direct Connection
**Warning:** `Using direct connection (port 5432)`

**Solution:**
You grabbed the wrong connection string. Go back to Step 3 and make sure you:
- Selected "Transaction" or "Session" mode
- Copied from the **Connection pooling** section
- The URL includes `.pooler.supabase.com`

---

## Quick Reference

### Where am I now?
```bash
# Check current connection
cat .env.local | grep DATABASE_URL

# Should show: pooler.supabase.com:6543
# Not: supabase.co:5432
```

### Switch back to local
```bash
# If you need to use local database
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nextjs_poc" > .env.local
```

### Switch to Supabase
```bash
# Use the pooling connection string you got from Step 3
echo "DATABASE_URL=postgresql://postgres.PROJECT:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres" > .env.local
```

---

## Screenshots Location Guide

If you're having trouble finding the connection string:

1. **Main Dashboard** → Your project name at top
2. **Left Sidebar** → Scroll to bottom → ⚙️ **Settings**
3. **Settings Page** → Left menu → **Database**
4. **Database Page** → Scroll down → **"Connection string"** heading
5. **Connection String Section** →
   - Tabs at top (select **URI**)
   - Dropdown **Mode** (select **Transaction**)
   - Green button **"Copy"** on the right

---

## Still Having Issues?

1. **Screenshot** the Supabase Database settings page
2. Check the project status indicator (green/yellow/red dot)
3. Verify your project wasn't paused due to inactivity
4. Try creating a new project if this one is corrupted

## Need to Start Over?

If the project is broken:

1. Create a **new** Supabase project
2. Use a simpler name: `nextjs-poc-2`
3. Copy the connection pooling URL immediately
4. Save the password securely
5. Update `.env.local` and test

---

**Last Updated:** November 2025
**Your Project ID:** kcdpzymdygejjyyltslr
