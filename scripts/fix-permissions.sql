-- Fix PostgreSQL permissions for the nextjs_poc database

-- Connect to the database first, then run these commands:
-- psql -d nextjs_poc

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE nextjs_poc TO your_username;

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO your_username;

-- Grant all privileges on the public schema
GRANT ALL PRIVILEGES ON SCHEMA public TO your_username;

-- Grant all privileges on all tables in public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_username;

-- Grant all privileges on all sequences in public schema
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_username;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO your_username;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO your_username;

-- Alternative: If you're using the default postgres user, you might need to run:
-- ALTER SCHEMA public OWNER TO your_username;
