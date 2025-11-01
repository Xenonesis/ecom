'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  price: number
  discount: number
  images: string[]
  category: string
  rating: number
}

export function SearchAutocomplete() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (query.trim().length < 2) {
        setResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
        const data = await response.json()
        setResults(data.products || [])
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300) // Debounce
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
      setShowResults(false)
      setQuery('')
    }
  }

  const handleResultClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setShowResults(false)
    setQuery('')
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length >= 2 && setShowResults(true)}
            className="pl-10 pr-10 bg-muted/50"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
          )}
        </div>
      </form>

      {/* Autocomplete Results */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {results.map((product) => {
            const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
            return (
              <button
                key={product.id}
                onClick={() => handleResultClick(product.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
              >
                <div className="relative w-12 h-12 shrink-0 bg-muted rounded">
                  <Image
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-semibold text-primary">
                      {formatPrice(discountedPrice)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {product.category}
                </div>
              </button>
            )
          })}
          <div className="border-t p-2 bg-muted/30">
            <button
              onClick={() => {
                router.push(`/products?search=${encodeURIComponent(query)}`)
                setShowResults(false)
                setQuery('')
              }}
              className="w-full text-sm text-center text-primary hover:underline py-1"
            >
              See all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        </div>
      )}

      {showResults && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg p-4 z-50">
          <p className="text-sm text-muted-foreground text-center">No products found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
