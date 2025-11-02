# ShopHub - Quick Reference Guide

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📝 Validation (Zod)

```typescript
import { productSchema, signUpSchema } from '@/lib/validations/schemas';

// Validate data
const result = productSchema.parse(data); // Throws on error
const safe = productSchema.safeParse(data); // Returns { success, data/error }
```

## 🛡️ API Route Protection

```typescript
import { withValidation, withRateLimit, apiResponse, apiError } from '@/lib/api/helpers';
import { productSchema } from '@/lib/validations/schemas';

export async function POST(req: NextRequest) {
  // With rate limiting (10 req/min)
  return withRateLimit(req, async () => {
    // With validation
    return withValidation(req, productSchema, async (data) => {
      // Your logic here
      const product = await createProduct(data);
      return apiResponse(product, 201);
    });
  });
}

// Custom rate limit
return withRateLimit(req, handler, { windowMs: 60000, max: 5 });
```

## 🎨 Error Boundary

```tsx
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary fallback={<CustomError />}>
  <YourComponent />
</ErrorBoundary>
```

## 🗄️ Database Indexes

```sql
-- Run in Supabase SQL Editor
\i supabase/optimizations.sql

-- Or copy/paste content from the file
```

## 🧪 Testing

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 🔒 Security Headers

```typescript
// In middleware.ts
import { securityHeaders } from '@/lib/middleware/security';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return securityHeaders(response);
}
```

## ⚙️ Environment Variables

```typescript
import { validateEnv } from '@/lib/env';

// Validate on startup (server-side only)
if (typeof window === 'undefined') {
  validateEnv();
}
```

## 📊 Available Schemas

```typescript
import {
  signUpSchema,      // Email, password (8+ chars, mixed case, number), role
  loginSchema,       // Email, password
  productSchema,     // Name, description, price, stock, category, images
  createOrderSchema, // Items, shipping address
  reviewSchema,      // Product ID, rating (1-5), comment
} from '@/lib/validations/schemas';
```

## 🎯 API Response Format

```typescript
// Success
{
  "success": true,
  "data": { /* your data */ }
}

// Error
{
  "success": false,
  "error": "Error message"
}
```

## 📦 Helper Functions

```typescript
// API helpers
apiResponse(data, status?)     // Success response
apiError(message, status?)     // Error response
withValidation(req, schema, handler)
withRateLimit(req, handler, options?)

// Validation
schema.parse(data)             // Throws on error
schema.safeParse(data)         // Returns result object
```

## 🔍 Common Patterns

### Protected API Route
```typescript
export async function POST(req: NextRequest) {
  // 1. Check auth
  const user = await getUser(req);
  if (!user) return apiError('Unauthorized', 401);

  // 2. Rate limit
  return withRateLimit(req, async () => {
    // 3. Validate
    return withValidation(req, schema, async (data) => {
      // 4. Process
      const result = await processData(data);
      return apiResponse(result);
    });
  });
}
```

### Form Validation
```typescript
const handleSubmit = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  
  const result = schema.safeParse(data);
  if (!result.success) {
    setErrors(result.error.flatten());
    return;
  }
  
  // Submit validated data
  await submitData(result.data);
};
```

## 🐛 Debugging

```typescript
// Development only (removed in production)
console.log('Debug info:', data);

// Error logging
try {
  // code
} catch (error) {
  console.error('Error:', error);
  // Log to monitoring service
}
```

## 📈 Performance Tips

1. Use database indexes for common queries
2. Implement pagination for large datasets
3. Use `next/image` for image optimization
4. Lazy load heavy components
5. Enable bundle optimization in next.config.ts

## 🔐 Security Checklist

- [ ] Validate all user inputs
- [ ] Apply rate limiting to sensitive endpoints
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Implement proper authentication
- [ ] Use HTTPS in production
- [ ] Regular dependency updates

## 📚 File Locations

```
lib/
├── validations/schemas.ts      # Zod schemas
├── middleware/
│   ├── rate-limit.ts          # Rate limiting
│   └── security.ts            # Security headers
├── api/helpers.ts             # API utilities
└── env.ts                     # Env validation

components/
└── error-boundary.tsx         # Error boundary

supabase/
└── optimizations.sql          # DB indexes

__tests__/
└── components/                # Component tests
```

## 🆘 Troubleshooting

### Validation Errors
```typescript
// Get detailed error info
const result = schema.safeParse(data);
if (!result.success) {
  console.log(result.error.issues);
}
```

### Rate Limit Issues
```typescript
// Adjust limits per endpoint
withRateLimit(req, handler, {
  windowMs: 60000,  // 1 minute
  max: 20           // 20 requests
});
```

### Test Failures
```bash
# Clear cache
npm test -- --clearCache

# Run specific test
npm test error-boundary

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📞 Support

- Documentation: `IMPLEMENTATION_GUIDE.md`
- Examples: `__tests__/` directory
- Issues: Check console for detailed errors
