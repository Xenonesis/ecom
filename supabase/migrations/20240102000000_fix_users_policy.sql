-- Fix infinite recursion in users table RLS policy
-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view all users" ON users;

-- Recreate with better logic to avoid infinite recursion
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
);
