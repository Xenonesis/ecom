'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, X, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  price: number
  discount: number | null
  images: string[] | null
  category: string
}

interface AdvancedSearchProps {
  placeholder?: string
  className?: string
}

export function AdvancedSearch({ placeholder = 'Search products...', className = '' }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState([
    'iPhone', 'Laptop', 'Headphones', 'Shoes', 'Watch', 'Camera'
  ])
  
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: { min: 0, max: 100000 },
    inStock: true,
    onSale: false,
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  const saveRecentSearch = (search: string) => {
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setLoading(true)

    try {
      let query = supabase
        .from('products')
        .select('id, name, price, discount, images, category')
        .ilike('name', `%${searchQuery}%`)
        .limit(5)

      if (filters.inStock) {
        query = query.gt('stock', 0)
      }

      if (filters.onSale) {
        query = query.gt('discount', 0)
      }

      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories)
      }

      const { data, error } = await query

      if (!error && data) {
        setResults(data)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, supabase])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchProducts(query)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, searchProducts])

  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    setShowResults(true)
    if (searchTerm) {
      saveRecentSearch(searchTerm)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      saveRecentSearch(query)
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setShowResults(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
  }

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-20 h-11"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setShowFilters(true)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowResults(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-xl z-50 max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : query && results.length > 0 ? (
              <div>
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">Search Results</p>
                </div>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-3 p-3 hover:bg-muted transition-colors"
                  >
                    <div className="relative h-16 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <Image
                        src={product.images?.[0] || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-primary">
                          {formatPrice(product.price * (1 - (product.discount || 0) / 100))}
                        </span>
                        {product.discount && product.discount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {product.discount}% OFF
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="p-3 border-t">
                  <Button
                    variant="link"
                    className="w-full"
                    onClick={() => {
                      router.push(`/products?search=${encodeURIComponent(query)}`)
                      setShowResults(false)
                    }}
                  >
                    View all results for "{query}"
                  </Button>
                </div>
              </div>
            ) : query ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                {recentSearches.length > 0 && (
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium mb-2">Recent Searches</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Sparkles className="h-4 w-4" />
                    Popular Searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Advanced Filters Dialog */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Categories</Label>
              <div className="space-y-2">
                {['Electronics', 'Fashion', 'Home & Garden', 'Sports'].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={(checked) => {
                        setFilters((prev) => ({
                          ...prev,
                          categories: checked
                            ? [...prev.categories, category]
                            : prev.categories.filter((c) => c !== category),
                        }))
                      }}
                    />
                    <Label htmlFor={category} className="cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, inStock: checked as boolean }))
                }
              />
              <Label htmlFor="inStock" className="cursor-pointer">
                In Stock Only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="onSale"
                checked={filters.onSale}
                onCheckedChange={(checked) =>
                  setFilters((prev) => ({ ...prev, onSale: checked as boolean }))
                }
              />
              <Label htmlFor="onSale" className="cursor-pointer">
                On Sale Only
              </Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setFilters({
                    categories: [],
                    priceRange: { min: 0, max: 100000 },
                    inStock: true,
                    onSale: false,
                  })
                }}
              >
                Reset
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  setShowFilters(false)
                  if (query) {
                    searchProducts(query)
                  }
                }}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
