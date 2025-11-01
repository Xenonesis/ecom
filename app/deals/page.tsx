'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Percent, TrendingDown, Zap } from 'lucide-react'

export default function DealsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'high' | 'medium'>('all')
  
  const supabase = createClient()

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
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

  const filteredProducts = products.filter(product => {
    if (filter === 'high') return product.discount >= 30
    if (filter === 'medium') return product.discount >= 15 && product.discount < 30
    return true
  })

  const calculateSavings = () => {
    return filteredProducts.reduce((sum, product) => {
      const savings = (product.price * product.discount) / 100
      return sum + savings
    }, 0)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-primary to-purple-600 p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-10 w-10" />
          <h1 className="text-3xl font-bold sm:text-4xl">Hot Deals & Discounts</h1>
        </div>
        <p className="text-lg opacity-90 max-w-2xl">
          Save big on your favorite products! Limited time offers you don't want to miss.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
            <div className="text-sm opacity-90">Active Deals</div>
          </div>
          <div className="rounded-lg bg-white/10 p-4 backdrop-blur">
            <div className="text-2xl font-bold">
              {Math.max(...products.map(p => p.discount), 0)}%
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
            {products.filter(p => p.discount >= 30).length}
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
            {products.filter(p => p.discount >= 15 && p.discount < 30).length}
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
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
