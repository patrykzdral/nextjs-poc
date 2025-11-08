#!/bin/bash

# Database setup script for nextjs_poc

echo "Setting up PostgreSQL database..."

# Database configuration
DB_NAME="nextjs_poc"
DB_USER="postgres"
SUPERUSER="patrykzdral"  # Your superuser account

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
echo "Creating database if it doesn't exist..."
psql -U "$SUPERUSER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    psql -U "$SUPERUSER" -d postgres -c "CREATE DATABASE $DB_NAME;"

# Fix permissions using superuser
echo "Setting up permissions..."
psql -U "$SUPERUSER" -d "$DB_NAME" <<EOF
-- Grant all privileges on schema public to postgres user
GRANT ALL ON SCHEMA public TO $DB_USER;

-- Make postgres the owner of the public schema
ALTER SCHEMA public OWNER TO $DB_USER;

-- Grant all privileges on all tables and sequences
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Set default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\echo 'Permissions configured successfully!'
EOF

echo "Database setup complete!"
echo "You can now run: npm run db:push"
