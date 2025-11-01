import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/search - Search products with autocomplete
export async function GET(request: Request) {
  const supabase = await createServerClient()
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('q')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ products: [] })
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, price, discount, images, category, rating')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(limit)
    .order('rating', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products })
}
