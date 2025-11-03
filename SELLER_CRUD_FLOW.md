# Seller Product CRUD - Flow Diagram

## Complete Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SELLER DASHBOARD                             │
│                      /seller/products (SSR)                          │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │  CREATE  │  │  UPDATE  │  │  DELETE  │
         └──────────┘  └──────────┘  └──────────┘
```

## 1. CREATE Flow

```
User clicks "Add New Product"
         │
         ▼
/seller/products/new (Client Component)
         │
         ├─► User fills form:
         │   • Name *
         │   • Description *
         │   • Category * (dropdown)
         │   • Price *
         │   • Discount
         │   • Stock *
         │   • Images (comma-separated URLs)
         │
         ├─► User clicks "Create Product"
         │
         ▼
POST /api/products
         │
         ├─► Validates authentication
         ├─► Checks seller role & verified status
         ├─► Sets seller_id automatically
         ├─► Database RLS policy enforces ownership
         │
         ▼
Product created ✅
         │
         ▼
Redirect to /seller/products
```

## 2. READ Flow

### List Products
```
User navigates to /seller/products
         │
         ▼
Server fetches products (SSR)
         │
         ├─► SELECT * FROM products
         │   WHERE seller_id = current_user
         │   ORDER BY created_at DESC
         │
         ▼
Display products in cards
         │
         ├─► Product name, category, description
         ├─► Price, discount, stock, rating
         ├─► Edit & Delete buttons
```

### Single Product
```
User clicks "Edit" button
         │
         ▼
/seller/products/[id]/edit
         │
         ▼
GET /api/products?id={productId}
         │
         ├─► Fetch product by ID
         ├─► Database RLS ensures ownership
         │
         ▼
Display product in edit form
```

## 3. UPDATE Flow

```
User on /seller/products/[id]/edit
         │
         ├─► Form pre-populated with existing data
         │
         ├─► User modifies fields
         │
         ├─► User clicks "Update Product"
         │
         ▼
PATCH /api/products
         │
         ├─► Validates authentication
         ├─► Validates seller_id matches
         ├─► Database RLS policy enforces ownership
         │
         ▼
Product updated ✅
         │
         ▼
Redirect to /seller/products
```

## 4. DELETE Flow

```
User clicks Delete (trash icon)
         │
         ▼
Confirmation Dialog opens
         │
         ├─► "Are you sure you want to delete [Product Name]?"
         │
         ├─► User clicks "Cancel" → Dialog closes
         │
         ├─► User clicks "Delete" ──┐
         │                          │
         ▼                          ▼
                        DELETE /api/products?id={productId}
                                   │
                                   ├─► Validates authentication
                                   ├─► Validates seller_id matches
                                   ├─► Database RLS policy enforces ownership
                                   │
                                   ▼
                        Product deleted ✅
                                   │
                                   ▼
                        Page refreshes (router.refresh())
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Client-Side Validation                            │
│  • Required field checks                                    │
│  • Type validation (numbers, text)                          │
│  • Min/max constraints                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: API Authentication                                │
│  • Check if user is authenticated                           │
│  • Verify user session                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: API Authorization                                 │
│  • Verify user has seller role                              │
│  • Check seller is verified (for CREATE)                    │
│  • Validate seller_id matches (for UPDATE/DELETE)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: Database RLS Policies                             │
│  • Row-level security enforces ownership                    │
│  • Prevents unauthorized access even with direct queries    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Layer 5: Rate Limiting                                     │
│  • 50 requests per minute per IP                            │
│  • Prevents abuse and DoS attacks                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
app/seller/products/
│
├── page.tsx (Server Component)
│   ├─► Fetches products from database
│   ├─► Handles authentication redirect
│   └─► Passes data to client component
│
├── products-client.tsx (Client Component)
│   ├─► Displays product cards
│   ├─► Handles delete confirmation dialog
│   ├─► Manages loading & error states
│   └─► Triggers page refresh after delete
│
├── new/
│   └── page.tsx (Client Component)
│       ├─► Product creation form
│       ├─► Form validation
│       └─► POST to API
│
└── [id]/edit/
    └── page.tsx (Client Component)
        ├─► Fetches product data
        ├─► Pre-populated edit form
        └─► PATCH to API
```

## API Route Structure

```
app/api/products/route.ts
│
├── GET (request: Request)
│   ├─► if (id) → fetch single product
│   └─► else → fetch all products (with filters)
│
├── POST (request: Request)
│   ├─► Validate authentication
│   ├─► Check seller role & verification
│   ├─► Insert product with seller_id
│   └─► Return created product
│
├── PATCH (request: Request)
│   ├─► Validate authentication
│   ├─► Validate ownership (seller_id)
│   ├─► Update product
│   └─► Return updated product
│
└── DELETE (request: Request)
    ├─► Validate authentication
    ├─► Validate ownership (seller_id)
    ├─► Delete product
    └─► Return success message
```

## Database Schema

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(5, 2) DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    rating NUMERIC(3, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
CREATE POLICY "Anyone can view products" 
    ON products FOR SELECT USING (true);

CREATE POLICY "Sellers can insert own products" 
    ON products FOR INSERT WITH CHECK (
        auth.uid() = seller_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('seller', 'admin'))
    );

CREATE POLICY "Sellers can update own products" 
    ON products FOR UPDATE USING (
        auth.uid() = seller_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('seller', 'admin'))
    );

CREATE POLICY "Sellers can delete own products" 
    ON products FOR DELETE USING (
        auth.uid() = seller_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('seller', 'admin'))
    );
```

## User Journey

```
┌─────────────────────────────────────────────────────────────┐
│ Seller logs in → Navigates to /seller/products             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Sees list of their products                                 │
│ Options: [Add New] [Edit] [Delete]                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌─────────┐   ┌─────────┐   ┌─────────┐
        │ Add New │   │  Edit   │   │ Delete  │
        └─────────┘   └─────────┘   └─────────┘
              │             │             │
              ▼             ▼             ▼
         Fill form     Modify data    Confirm
              │             │             │
              ▼             ▼             ▼
           Submit        Update        Delete
              │             │             │
              └─────────────┴─────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  Success! Redirect to   │
              │   /seller/products      │
              └─────────────────────────┘
```

## Key Features Summary

✅ **Complete CRUD Operations**
✅ **Multi-layer Security**
✅ **User-friendly Interface**
✅ **Error Handling**
✅ **Loading States**
✅ **Confirmation Dialogs**
✅ **Form Validation**
✅ **Responsive Design**
✅ **Server-Side Rendering**
✅ **Rate Limiting**
✅ **Database RLS**
✅ **Type Safety (TypeScript)**
