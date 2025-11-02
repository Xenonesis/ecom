import { NextRequest, NextResponse } from 'next/server';
import { ZodSchema } from 'zod';
import { rateLimit } from '../middleware/rate-limit';

export async function withValidation<T>(
  req: NextRequest,
  schema: ZodSchema<T>,
  handler: (data: T) => Promise<NextResponse>
) {
  try {
    const body = await req.json();
    const validated = schema.parse(body);
    return await handler(validated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.errors || 'Validation failed' },
      { status: 400 }
    );
  }
}

export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>,
  options = { windowMs: 60000, max: 10 }
) {
  const limiter = rateLimit(options);
  const limitResponse = await limiter(req);
  
  if (limitResponse) return limitResponse;
  
  return await handler();
}

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status });
}
