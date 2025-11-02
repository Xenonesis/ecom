'use client'

import { useState } from 'react'
import { Heart, Share2, ShoppingCart, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { EmptyState } from '@/components/empty-state'
import { useCartStore } from '@/lib/store/cart'
import { useNotification } from '@/components/toast-notifications'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

interface WishlistItem {
  id: string
  product_id: string
  name: string
  price: number
  discount: number | null
  image: string
  stock: number
  category: string
}

export default function EnhancedWishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() => {
    // Initialize state from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('wishlist')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const addItem = useCartStore((state) => state.addItem)
  const notify = useNotification()

  const removeFromWishlist = (productId: string) => {
    const updated = wishlist.filter(item => item.product_id !== productId)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    notify.info('Removed from wishlist')
  }

  const addToCart = (item: WishlistItem) => {
    addItem({
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      discount: item.discount || 0,
      quantity: 1,
      image: item.image,
      seller_id: '',
    })
    notify.success('Added to cart!')
  }

  const addAllToCart = () => {
    wishlist.forEach(item => {
      if (item.stock > 0) {
        addToCart(item)
      }
    })
    notify.success(`Added ${wishlist.filter(i => i.stock > 0).length} items to cart!`)
  }

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  const removeSelected = () => {
    const updated = wishlist.filter(item => !selectedItems.has(item.id))
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
    setSelectedItems(new Set())
    notify.info(`Removed ${selectedItems.size} items from wishlist`)
  }

  const shareWishlist = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Wishlist',
        text: 'Check out my wishlist on ShopHub!',
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      notify.success('Link copied to clipboard!')
    }
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs className="mb-6" />
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Save items you love to buy them later"
          actionLabel="Start Shopping"
          actionHref="/products"
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Heart className="h-8 w-8 fill-red-500 text-red-500" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={shareWishlist}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          {selectedItems.size > 0 && (
            <Button variant="destructive" onClick={removeSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Remove Selected ({selectedItems.size})
            </Button>
          )}
          <Button onClick={addAllToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add All to Cart
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {wishlist.map((item) => {
          const discountedPrice = calculateDiscountedPrice(item.price, item.discount || 0)
          const isSelected = selectedItems.has(item.id)

          return (
            <Card key={item.id} className={`relative overflow-hidden transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <div className="absolute top-2 left-2 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelectItem(item.id)}
                  className="h-5 w-5 rounded border-gray-300 cursor-pointer"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 bg-background/80 hover:bg-background"
                onClick={() => removeFromWishlist(item.product_id)}
              >
                <X className="h-4 w-4" />
              </Button>

              <Link href={`/product/${item.product_id}`}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                  {item.discount && item.discount > 0 && (
                    <Badge className="absolute bottom-2 right-2 bg-red-500">
                      {item.discount}% OFF
                    </Badge>
                  )}
                  {item.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive">Out of Stock</Badge>
                    </div>
                  )}
                </div>
              </Link>

              <CardContent className="p-4">
                <Link href={`/product/${item.product_id}`}>
                  <h3 className="font-medium line-clamp-2 hover:text-primary mb-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(discountedPrice)}
                  </span>
                  {item.discount && item.discount > 0 && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(item.price)}
                    </span>
                  )}
                </div>

                {item.stock > 0 && item.stock <= 10 && (
                  <p className="text-xs text-orange-600 mb-3">
                    Only {item.stock} left in stock
                  </p>
                )}

                <Button
                  className="w-full"
                  onClick={() => addToCart(item)}
                  disabled={item.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {item.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {wishlist.length > 0 && (
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Items in your wishlist are saved automatically. Share your wishlist with friends and family!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
