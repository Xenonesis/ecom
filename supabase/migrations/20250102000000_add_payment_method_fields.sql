-- Add payment method fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card' CHECK (payment_method IN ('card', 'upi', 'emi', 'pay_later'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS emi_months INTEGER;