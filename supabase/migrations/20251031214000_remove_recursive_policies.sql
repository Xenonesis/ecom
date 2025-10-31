-- Remove all policies from users table to fix infinite recursion
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow public user creation" ON public.users;

-- Remove all policies from orders table
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Sellers can view orders for their products" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Sellers can update order status for their products" ON public.orders;

-- Recreate users policies without recursion
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow public user creation"
  ON public.users FOR INSERT
  WITH CHECK (true);

-- Recreate orders policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a function to check if user is admin (to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Create a function to check if user is seller or admin
CREATE OR REPLACE FUNCTION public.is_seller_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('seller', 'admin')
  );
$$;

-- Now add admin policies using the function (no recursion)
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (is_admin());

CREATE POLICY "Sellers can view orders for their products"
  ON public.orders FOR SELECT
  USING (
    is_seller_or_admin() AND auth.uid() = seller_id
  );

CREATE POLICY "Sellers and admins can update order status"
  ON public.orders FOR UPDATE
  USING (
    auth.uid() = seller_id OR is_admin()
  );

COMMENT ON FUNCTION public.is_admin() IS 'Check if current user is admin without causing recursion';
COMMENT ON FUNCTION public.is_seller_or_admin() IS 'Check if current user is seller or admin without causing recursion';
