'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/product-card'
import { Clock } from 'lucide-react'

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

export function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const viewed = localStorage.getItem('recentlyViewed')
      return viewed ? JSON.parse(viewed) : []
    }
    return []
  })

  if (products.length === 0) return null

  return (
    <section className="py-8">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">Recently Viewed</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

export function addToRecentlyViewed(product: Product) {
  const viewed = localStorage.getItem('recentlyViewed')
  let products: Product[] = viewed ? JSON.parse(viewed) : []
  
  // Remove if already exists
  products = products.filter(p => p.id !== product.id)
  
  // Add to beginning
  products.unshift(product)
  
  // Keep only last 8
  products = products.slice(0, 8)
  
  localStorage.setItem('recentlyViewed', JSON.stringify(products))
}
