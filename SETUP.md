# ShopHub Setup Guide

## Quick Start

Follow these steps to get the e-commerce platform running locally.

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Fill in project details

2. **Run Database Schema**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents from `supabase/schema.sql`
   - Run the SQL script

3. **Configure Storage**
   - Go to Storage in Supabase Dashboard
   - Create a new bucket: `product-images`
   - Set it to public access

4. **Enable Email Authentication**
   - Go to Authentication → Settings
   - Enable Email provider
   - Configure email templates (optional)

### 3. Configure Environment Variables

Create `.env.local` file in root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to find Supabase keys:**
- Go to Project Settings → API
- Copy `Project URL` for `NEXT_PUBLIC_SUPABASE_URL`
- Copy `anon public` key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy `service_role` key for `SUPABASE_SERVICE_ROLE_KEY`

**Where to find Stripe keys:**
- Go to [stripe.com/dashboard](https://dashboard.stripe.com)
- Developers → API keys
- Use Test mode keys for development

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Creating Test Users

### Admin User
1. Sign up at `/signup` with any email
2. Go to Supabase Dashboard → Table Editor → users
3. Find your user and change `role` to `admin`

### Seller User
1. Sign up at `/signup` and select "Seller" account type
2. Admin must approve seller (or manually set `verified` to true in database)

### Customer User
1. Sign up at `/signup` and select "Customer" account type
2. Automatically verified

## Adding Sample Products

1. Log in as a verified seller
2. Go to `/seller/products`
3. Click "Add New Product"
4. Fill in product details

## Testing Payments

1. Use Stripe test card numbers:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any CVC

## Common Issues

### "Cannot find module '@supabase/supabase-js'"
Run: `npm install`

### Authentication not working
- Check `.env.local` has correct Supabase keys
- Verify Email auth is enabled in Supabase Dashboard

### Products not showing
- Check if seller is verified
- Ensure RLS policies are set up correctly

### Database errors
- Verify schema.sql was run completely
- Check Supabase logs for errors

## File Structure Overview

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── products/          # Product listing
│   ├── product/[id]/      # Product details
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout flow
│   ├── orders/            # Order history
│   ├── seller/            # Seller dashboard
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
├── components/            # Reusable components
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── store/            # Zustand stores
│   └── utils.ts          # Helper functions
└── supabase/             # Database schema
```

## Next Steps

1. Customize styling in `app/globals.css`
2. Add your logo in `public/`
3. Configure email templates in Supabase
4. Set up Stripe webhooks for production
5. Deploy to Vercel

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Configure Supabase for Production

1. Update Auth Site URL to your production domain
2. Add production domain to Redirect URLs
3. Update `.env.local` to use production Stripe keys

### Set Up Stripe Webhooks

1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

## Support

- Check the main [README.md](./README.md)
- Review Supabase docs: https://supabase.com/docs
- Review Next.js docs: https://nextjs.org/docs
- Review Stripe docs: https://stripe.com/docs

Happy building! 🚀
