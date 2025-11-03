-- Add visibility field to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'draft'));

-- Add comment
COMMENT ON COLUMN products.visibility IS 'Product visibility: public (visible to all), private (only seller), draft (work in progress)';

-- Update RLS policy for public products - only show public products to non-sellers
DROP POLICY IF EXISTS "Anyone can view products" ON products;

CREATE POLICY "Anyone can view public products" ON products 
FOR SELECT 
USING (
  visibility = 'public' 
  OR auth.uid() = seller_id 
  OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_products_visibility ON products(visibility);
CREATE INDEX IF NOT EXISTS idx_products_seller_visibility ON products(seller_id, visibility);
