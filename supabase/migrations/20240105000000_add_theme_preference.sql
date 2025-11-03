-- Add theme_preference column to users table
ALTER TABLE users ADD COLUMN theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system'));
