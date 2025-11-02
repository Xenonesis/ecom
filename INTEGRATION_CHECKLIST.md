# Integration Checklist - Manual Steps

## 🎯 Overview
This checklist covers the manual integration steps needed to fully activate all the security and performance improvements.

---

## 1. ✅ Error Boundary Integration

**File**: `app/layout.tsx`

**Action**: Wrap main content with ErrorBoundary

```tsx
// Add import at top
import { ErrorBoundary } from "@/components/error-boundary";

// Wrap content (around line 39)
<ThemeProvider ...>
  <ErrorBoundary>
    <Navbar />
    <main className="min-h-screen">{children}</main>
    <ScrollToTop />
    <LiveChat />
    <Toaster />
  </ErrorBoundary>
  {/* Footer stays outside */}
</ThemeProvider>
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 2 minutes

---

## 2. 🗄️ Database Optimizations

**File**: `supabase/optimizations.sql`

**Action**: Run SQL in Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy content from `supabase/optimizations.sql`
3. Paste and run
4. Verify indexes created: `\di` in SQL editor

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 5 minutes

---

## 3. 🛡️ Security Headers Middleware

**File**: `middleware.ts` (root directory)

**Action**: Add security headers

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from '@/lib/middleware/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return securityHeaders(response);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 3 minutes

---

## 4. ⚙️ Environment Variable Validation

**File**: `app/layout.tsx`

**Action**: Add validation at top of file

```typescript
import { validateEnv } from '@/lib/env';

// Add before component definition
if (typeof window === 'undefined') {
  validateEnv();
}

export default function RootLayout({ children }: ...) {
  // existing code
}
```

**Status**: ⏳ Pending  
**Priority**: Medium  
**Time**: 2 minutes

---

## 5. 🔐 Update Auth API Routes

**Files**: 
- `app/api/auth/signup/route.ts`
- `app/api/auth/login/route.ts`

**Action**: Add validation and rate limiting

```typescript
import { withValidation, withRateLimit, apiResponse, apiError } from '@/lib/api/helpers';
import { signUpSchema, loginSchema } from '@/lib/validations/schemas';

// Signup
export async function POST(req: NextRequest) {
  return withRateLimit(req, async () => {
    return withValidation(req, signUpSchema, async (data) => {
      // Your existing signup logic
      return apiResponse(user, 201);
    });
  }, { windowMs: 60000, max: 5 }); // 5 signups per minute
}

// Login
export async function POST(req: NextRequest) {
  return withRateLimit(req, async () => {
    return withValidation(req, loginSchema, async (data) => {
      // Your existing login logic
      return apiResponse({ token, user });
    });
  }, { windowMs: 60000, max: 10 }); // 10 logins per minute
}
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 10 minutes

---

## 6. 📦 Update Product API Routes

**Files**:
- `app/api/products/route.ts`
- `app/api/products/[id]/route.ts`

**Action**: Add validation

```typescript
import { withValidation, apiResponse, apiError } from '@/lib/api/helpers';
import { productSchema } from '@/lib/validations/schemas';

// Create product
export async function POST(req: NextRequest) {
  return withValidation(req, productSchema, async (data) => {
    // Check if user is seller/admin
    const user = await getUser(req);
    if (!user || !['seller', 'admin'].includes(user.role)) {
      return apiError('Unauthorized', 403);
    }
    
    // Your existing product creation logic
    return apiResponse(product, 201);
  });
}

// Update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return withValidation(req, productSchema.partial(), async (data) => {
    // Your existing update logic
    return apiResponse(product);
  });
}
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 15 minutes

---

## 7. 🛒 Update Order API Routes

**Files**:
- `app/api/orders/route.ts`

**Action**: Add validation

```typescript
import { withValidation, apiResponse } from '@/lib/api/helpers';
import { createOrderSchema } from '@/lib/validations/schemas';

export async function POST(req: NextRequest) {
  return withValidation(req, createOrderSchema, async (data) => {
    // Your existing order creation logic
    return apiResponse(order, 201);
  });
}
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 10 minutes

---

## 8. ⭐ Update Review API Routes

**Files**:
- `app/api/reviews/route.ts`

**Action**: Add validation and rate limiting

```typescript
import { withValidation, withRateLimit, apiResponse } from '@/lib/api/helpers';
import { reviewSchema } from '@/lib/validations/schemas';

export async function POST(req: NextRequest) {
  return withRateLimit(req, async () => {
    return withValidation(req, reviewSchema, async (data) => {
      // Your existing review logic
      return apiResponse(review, 201);
    });
  }, { windowMs: 300000, max: 5 }); // 5 reviews per 5 minutes
}
```

**Status**: ⏳ Pending  
**Priority**: Medium  
**Time**: 5 minutes

---

## 9. 🧪 Run Tests

**Action**: Execute test suite

```bash
# Run all tests
npm test

# Check coverage
npm run test:coverage

# Fix any failing tests
```

**Status**: ⏳ Pending  
**Priority**: Medium  
**Time**: 10 minutes

---

## 10. 📊 Verify Environment Variables

**Action**: Check `.env.local` has all required variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

**Status**: ⏳ Pending  
**Priority**: High  
**Time**: 2 minutes

---

## 📋 Summary

| Step | Priority | Time | Status |
|------|----------|------|--------|
| 1. Error Boundary | High | 2 min | ⏳ |
| 2. Database Indexes | High | 5 min | ⏳ |
| 3. Security Headers | High | 3 min | ⏳ |
| 4. Env Validation | Medium | 2 min | ⏳ |
| 5. Auth API | High | 10 min | ⏳ |
| 6. Product API | High | 15 min | ⏳ |
| 7. Order API | High | 10 min | ⏳ |
| 8. Review API | Medium | 5 min | ⏳ |
| 9. Run Tests | Medium | 10 min | ⏳ |
| 10. Verify Env | High | 2 min | ⏳ |

**Total Estimated Time**: ~64 minutes

---

## 🎯 Completion Order

### Phase 1: Foundation (15 min)
1. Verify Environment Variables
2. Database Optimizations
3. Error Boundary Integration
4. Security Headers Middleware
5. Environment Validation

### Phase 2: API Integration (40 min)
6. Update Auth API Routes
7. Update Product API Routes
8. Update Order API Routes
9. Update Review API Routes

### Phase 3: Validation (10 min)
10. Run Tests
11. Manual testing of key flows

---

## ✅ Testing After Integration

### Manual Tests
- [ ] Sign up with weak password (should fail)
- [ ] Sign up with strong password (should succeed)
- [ ] Try 11 rapid requests to same endpoint (should rate limit)
- [ ] Create product with invalid data (should fail validation)
- [ ] Create product with valid data (should succeed)
- [ ] Submit review with rating 6 (should fail)
- [ ] Submit review with rating 1-5 (should succeed)

### Automated Tests
```bash
npm test
```

### Performance Tests
```bash
npm run build
npm start
# Check Lighthouse score
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All integration steps completed
- [ ] All tests passing
- [ ] Environment variables set in production
- [ ] Database indexes applied to production DB
- [ ] Security headers verified
- [ ] Rate limiting tested
- [ ] Error boundary tested
- [ ] Lighthouse score 95+

---

## 📞 Need Help?

- **Documentation**: See `IMPLEMENTATION_GUIDE.md`
- **Examples**: Check `__tests__/` directory
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Issues**: Check console for detailed error messages
