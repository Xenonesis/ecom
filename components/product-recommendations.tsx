'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product-card'
import { Sparkles, TrendingUp, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProductGridSkeleton } from '@/components/skeleton-loader'

interface Product {
  id: string
  name: string
  price: number
  discount: number | null
  images: string[] | null
  rating: number | null
  seller_id: string | null
  stock: number
  category: string
}

interface ProductRecommendationsProps {
  productId?: string
  category?: string
  type: 'similar' | 'trending' | 'popular'
  title?: string
}

export function ProductRecommendations({ 
  productId, 
  category, 
  type,
  title 
}: ProductRecommendationsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadRecommendations()
  }, [productId, category, type])

  const loadRecommendations = async () => {
    setLoading(true)

    try {
      let query = supabase
        .from('products')
        .select('*')
        .limit(4)

      if (type === 'similar' && category) {
        query = query.eq('category', category)
        if (productId) {
          query = query.neq('id', productId)
        }
      } else if (type === 'trending') {
        query = query.gt('discount', 0).order('discount', { ascending: false })
      } else if (type === 'popular') {
        query = query.order('rating', { ascending: false })
      }

      const { data, error } = await query

      if (!error && data) {
        setProducts(data as Product[])
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">{title || 'Recommended for You'}</h2>
        <ProductGridSkeleton count={4} />
      </section>
    )
  }

  if (products.length === 0) return null

  const getIcon = () => {
    switch (type) {
      case 'similar':
        return <Sparkles className="h-5 w-5 text-primary" />
      case 'trending':
        return <TrendingUp className="h-5 w-5 text-primary" />
      case 'popular':
        return <Users className="h-5 w-5 text-primary" />
      default:
        return null
    }
  }

  const getTitle = () => {
    if (title) return title
    switch (type) {
      case 'similar':
        return 'Similar Products'
      case 'trending':
        return 'Trending Now'
      case 'popular':
        return 'Popular Products'
      default:
        return 'Recommended for You'
    }
  }

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        {getIcon()}
        <h2 className="text-2xl font-bold">{getTitle()}</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
