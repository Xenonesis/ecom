import { createServerClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/categories - Get all categories with product counts
export async function GET() {
  const supabase = await createServerClient()

  // Fetch all products to count by category
  const { data: products, error } = await supabase
    .from('products')
    .select('category, images')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!products) {
    return NextResponse.json({ categories: [] })
  }

  // Group by category
  const categoryMap = new Map<string, { count: number; image: string }>()
  
  for (const product of products) {
    const existing = categoryMap.get(product.category) || { count: 0, image: '' }
    categoryMap.set(product.category, {
      count: existing.count + 1,
      image: existing.image || product.images?.[0] || ''
    })
  }

  const categories = Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    image: data.image
  }))

  return NextResponse.json({ categories })
}
