import { notFound } from 'next/navigation'
import { ProductDetailClient } from './product-detail-client'
import { createServerClient } from '@/lib/supabase/server'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*, users(name)')
    .eq('product_id', id)
    .order('created_at', { ascending: false })

  // Fetch related products (same category)
  const { data: relatedProducts } = await supabase
    .from('products')
    .select('*')
    .eq('category', product.category)
    .neq('id', id)
    .limit(4)

  return (
    <ProductDetailClient 
      product={product} 
      reviews={reviews || []} 
      relatedProducts={relatedProducts || []}
    />
  )
}
