import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/middleware/rate-limit'

const limiter = rateLimit({ windowMs: 60000, max: 30 })

// GET /api/wishlist - Get user's wishlist
export async function GET(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: wishlistItems, error } = await supabase
    .from('wishlist')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: wishlistItems })
}

// POST /api/wishlist - Add product to wishlist
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

  const { product_id } = await request.json()

  if (!product_id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  // Check if already in wishlist
  const { data: existing } = await supabase
    .from('wishlist')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .single()

  if (existing) {
    return NextResponse.json(
      { message: 'Product already in wishlist' },
      { status: 200 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('wishlist')
    .insert({ user_id: user.id, product_id })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data }, { status: 201 })
}

// DELETE /api/wishlist?id=xxx - Remove product from wishlist
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
  const wishlistId = searchParams.get('id')
  const productId = searchParams.get('product_id')

  if (!wishlistId && !productId) {
    return NextResponse.json(
      { error: 'Wishlist ID or Product ID required' },
      { status: 400 }
    )
  }

  let query = supabase.from('wishlist').delete().eq('user_id', user.id)

  if (wishlistId) {
    query = query.eq('id', wishlistId)
  } else if (productId) {
    query = query.eq('product_id', productId)
  }

  const { error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Product removed from wishlist' })
}
