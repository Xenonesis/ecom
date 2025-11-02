'use client'

import { useState, useEffect, useCallback } from 'react'
import { Filter, Search, SlidersHorizontal, Grid3X3, List, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { PriceRangeSlider } from '@/components/price-range-slider'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProductGridSkeleton } from '@/components/skeleton-loader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import InfiniteScroll from 'react-infinite-scroll-component'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const ITEMS_PER_PAGE = 12
  
  const supabase = createClient()

  const fetchAllProducts = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('products').select('*')

    if (selectedCategory) {
      query = query.eq('category', selectedCategory)
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
    setAllProducts(data || [])
    setProducts((data || []).slice(0, ITEMS_PER_PAGE))
    setPage(1)
    setHasMore((data || []).length > ITEMS_PER_PAGE)
    setLoading(false)
  }, [sortBy, selectedCategory, supabase])

  useEffect(() => {
    // Fetch products on mount and when dependencies change
    void fetchAllProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, selectedCategory])

  const loadMore = () => {
    const nextPage = page + 1
    const startIndex = page * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newProducts = filteredProducts.slice(startIndex, endIndex)
    
    setProducts([...products, ...newProducts])
    setPage(nextPage)
    setHasMore(endIndex < filteredProducts.length)
  }

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.category) // Using category as brand placeholder
    const matchesRating = selectedRating === null || product.rating >= selectedRating
    
    return matchesSearch && matchesPrice && matchesBrand && matchesRating
  })

  const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books', 'Watches', 'Laptops', 'Audio']
  const brands = Array.from(new Set(allProducts.map(p => p.category)))
  const ratings = [4, 3, 2, 1]

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />
      
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
          <div className="flex gap-1 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
              <PriceRangeSlider
                min={0}
                max={10000}
                value={priceRange}
                onChange={(value) => setPriceRange(value as [number, number])}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="mb-3 font-semibold">Brand</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleBrandToggle(brand)}
                    />
                    <Label
                      htmlFor={`brand-${brand}`}
                      className="text-sm cursor-pointer"
                    >
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="mb-3 font-semibold">Minimum Rating</h3>
              <div className="space-y-2">
                <Badge
                  variant={selectedRating === null ? 'default' : 'outline'}
                  className="cursor-pointer mb-2"
                  onClick={() => setSelectedRating(null)}
                >
                  All Ratings
                </Badge>
                {ratings.map((rating) => (
                  <div
                    key={rating}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted ${
                      selectedRating === rating ? 'bg-muted' : ''
                    }`}
                    onClick={() => setSelectedRating(rating)}
                  >
                    <div className="flex">
                      {[...new Array(rating)].map((_, i) => (
                        <Star key={`star-${rating}-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-sm">& Up</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedCategory || selectedBrands.length > 0 || selectedRating !== null || priceRange[0] !== 0 || priceRange[1] !== 10000) && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory(null)
                  setSelectedBrands([])
                  setSelectedRating(null)
                  setPriceRange([0, 10000])
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Products Grid/List with Infinite Scroll */}
      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : filteredProducts.length > 0 ? (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="col-span-full flex justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                <span className="text-sm text-muted-foreground">Loading more...</span>
              </div>
            </div>
          }
          endMessage={
            <div className="col-span-full text-center py-8">
              <p className="text-sm text-muted-foreground">You&apos;ve seen all products</p>
            </div>
          }
        >
          {viewMode === 'grid' ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
                return (
                  <div
                    key={product.id}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <Link href={`/product/${product.id}`} className="relative w-48 h-48 shrink-0 bg-muted rounded-lg overflow-hidden">
                      <Image
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="text-lg font-semibold hover:text-primary transition-colors mb-2">
                            {product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[...new Array(5)].map((_, i) => (
                              <Star
                                key={`list-star-${product.id}-${i}`}
                                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({product.rating.toFixed(1)})
                          </span>
                        </div>
                        <Badge variant="outline" className="mb-2">
                          {product.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-primary">{formatPrice(discountedPrice)}</span>
                          {product.discount > 0 && (
                            <>
                              <span className="text-sm text-muted-foreground line-through">
                                {formatPrice(product.price)}
                              </span>
                              <Badge className="bg-red-500">
                                {product.discount}% OFF
                              </Badge>
                            </>
                          )}
                        </div>
                        <Link href={`/product/${product.id}`}>
                          <Button>View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </InfiniteScroll>
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
              setPriceRange([0, 10000])
              setSelectedBrands([])
              setSelectedRating(null)
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
