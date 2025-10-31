'use client'

import { useState, useEffect } from 'react'
import { Filter, Search, SlidersHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<string | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    fetchProducts()
  }, [sortBy, selectedCategory, priceRange])

  const fetchProducts = async () => {
    setLoading(true)
    let query = supabase.from('products').select('*')

    if (selectedCategory) {
      query = query.eq('category', selectedCategory)
    }

    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number)
      query = query.gte('price', min)
      if (max) query = query.lte('price', max)
    }

    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true })
        break
      case 'price-high':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      default:
        query = query.order('created_at', { ascending: false })
    }

    const { data } = await query
    setProducts(data || [])
    setLoading(false)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books']
  const priceRanges = [
    { label: 'Under ₹500', value: '0-500' },
    { label: '₹500 - ₹1000', value: '500-1000' },
    { label: '₹1000 - ₹2500', value: '1000-2500' },
    { label: 'Above ₹2500', value: '2500-999999' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">All Products</h1>
        <p className="mt-2 text-muted-foreground">
          Browse our entire collection of quality products
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 rounded-lg border bg-muted/30 p-6 animate-fadeIn">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Category Filter */}
            <div>
              <h3 className="mb-3 font-semibold flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="mb-3 font-semibold">Price Range</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={priceRange === null ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setPriceRange(null)}
                >
                  All
                </Badge>
                {priceRanges.map((range) => (
                  <Badge
                    key={range.value}
                    variant={priceRange === range.value ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setPriceRange(range.value)}
                  >
                    {range.label}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            <div>
              <h3 className="mb-3 font-semibold">Active Filters</h3>
              {(selectedCategory || priceRange) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null)
                    setPriceRange(null)
                  }}
                >
                  Clear All
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">No filters applied</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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
          <p className="text-muted-foreground">
            No products found matching your criteria.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory(null)
              setPriceRange(null)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
