#!/bin/bash

echo "🔍 Testing Supabase Connection..."
echo ""

# Load environment variable
if [ -f .env.local ]; then
    export $(cat .env.local | grep DATABASE_URL | xargs)
else
    echo "❌ .env.local file not found"
    exit 1
fi

# Extract hostname from DATABASE_URL
HOSTNAME=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')

echo "📡 Testing DNS resolution for: $HOSTNAME"
if nslookup $HOSTNAME > /dev/null 2>&1; then
    echo "✅ DNS resolution successful"
else
    echo "❌ DNS resolution failed"
    echo ""
    echo "Possible issues:"
    echo "1. Supabase project is still provisioning (wait 2-3 minutes)"
    echo "2. Project is paused (check Supabase dashboard)"
    echo "3. Wrong connection string (check you're using pooling URL)"
    echo ""
    exit 1
fi

echo ""
echo "🔌 Testing database connection..."

# Test connection with psql
if command -v psql &> /dev/null; then
    if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
        echo "✅ Database connection successful!"
        echo ""
        echo "📊 Testing table access..."
        psql "$DATABASE_URL" -c "\dt" 2>/dev/null | grep items && echo "✅ 'items' table found!" || echo "⚠️  'items' table not found (run: npm run db:push)"
    else
        echo "❌ Database connection failed"
        echo ""
        echo "Possible issues:"
        echo "1. Wrong password in connection string"
        echo "2. Database not ready yet"
        echo "3. Firewall/network issue"
    fi
else
    echo "⚠️  psql not found, skipping connection test"
    echo "   Install PostgreSQL client to test connections"
fi

echo ""
echo "Connection string format check:"
if echo $DATABASE_URL | grep -q "pooler.supabase.com:6543"; then
    echo "✅ Using connection pooling (correct for production)"
elif echo $DATABASE_URL | grep -q "supabase.co:5432"; then
    echo "⚠️  Using direct connection (port 5432)"
    echo "   For production, use connection pooling URL (port 6543)"
else
    echo "❓ Unknown connection format"
fi

echo ""
echo "Done!"
