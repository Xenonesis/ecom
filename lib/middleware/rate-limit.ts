import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

export function rateLimit(options: { windowMs: number; max: number }) {
  return async (req: Request | NextRequest) => {
    // Type guard to check if it's a NextRequest
    const isNextRequest = 'nextUrl' in req;
    
    const ip = isNextRequest 
      ? (req as NextRequest).headers.get('x-forwarded-for') || (req as NextRequest).headers.get('x-real-ip') || 'unknown'
      : 'unknown';
      
    const pathname = isNextRequest 
      ? (req as NextRequest).nextUrl?.pathname 
      : new URL(req.url).pathname;
      
    const key = `${ip}-${pathname}`;
    const now = Date.now();

    if (!store[key] || now > store[key].resetTime) {
      store[key] = { count: 1, resetTime: now + options.windowMs };
      return null;
    }

    store[key].count++;

    if (store[key].count > options.max) {
      return NextResponse.json(
        { error: 'Too many requests, please try again later' },
        { status: 429 }
      );
    }

    return null;
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(store)) {
    if (now > store[key].resetTime) {
      delete store[key];
    }
  }
}, 60000);
