import { validateEnv } from '@/lib/env-validation';

describe('Environment Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should pass validation with all required env vars', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';

    expect(() => validateEnv()).not.toThrow();
  });

  it('should throw error when required env vars are missing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = '';
    
    expect(() => validateEnv()).toThrow(/Missing required environment variables/);
  });

  it('should validate URL format', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'invalid-url';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key';
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123';
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';

    expect(() => validateEnv()).toThrow(/must be a valid URL/);
  });
});
