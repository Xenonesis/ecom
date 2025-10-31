# API Documentation

## Overview

This document describes the API endpoints available in the ShopHub e-commerce platform.

## Authentication

All authenticated endpoints require a valid Supabase session. The session is managed automatically by the Supabase client.

## Endpoints

### Payment

#### Create Payment Intent

Creates a Stripe payment intent for checkout.

**Endpoint:** `POST /api/create-payment-intent`

**Request Body:**
```json
{
  "amount": 1000,
  "currency": "inr"
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx"
}
```

**Usage:**
```typescript
const response = await fetch('/api/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: total }),
})
const { clientSecret } = await response.json()
```

### Admin

#### Approve Seller

Approves a pending seller account (Admin only).

**Endpoint:** `POST /api/admin/approve-seller`

**Request Body:**
```json
{
  "sellerId": "uuid-of-seller"
}
```

**Response:**
```json
{
  "success": true
}
```

**Authorization:** Requires admin role

## Database Queries

### Products

#### Get All Products

```typescript
const { data: products } = await supabase
  .from('products')
  .select('*')
  .order('created_at', { ascending: false })
```

#### Get Single Product

```typescript
const { data: product } = await supabase
  .from('products')
  .select('*')
  .eq('id', productId)
  .single()
```

#### Create Product (Seller only)

```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    seller_id: user.id,
    name: 'Product Name',
    description: 'Description',
    category: 'Electronics',
    price: 999.99,
    discount: 10,
    stock: 50,
    images: ['url1', 'url2'],
  })
```

#### Update Product (Seller only)

```typescript
const { error } = await supabase
  .from('products')
  .update({ stock: 45 })
  .eq('id', productId)
  .eq('seller_id', user.id)
```

### Orders

#### Get User Orders

```typescript
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

#### Get Seller Orders

```typescript
const { data: orders } = await supabase
  .from('orders')
  .select('*')
  .eq('seller_id', user.id)
```

#### Create Order

```typescript
const { data, error } = await supabase
  .from('orders')
  .insert({
    user_id: user.id,
    seller_id: sellerId,
    items: cartItems,
    total_amount: total,
    shipping_address: address,
    status: 'pending',
    payment_status: 'unpaid',
  })
```

#### Update Order Status (Seller/Admin only)

```typescript
const { error } = await supabase
  .from('orders')
  .update({ status: 'shipped' })
  .eq('id', orderId)
```

### Reviews

#### Get Product Reviews

```typescript
const { data: reviews } = await supabase
  .from('reviews')
  .select('*, users(name)')
  .eq('product_id', productId)
  .order('created_at', { ascending: false })
```

#### Create Review

```typescript
const { data, error } = await supabase
  .from('reviews')
  .insert({
    user_id: user.id,
    product_id: productId,
    rating: 4.5,
    comment: 'Great product!',
  })
```

### Cart

#### Get User Cart

```typescript
const { data: cartItems } = await supabase
  .from('cart')
  .select('*, products(*)')
  .eq('user_id', user.id)
```

#### Add to Cart

```typescript
const { data, error } = await supabase
  .from('cart')
  .upsert({
    user_id: user.id,
    product_id: productId,
    quantity: quantity,
  })
```

#### Remove from Cart

```typescript
const { error } = await supabase
  .from('cart')
  .delete()
  .eq('user_id', user.id)
  .eq('product_id', productId)
```

### Wishlist

#### Get User Wishlist

```typescript
const { data: wishlist } = await supabase
  .from('wishlist')
  .select('*, products(*)')
  .eq('user_id', user.id)
```

#### Add to Wishlist

```typescript
const { data, error } = await supabase
  .from('wishlist')
  .insert({
    user_id: user.id,
    product_id: productId,
  })
```

### Users

#### Get User Profile

```typescript
const { data: profile } = await supabase
  .from('users')
  .select('*')
  .eq('id', user.id)
  .single()
```

#### Update Profile

```typescript
const { error } = await supabase
  .from('users')
  .update({ name: 'New Name' })
  .eq('id', user.id)
```

## Row Level Security (RLS)

All tables have RLS enabled. Key policies:

- **Products:** Anyone can view, only sellers can create/update/delete their own
- **Orders:** Users can view their own, sellers can view orders they fulfill
- **Reviews:** Anyone can view, users can create/update/delete their own
- **Cart/Wishlist:** Users can only access their own data
- **Users:** Users can view/update their own profile, admins can view all

## Error Handling

All API calls should include error handling:

```typescript
try {
  const { data, error } = await supabase
    .from('products')
    .select('*')
  
  if (error) throw error
  
  // Handle data
} catch (error) {
  console.error('Error:', error)
  // Show user-friendly error message
}
```

## Rate Limiting

Supabase implements automatic rate limiting. For production:
- Consider implementing additional rate limiting
- Use caching for frequently accessed data
- Optimize queries with proper indexes

## Best Practices

1. **Always validate input** on both client and server
2. **Use transactions** for operations affecting multiple tables
3. **Implement optimistic updates** for better UX
4. **Cache frequently accessed data** (products, categories)
5. **Use realtime subscriptions** for live updates when needed
6. **Handle errors gracefully** with user-friendly messages

## Realtime Subscriptions (Optional)

Subscribe to changes in products:

```typescript
const subscription = supabase
  .channel('products')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'products' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## Storage API

Upload product images:

```typescript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`products/${productId}/${file.name}`, file)

const { data: { publicUrl } } = supabase.storage
  .from('product-images')
  .getPublicUrl(data.path)
```

---

For more information, see:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Stripe API](https://stripe.com/docs/api)
