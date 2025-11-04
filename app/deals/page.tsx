'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { CountdownTimer } from '@/components/countdown-timer'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Percent, TrendingDown, Zap, Flame } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  discount: number | null
  images: string[] | null
  description: string
  rating?: number | null
  seller_id?: string | null
  stock?: number
  category: string
  created_at: string | null
  updated_at: string | null
}

export default function DealsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')
  
  // Calculate flash sale end time once (24 hours from now)
  const flashSaleEnd = useMemo(() => {
    const endTime = new Date()
    endTime.setHours(endTime.getHours() + 24)
    return endTime
  }, [])
  
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const fetchDealsData = async () => {
      setLoading(true)
      
      // Fetch products with discounts
      const { data } = await supabase
        .from('products')
        .select('*')
        .gt('discount', 0)
        .order('discount', { ascending: false })
      
      setProducts(data || [])
      setLoading(false)
    }
    
    fetchDealsData()
  }, [supabase])

  const filteredProducts = products.filter(product => {
    const discount = product.discount || 0
    if (filter === 'high') return discount >= 30
    if (filter === 'medium') return discount >= 15 && discount < 30
    return true
  })

  const calculateSavings = () => {
    return filteredProducts.reduce((sum, product) => {
      const discount = product.discount || 0
      const savings = (product.price * discount) / 100
      return sum + savings
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Flash Sale Section with Countdown */}
      <Card className="mb-8 overflow-hidden border-2 border-red-500">
        <div className="bg-linear-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3">
              <Flame className="h-10 w-10 animate-pulse" />
              <div>
                <h2 className="text-2xl font-bold">Flash Sale</h2>
                <p className="text-sm opacity-90">Deals ending soon - Don&apos;t miss out!</p>
              </div>
            </div>
            <div className="shrink-0">
              <CountdownTimer endDate={flashSaleEnd} />
            </div>
          </div>
        </div>
        
        {/* Top Flash Sale Products */}
        {!loading && products.length > 0 && (
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {products
              .filter(p => (p.discount || 0) >= 30)
              .slice(0, 4)
              .map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    ...product,
                    images: product.images || [],
                    rating: product.rating || 0,
                    seller_id: product.seller_id || '',
                    stock: product.stock || 0,
                    discount: product.discount || 0
                  }} 
                />
              ))
            }
          </div>
        )}
      </Card>

      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-primary/60 p-8 text-primary-foreground">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10" />
          <h1 className="text-3xl font-bold sm:text-4xl">Hot Deals & Discounts</h1>
        </div>
        <p className="text-lg opacity-90 max-w-2xl">
          Save big on your favorite products! Limited time offers you don&apos;t want to miss.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
            <div className="text-sm opacity-90">Active Deals</div>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
            <div className="text-2xl font-bold">
              {Math.max(...products.map(p => p.discount || 0), 0)}%
            </div>
            <div className="text-sm opacity-90">Max Discount</div>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold">₹{calculateSavings().toFixed(0)}</div>
            <div className="text-sm opacity-90">Total Savings</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          }`}
        >
          <Percent className="h-4 w-4" />
          All Deals
          <Badge variant="secondary" className="ml-1">
            {products.length}
          </Badge>
        </button>
        
        <button
          onClick={() => setFilter('high')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'high' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          }`}
        >
          <TrendingDown className="h-4 w-4" />
          30% & Above
          <Badge variant="secondary" className="ml-1">
            {products.filter(p => (p.discount || 0) >= 30).length}
          </Badge>
        </button>
        
        <button
          onClick={() => setFilter('medium')}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            filter === 'medium' 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-background hover:bg-accent'
          }`}
        >
          <Badge className="h-4 w-4" />
          15% - 29%
          <Badge variant="secondary" className="ml-1">
            {products.filter(p => (p.discount || 0) >= 15 && (p.discount || 0) < 30).length}
          </Badge>
        </button>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'deal' : 'deals'}
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                images: product.images || [],
                rating: product.rating || 0,
                seller_id: product.seller_id || '',
                stock: product.stock || 0,
                discount: product.discount || 0
              }} 
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <TrendingDown className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No deals available at the moment. Check back soon!
          </p>
        </div>
      )}
    </div>
  )
}
