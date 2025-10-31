import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/cart - Get user's cart items
export async function GET() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: cartItems, error } = await supabase
    .from('cart')
    .select(`
      *,
      product:products (*)
    `)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: cartItems })
}

// POST /api/cart - Add item to cart
export async function POST(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { product_id, quantity = 1 } = await request.json()

  if (!product_id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  // Check if item already in cart
  const { data: existing } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .single()

  if (existing) {
    // Update quantity
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ item: data })
  }

  // Add new item
  const { data, error } = await supabase
    .from('cart')
    .insert({ user_id: user.id, product_id, quantity })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data }, { status: 201 })
}

// PATCH /api/cart - Update cart item quantity
export async function PATCH(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { cart_id, quantity } = await request.json()

  if (!cart_id || quantity === undefined) {
    return NextResponse.json(
      { error: 'Cart ID and quantity required' },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('cart')
    .update({ quantity })
    .eq('id', cart_id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

// DELETE /api/cart?id=xxx - Remove item from cart
export async function DELETE(request: Request) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const cartId = searchParams.get('id')

  if (!cartId) {
    return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
  }

  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', cartId)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Item removed from cart' })
}
