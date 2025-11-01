'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/product-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Heart, ShoppingBag, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WishlistItem {
  id: string
  product_id: string
  product: any
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndFetchWishlist()
  }, [])

  const checkAuthAndFetchWishlist = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      router.push('/login?redirect=/wishlist')
      return
    }
    
    fetchWishlist()
  }

  const fetchWishlist = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/wishlist')
      const data = await response.json()
      
      if (response.ok) {
        setWishlistItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string, productId: string) => {
    setRemoving(itemId)
    
    try {
      const response = await fetch(`/api/wishlist?id=${itemId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemoving(null)
    }
  }

  const addToCart = async (product: any) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      })
      
      if (response.ok) {
        // Optional: Show success message
        alert('Added to cart!')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-4 h-10 w-64" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...new Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl flex items-center gap-3">
            <Heart className="h-8 w-8 fill-primary text-primary" />
            My Wishlist
          </h1>
          <p className="mt-2 text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="group relative">
              <ProductCard product={item.product} />
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => removeFromWishlist(item.id, item.product_id)}
                  disabled={removing === item.id}
                  className="h-8 w-8 shadow-md"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Add to Cart Button */}
              <div className="mt-3">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => addToCart(item.product)}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed py-20 text-center">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
          <p className="mt-2 text-muted-foreground">
            Start adding products you love to your wishlist!
          </p>
          <Button className="mt-6" onClick={() => router.push('/products')}>
            Browse Products
          </Button>
        </div>
      )}
    </div>
  )
}
