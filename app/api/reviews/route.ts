import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/middleware/rate-limit'

const limiter = rateLimit({ windowMs: 60000, max: 20 })

// GET /api/reviews?product_id=xxx - Get reviews for a product
export async function GET(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('product_id')

  if (!productId) {
    return NextResponse.json(
      { error: 'Product ID required' },
      { status: 400 }
    )
  }

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(`
      *,
      user:users (name, avatar_url)
    `)
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reviews })
}

// POST /api/reviews - Create a review
export async function POST(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { product_id, rating, comment } = await request.json()

  if (!product_id || !rating) {
    return NextResponse.json(
      { error: 'Product ID and rating required' },
      { status: 400 }
    )
  }

  if (rating < 0 || rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be between 0 and 5' },
      { status: 400 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: review, error } = await (supabase as any)
    .from('reviews')
    .insert({
      user_id: user.id,
      product_id,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review }, { status: 201 })
}

// PATCH /api/reviews - Update a review
export async function PATCH(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, rating, comment } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: review, error } = await (supabase as any)
    .from('reviews')
    .update({ rating, comment })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review })
}

// DELETE /api/reviews?id=xxx - Delete a review
export async function DELETE(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const reviewId = searchParams.get('id')

  if (!reviewId) {
    return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', reviewId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Review deleted successfully' })
}
