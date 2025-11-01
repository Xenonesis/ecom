-- Apply missing database migrations
-- Run this in Supabase SQL Editor

-- Fix notifications table: rename 'read' to 'is_read' and add 'updated_at'
ALTER TABLE notifications RENAME COLUMN read TO is_read;
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add theme_preference column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Add payment method fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card' CHECK (payment_method IN ('card', 'upi', 'emi', 'pay_later'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS emi_months INTEGER;

-- Update database types after applying these changes
-- Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts