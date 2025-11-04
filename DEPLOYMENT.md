# ShopHub Deployment Guide

This guide covers the deployment process for the ShopHub e-commerce platform.

## 🚀 Production Readiness Checklist

Before deploying to production, ensure all items are completed:

### ✅ Code Quality
- [ ] All ESLint errors fixed (warnings acceptable)
- [ ] TypeScript compilation successful
- [ ] Test coverage above 70%
- [ ] Build process completes without errors

### ✅ Security
- [ ] Environment variables configured
- [ ] Security headers implemented
- [ ] HTTPS enabled
- [ ] Content Security Policy configured
- [ ] Rate limiting enabled

### ✅ Performance
- [ ] Bundle size optimized
- [ ] Images optimized
- [ ] Caching strategies implemented
- [ ] CDN configured for static assets

### ✅ Database
- [ ] Database migrations applied
- [ ] Row Level Security (RLS) policies configured
- [ ] Backup strategy in place
- [ ] Connection pooling configured

### ✅ Monitoring
- [ ] Error tracking configured (Sentry recommended)
- [ ] Performance monitoring enabled
- [ ] Logging configured
- [ ] Health checks implemented

## 🛠️ Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all required environment variables
   - Ensure they're available for Production environment

3. **Custom Domain**
   - Add your custom domain in Vercel Dashboard
   - Configure DNS records as instructed
   - SSL certificate will be automatically provisioned

### Option 2: Docker Deployment

1. **Build Docker Image**
   ```bash
   # Build the image
   docker build -t shophub .
   
   # Run locally for testing
   docker run -p 3000:3000 --env-file .env.local shophub
   ```

2. **Docker Compose (with database)**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       env_file:
         - .env.local
       depends_on:
         - postgres
     
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: shophub
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: your_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

### Option 3: Traditional VPS/Server

1. **Server Requirements**
   - Node.js 18+ 
   - PM2 for process management
   - Nginx for reverse proxy
   - SSL certificate (Let's Encrypt recommended)

2. **Deployment Script**
   ```bash
   #!/bin/bash
   
   # Pull latest code
   git pull origin main
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Restart application
   pm2 restart shophub
   
   # Reload Nginx
   sudo nginx -s reload
   ```

## 🔧 Pre-deployment Commands

Run these commands before deploying:

```bash
# Run production readiness check
npm run production-check

# Run all tests
npm run test:coverage

# Build and verify
npm run build

# Type check
npm run type-check

# Lint code
npm run lint
```

## 📊 Database Setup

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note down URL and anon key

2. **Run Migrations**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Login to Supabase
   supabase login
   
   # Link to your project
   supabase link --project-ref your-project-ref
   
   # Push migrations
   supabase db push
   ```

3. **Configure RLS Policies**
   - Enable Row Level Security on all tables
   - Configure appropriate policies for each table
   - Test policies with different user roles

### Database Optimization

1. **Indexes**
   ```sql
   -- Add indexes for common queries
   CREATE INDEX idx_products_category ON products(category);
   CREATE INDEX idx_products_seller_id ON products(seller_id);
   CREATE INDEX idx_orders_user_id ON orders(user_id);
   CREATE INDEX idx_orders_created_at ON orders(created_at);
   ```

2. **Connection Pooling**
   - Configure connection pooling in Supabase
   - Set appropriate pool size based on expected load

## 🔒 Security Configuration

### Content Security Policy

The application includes a comprehensive CSP in `next.config.ts`. Adjust as needed:

```typescript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
  // ... other directives
].join('; ')
```

### Rate Limiting

Configure rate limiting for API endpoints:

```typescript
// In your API routes
import { rateLimit } from '@/lib/middleware/rate-limit'

export async function POST(request: Request) {
  const rateLimitResult = await rateLimit(request)
  if (!rateLimitResult.success) {
    return new Response('Too Many Requests', { status: 429 })
  }
  
  // Your API logic here
}
```

## 📈 Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npx depcheck

# Audit for vulnerabilities
npm audit
```

### Caching Strategy

1. **Static Assets**
   - Configure CDN for static assets
   - Set appropriate cache headers
   - Use Next.js Image optimization

2. **API Responses**
   - Implement Redis for caching
   - Use Supabase caching features
   - Configure appropriate TTL values

## 🔍 Monitoring & Logging

### Error Tracking

1. **Sentry Setup**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configuration**
   ```javascript
   // sentry.client.config.js
   import * as Sentry from '@sentry/nextjs'
   
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     environment: process.env.NODE_ENV,
   })
   ```

### Performance Monitoring

1. **Web Vitals**
   - Monitor Core Web Vitals
   - Set up alerts for performance degradation
   - Use built-in performance monitoring

2. **Custom Metrics**
   ```typescript
   import { getPerformanceMonitor } from '@/lib/monitoring/performance'
   
   const monitor = getPerformanceMonitor()
   monitor.recordMetric({
     name: 'api_response_time',
     duration: responseTime,
     timestamp: Date.now()
   })
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify environment variables
   - Clear `.next` directory and rebuild

2. **Database Connection Issues**
   - Verify Supabase credentials
   - Check network connectivity
   - Ensure RLS policies are correct

3. **Performance Issues**
   - Analyze bundle size
   - Check for memory leaks
   - Optimize database queries

### Health Checks

Create a health check endpoint:

```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
    
    if (error) throw error
    
    return Response.json({ 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected'
    })
  } catch (error) {
    return Response.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    )
  }
}
```

## 📋 Post-deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test user registration and login
- [ ] Test product creation and ordering
- [ ] Verify payment processing
- [ ] Check email notifications
- [ ] Test mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Check analytics tracking
- [ ] Test error pages
- [ ] Verify security headers

## 🔄 CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:coverage
      
      - name: Run production check
        run: npm run production-check
      
      - name: Build application
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 Support

For deployment issues or questions:

1. Check the troubleshooting section above
2. Review application logs
3. Check Supabase dashboard for database issues
4. Contact the development team

---

**Remember**: Always test deployments in a staging environment before deploying to production!