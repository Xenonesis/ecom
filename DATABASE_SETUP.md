# Database Setup Instructions

## Option 1: Using Supabase Dashboard (Recommended)

### Step 1: Create Tables and Policies

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ekhxvihpelhfnfhvheec`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire content from `supabase/schema.sql`
6. Paste it into the SQL editor
7. Click **Run** to execute

### Step 2: Add Seed Data (Optional)

1. In the SQL Editor, click **New Query**
2. Copy the entire content from `supabase/seed.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute

### Step 3: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. You should see all these tables:
   - users
   - products
   - orders
   - reviews
   - cart
   - wishlist

## Option 2: Using Supabase CLI

### Prerequisites

Install Supabase CLI:
```bash
# Windows (using Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using NPM (if working)
npm install -g supabase
```

### Link Your Project

```bash
# Login to Supabase
supabase login

# Link to your remote project
supabase link --project-ref ekhxvihpelhfnfhvheec

# Push migrations
supabase db push
```

### Run Migrations

```bash
# Execute schema
supabase db execute -f supabase/schema.sql

# Execute seed data
supabase db execute -f supabase/seed.sql
```

## Option 3: Using the API Route (Simplest)

1. Make sure your `.env.local` file has the correct credentials
2. Start your development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000/api/setup-database
   ```
4. This will execute all the setup scripts automatically

## Verify Database Setup

### Check Tables

Run this query in SQL Editor to verify all tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- cart
- orders
- products
- reviews
- users
- wishlist

### Check Row Level Security

Run this to verify RLS is enabled:

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`

### Check Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Check Functions and Triggers

```sql
-- Check functions
SELECT proname 
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace;

-- Check triggers
SELECT tgname, tgrelid::regclass 
FROM pg_trigger 
WHERE tgisinternal = false;
```

## Environment Variables Needed

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ekhxvihpelhfnfhvheec.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-role-key (optional, for admin operations)
```

## Getting Service Role Key

1. Go to Supabase Dashboard
2. Go to **Settings** → **API**
3. Under "Project API keys", copy the `service_role` key
4. Add it to `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Warning**: Never commit the service role key to git!

## Next Steps

After setting up the database:

1. **Test Authentication**: Try signing up a new user
2. **Create Test Data**: Add some products through the seller dashboard
3. **Test Cart**: Add items to cart
4. **Test Orders**: Complete a checkout flow
5. **Test Reviews**: Leave a product review

## Troubleshooting

### Error: "relation already exists"

This means tables already exist. You can either:
1. Drop all tables first (destructive)
2. Modify schema.sql to use `CREATE TABLE IF NOT EXISTS`

### Error: "permission denied"

Make sure you're using the service role key for admin operations, or that RLS policies are correctly set up.

### Error: "function does not exist"

The exec_sql RPC function might not exist. Use the SQL Editor directly instead.

## Database Schema Overview

### Users Table
- Stores user profiles (extends auth.users)
- Roles: customer, seller, admin
- Verified flag for seller approval

### Products Table
- Product catalog
- Managed by sellers
- Supports images, ratings, discounts

### Orders Table
- Customer orders
- Links to users and products
- Tracks payment and shipping status

### Reviews Table
- Product reviews and ratings
- Automatically updates product rating

### Cart Table
- Shopping cart items
- Per-user cart management

### Wishlist Table
- Saved products
- Per-user wishlist management
