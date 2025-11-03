import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/middleware/rate-limit'

const limiter = rateLimit({ windowMs: 60000, max: 50 })

// GET /api/products - Get all products with optional filters or a single product by ID
export async function GET(request: Request) {
  const rateLimitResponse = await limiter(request)
  if (rateLimitResponse) return rateLimitResponse

  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)

  // Handle single product fetch by ID
  const id = searchParams.get('id')
  if (id) {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ product })
  }

  const category = searchParams.get('category')
  const search = searchParams.get('search')
  const minPrice = searchParams.get('min_price')
  const maxPrice = searchParams.get('max_price')
  const sort = searchParams.get('sort') || 'created_at'
  const order = searchParams.get('order') || 'desc'
  const recommendations = searchParams.get('recommendations')
  const limit = searchParams.get('limit')

  // Handle recommendations request
  if (recommendations) {
    const productIds = recommendations.split(',')
    const limitNum = limit ? parseInt(limit) : 4

    // Get categories of the products in cart
    const { data: cartProducts } = await supabase
      .from('products')
      .select('category')
      .in('id', productIds)

    if (cartProducts && cartProducts.length > 0) {
      const categories = [...new Set(cartProducts.map((p: any) => p.category))]

      // Get recommended products from same categories, excluding cart items
      const { data: recommendedProducts, error } = await supabase
        .from('products')
        .select('*')
        .in('category', categories)
        .not('id', 'in', `(${productIds.join(',')})`)
        .order('rating', { ascending: false })
        .limit(limitNum * 2) // Get more to filter out low-rated ones

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      // Filter and limit results
      const filtered = (recommendedProducts as any)?.filter((p: any) => p.rating >= 4.0).slice(0, limitNum) || []

      return NextResponse.json({ products: filtered })
    }
  }

  let query = supabase.from('products').select('*')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  if (minPrice) {
    query = query.gte('price', parseFloat(minPrice))
  }

  if (maxPrice) {
    query = query.lte('price', parseFloat(maxPrice))
  }

  if (limit) {
    query = query.limit(parseInt(limit))
  }

  query = query.order(sort, { ascending: order === 'asc' })

  const { data: products, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products })
}

// POST /api/products - Create a new product (sellers only)
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

  // Check if user is seller or admin
  const { data: userData } = await supabase
    .from('users')
    .select('role, verified')
    .eq('id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!userData || !['seller', 'admin'].includes((userData as any).role)) {
    return NextResponse.json(
      { error: 'Only sellers can create products' },
      { status: 403 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((userData as any).role === 'seller' && !(userData as any).verified) {
    return NextResponse.json(
      { error: 'Seller account not yet verified' },
      { status: 403 }
    )
  }

  const productData = await request.json()

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      seller_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product }, { status: 201 })
}

// PATCH /api/products - Update a product
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

  const { id, ...updates } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: product, error } = await (supabase as any)
    .from('products')
    .update(updates)
    .eq('id', id)
    .eq('seller_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ product })
}

// DELETE /api/products?id=xxx - Delete a product
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
  const productId = searchParams.get('id')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId)
    .eq('seller_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Product deleted successfully' })
}
