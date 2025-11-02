import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/middleware/rate-limit'

const limiter = rateLimit({ windowMs: 60000, max: 30 })

// GET /api/orders - Get user's orders
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

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ orders })
}

// POST /api/orders - Create a new order
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

  const { items, total_amount, shipping_address, payment_intent_id } =
    await request.json()

  if (!items || !total_amount || !shipping_address) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Get seller_id from first item's product
  const { data: product } = await supabase
    .from('products')
    .select('seller_id')
    .eq('id', items[0].product_id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .insert({
      user_id: user.id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      seller_id: (product as any)?.seller_id,
      items,
      total_amount,
      shipping_address,
      payment_intent_id,
      payment_status: payment_intent_id ? 'paid' : 'unpaid',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Clear cart after order
  await supabase.from('cart').delete().eq('user_id', user.id)

  return NextResponse.json({ order }, { status: 201 })
}

// PATCH /api/orders - Update order status (sellers/admin only)
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

  const { id, status } = await request.json()

  if (!id || !status) {
    return NextResponse.json(
      { error: 'Order ID and status required' },
      { status: 400 }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: order, error } = await (supabase as any)
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Create notification for order status update
  try {
    const { notificationManager } = await import('@/lib/supabase/notifications')
    await notificationManager.createOrderNotification(order.user_id, order.id, status)
  } catch (notificationError) {
    console.error('Failed to create order notification:', notificationError)
    // Don't fail the request if notification creation fails
  }

  return NextResponse.json({ order })
}
