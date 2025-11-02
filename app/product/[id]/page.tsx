import { notFound } from 'next/navigation'
import { ProductDetailClient } from './product-detail-client'
import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/database.types'
import { Metadata } from 'next'
import { generateProductSchema } from '@/lib/seo/structured-data'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createServerClient()
  
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const productData = product as Database['public']['Tables']['products']['Row']
  const imageUrl = productData.images?.[0] || ''

  return {
    title: `${productData.name} - ShopHub`,
    description: productData.description?.substring(0, 160) || '',
    openGraph: {
      title: productData.name || '',
      description: productData.description || '',
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: productData.name || '',
      description: productData.description || '',
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({ params }: Readonly<Props>) {
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

  // Generate structured data
  const structuredData = generateProductSchema(product)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductDetailClient 
        product={product} 
        reviews={reviews || []} 
        relatedProducts={relatedProducts || []}
      />
    </>
  )
}
