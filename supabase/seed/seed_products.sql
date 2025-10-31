-- Seed data for E-Commerce Platform
-- This file contains sample data for testing

-- Note: This assumes you have already run schema.sql

-- Insert sample users (these will need actual auth.users entries first)
-- For now, we'll use placeholder UUIDs that you should replace with actual user IDs after signup

-- Sample products
INSERT INTO products (id, seller_id, name, description, category, price, discount, stock, images, rating) VALUES
  (gen_random_uuid(), NULL, 'Wireless Bluetooth Headphones', 'High-quality wireless headphones with noise cancellation and 30-hour battery life', 'Electronics', 149.99, 15, 50, ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'], 4.5),
  (gen_random_uuid(), NULL, 'Smart Watch Pro', 'Advanced fitness tracker with heart rate monitor, GPS, and water resistance', 'Electronics', 299.99, 20, 30, ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800'], 4.7),
  (gen_random_uuid(), NULL, 'Laptop Backpack', 'Durable water-resistant laptop backpack with USB charging port', 'Accessories', 49.99, 10, 100, ARRAY['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'], 4.3),
  (gen_random_uuid(), NULL, 'Mechanical Keyboard RGB', 'Gaming mechanical keyboard with customizable RGB lighting', 'Electronics', 89.99, 0, 75, ARRAY['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800'], 4.6),
  (gen_random_uuid(), NULL, 'Wireless Mouse', 'Ergonomic wireless mouse with 6 programmable buttons', 'Electronics', 39.99, 5, 120, ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800'], 4.4),
  (gen_random_uuid(), NULL, 'USB-C Hub Adapter', '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader', 'Accessories', 34.99, 0, 85, ARRAY['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800'], 4.2),
  (gen_random_uuid(), NULL, 'Portable SSD 1TB', 'Ultra-fast portable solid state drive with USB-C', 'Electronics', 129.99, 25, 40, ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'], 4.8),
  (gen_random_uuid(), NULL, 'Webcam 1080p HD', 'Full HD webcam with auto-focus and built-in microphone', 'Electronics', 69.99, 15, 60, ARRAY['https://images.unsplash.com/photo-1589739900243-f78675d282cf?w=800'], 4.5),
  (gen_random_uuid(), NULL, 'Monitor Stand Riser', 'Wooden monitor stand with storage compartments', 'Accessories', 29.99, 0, 90, ARRAY['https://images.unsplash.com/photo-1616627577184-be2c29b5d4b5?w=800'], 4.1),
  (gen_random_uuid(), NULL, 'Phone Stand Holder', 'Adjustable aluminum phone and tablet stand', 'Accessories', 19.99, 10, 150, ARRAY['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800'], 4.0),
  (gen_random_uuid(), NULL, 'LED Desk Lamp', 'Touch control LED desk lamp with wireless charging', 'Home & Living', 44.99, 5, 70, ARRAY['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'], 4.4),
  (gen_random_uuid(), NULL, 'Cable Organizer Set', 'Premium cable management system for desk setup', 'Accessories', 24.99, 0, 200, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], 4.3),
  (gen_random_uuid(), NULL, 'Wireless Charger Pad', 'Fast wireless charging pad for smartphones', 'Electronics', 29.99, 20, 110, ARRAY['https://images.unsplash.com/photo-1591290619762-d71b5b373e5d?w=800'], 4.2),
  (gen_random_uuid(), NULL, 'Noise Cancelling Earbuds', 'True wireless earbuds with active noise cancellation', 'Electronics', 179.99, 15, 45, ARRAY['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800'], 4.6),
  (gen_random_uuid(), NULL, 'Portable Power Bank 20000mAh', 'High capacity power bank with fast charging', 'Electronics', 54.99, 10, 80, ARRAY['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'], 4.5),
  (gen_random_uuid(), NULL, 'Gaming Mouse Pad XL', 'Extra large gaming mouse pad with anti-slip base', 'Accessories', 19.99, 0, 130, ARRAY['https://images.unsplash.com/photo-1616627577184-be2c29b5d4b5?w=800'], 4.2),
  (gen_random_uuid(), NULL, 'Desk Organizer Tray', 'Bamboo desk organizer with multiple compartments', 'Accessories', 34.99, 5, 95, ARRAY['https://images.unsplash.com/photo-1584556326561-c8746083993b?w=800'], 4.3),
  (gen_random_uuid(), NULL, 'Laptop Cooling Pad', 'Adjustable laptop cooling pad with 5 quiet fans', 'Accessories', 39.99, 10, 65, ARRAY['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800'], 4.1),
  (gen_random_uuid(), NULL, 'HDMI Cable 4K 6ft', 'Premium high-speed HDMI cable 4K 60Hz', 'Accessories', 14.99, 0, 180, ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'], 4.4),
  (gen_random_uuid(), NULL, 'Bluetooth Speaker Portable', 'Waterproof portable Bluetooth speaker with 12h battery', 'Electronics', 59.99, 20, 55, ARRAY['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'], 4.7);

-- Note: To add reviews, orders, cart items, and wishlist items, 
-- users must first be created through the signup process
