// Mock Next.js server
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

import { rateLimit } from '@/lib/middleware/rate-limit';

// Mock NextRequest
class MockNextRequest {
  url: string;
  headers: Map<string, string>;
  nextUrl: { pathname: string };

  constructor(url: string) {
    this.url = url;
    this.headers = new Map();
    this.nextUrl = { pathname: new URL(url).pathname };
  }

  get(key: string) {
    return this.headers.get(key);
  }
}

describe('Rate Limiting Middleware', () => {
  it('should allow requests within limit', async () => {
    const limiter = rateLimit({ windowMs: 60000, max: 5 });
    
    const req = new MockNextRequest('http://localhost:3000/api/test');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await limiter(req as any);
    
    expect(result).toBeNull();
  });

  it('should block requests exceeding limit', async () => {
    const limiter = rateLimit({ windowMs: 60000, max: 2 });
    
    const req = new MockNextRequest('http://localhost:3000/api/test');
    
    // First two requests should pass
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await limiter(req as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await limiter(req as any);
    
    // Third request should be blocked
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await limiter(req as any);
    
    expect(result).toBeTruthy();
    if (result) {
      expect(result.status).toBe(429);
    }
  });
});
