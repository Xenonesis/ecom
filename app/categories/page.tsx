'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Grid, List, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  name: string
  count: number
  image: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const supabase = createClient()

  const fetchCategories = async () => {
    setLoading(true)
    
    // Fetch all products to count by category
    const { data: allProducts } = await supabase
      .from('products')
      .select('category, images')
    
    if (allProducts) {
      const categoryMap = new Map<string, { count: number; image: string }>()
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allProducts.forEach((product: any) => {
        const existing = categoryMap.get(product.category) || { count: 0, image: '' }
        categoryMap.set(product.category, {
          count: existing.count + 1,
          image: existing.image || (product.images && product.images[0]) || ''
        })
      })
      
      const categoriesArray = Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        image: data.image
      }))
      
      setCategories(categoriesArray)
    }
    
    setLoading(false)
  }

  const fetchCategoryProducts = async (category: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })

    setProducts(data || [])
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchCategories()
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory)
    }
  }, [selectedCategory])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Shop by Category</h1>
        <p className="mt-2 text-muted-foreground">
          Browse products organized by categories
        </p>
      </div>

      {/* Categories Grid */}
      {!selectedCategory && (
        <div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className="group relative overflow-hidden rounded-lg border bg-background transition-all hover:shadow-lg"
                >
                  <div className="aspect-video w-full overflow-hidden bg-muted">
                    {category.image ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          className="object-cover transition-transform group-hover:scale-110"
                        />
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl font-bold text-muted-foreground/20">
                        {category.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {category.count} {category.count === 1 ? 'product' : 'products'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed py-20 text-center">
              <p className="text-muted-foreground">No categories available.</p>
            </div>
          )}
        </div>
      )}

      {/* Category Products */}
      {selectedCategory && (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="gap-2"
              >
                ← Back to Categories
              </Button>
              <h2 className="text-2xl font-bold">{selectedCategory}</h2>
              <Badge variant="secondary">{products.length} products</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

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
          ) : products.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-4' : 'space-y-4'}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed py-20 text-center">
              <p className="text-muted-foreground">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
