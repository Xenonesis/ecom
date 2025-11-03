-- Add updated_at column to users table
-- This migration adds proper timestamp tracking for user profile updates

-- Add the updated_at column with default value of NOW()
ALTER TABLE users 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing rows to set updated_at to created_at initially
UPDATE users 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at on any UPDATE
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON COLUMN users.updated_at IS 'Timestamp of last profile update, automatically maintained by trigger';
