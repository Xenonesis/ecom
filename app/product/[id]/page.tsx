import { notFound } from 'next/navigation'
import { ProductDetailClient } from './product-detail-client'
import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/database.types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  const product: Database['public']['Tables']['products']['Row'] | null = data

  if (!product) {
    notFound()
  }

  const typedProduct = product as Database['public']['Tables']['products']['Row']

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
    .eq('category', typedProduct.category)
    .neq('id', id)
    .limit(4)

  return (
    <ProductDetailClient 
      product={typedProduct} 
      reviews={reviews || []} 
      relatedProducts={relatedProducts || []}
    />
  )
}
