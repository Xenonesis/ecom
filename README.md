# 🛍️ ShopHub - Full-Stack E-Commerce Platform

A modern, scalable e-commerce platform built with Next.js 16, Supabase, and Stripe. Features role-based dashboards for customers, sellers, and admins.

## ✨ Features

### Customer Features
- 🔐 Secure authentication (Email/Password)
- 🛒 Shopping cart with persistent storage
- 💳 Secure checkout with Stripe integration
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- ❤️ Wishlist functionality
- 🔍 Product search and filtering

### Seller Features
- 📊 Comprehensive dashboard with analytics
- 📦 Product management (CRUD operations)
- 🖼️ Image upload via Supabase Storage
- 📈 Sales tracking and reporting
- 🔔 Real-time order notifications
- 📋 Order management (status updates)

### Admin Features
- 👥 User management
- ✅ Seller approval system
- 📊 Platform-wide analytics
- 🏷️ Category management
- 📦 Product oversight
- 💰 Revenue tracking

## 🚀 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS 4
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **State Management**: Zustand
- **Payments**: Stripe
- **UI Components**: Radix UI, Lucide Icons
- **Type Safety**: TypeScript

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- Supabase account
- Stripe account (for payments)

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Enable Email Auth in Authentication settings
4. Create a storage bucket named `product-images` and make it public

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ecom/
├── app/                        # Next.js app directory
│   ├── (auth)/                # Authentication routes
│   │   ├── login/
│   │   └── signup/
│   ├── admin/                 # Admin dashboard
│   ├── seller/                # Seller dashboard
│   │   ├── products/
│   │   └── orders/
│   ├── product/[id]/          # Product detail pages
│   ├── cart/                  # Shopping cart
│   ├── checkout/              # Checkout flow
│   ├── orders/                # Order history
│   ├── api/                   # API routes
│   │   ├── create-payment-intent/
│   │   └── admin/
│   └── layout.tsx
├── components/                # Reusable components
│   ├── ui/                   # UI components (Button, Card, etc.)
│   ├── navbar.tsx
│   └── product-card.tsx
├── lib/                       # Utilities and configuration
│   ├── supabase/             # Supabase clients
│   ├── store/                # Zustand stores
│   └── utils.ts
├── supabase/
│   └── schema.sql            # Database schema
└── public/                    # Static assets
```

## 🗄️ Database Schema

The platform uses PostgreSQL via Supabase with the following tables:

- **users** - User profiles with role-based access
- **products** - Product catalog
- **orders** - Order records
- **reviews** - Product reviews and ratings
- **cart** - Shopping cart items
- **wishlist** - User wishlists

Row-Level Security (RLS) policies ensure data protection.

## 🔐 Authentication Flow

1. Users sign up with email/password
2. Choose account type (Customer/Seller)
3. Sellers require admin approval before verification
4. Role-based redirects to appropriate dashboards

## 💳 Payment Integration

The platform uses Stripe for secure payments:

1. Customer initiates checkout
2. Payment Intent created via API route
3. Stripe Elements handles payment UI
4. Webhook confirms payment success
5. Order status updated in database

## 🎨 UI Components

Built with Radix UI primitives for accessibility:
- Button, Input, Card
- Dialog, Dropdown Menu
- Select, Tabs, Toast notifications

Styled with TailwindCSS 4 for modern, responsive design.

## 📊 Admin Dashboard

Access at `/admin` (requires admin role):
- View platform statistics
- Approve/reject seller applications
- Manage users and products
- Monitor revenue and orders

## 🏪 Seller Dashboard

Access at `/seller` (requires seller role):
- Add and manage products
- Track sales and revenue
- Manage orders and inventory
- View analytics

## 🛒 Customer Features

- Browse products with search/filter
- Add to cart with quantity selection
- Persistent cart across sessions
- Secure checkout with address collection
- Order tracking and history

## 🚢 Deployment

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

### Environment Variables

Ensure all environment variables are set in Vercel dashboard.

## 📝 TODO

- [ ] Implement Stripe webhook handler
- [ ] Add product categories page
- [ ] Implement wishlist functionality
- [ ] Add product image upload UI
- [ ] Create seller product form
- [ ] Add email notifications
- [ ] Implement search functionality
- [ ] Add pagination for products
- [ ] Create admin product management
- [ ] Add order refund flow

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Support

For issues or questions:
- Open an issue on GitHub
- Check Supabase documentation
- Review Next.js documentation

## 🎯 Success Metrics

Target KPIs as per PRD:
- ⚡ 95%+ Lighthouse score
- 🛒 100+ orders processed
- 💰 5% monthly seller growth
- 💬 90% positive feedback
- 🔐 Zero security breaches

---

Built with ❤️ using Next.js, Supabase, and Stripe

