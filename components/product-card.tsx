'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  images: string[]
  rating: number
  seller_id: string
  stock: number
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((state) => state.addItem)
  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

  const handleAddToCart = async () => {
    setAdding(true)
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity: 1,
      image: product.images[0] || '/placeholder.png',
      seller_id: product.seller_id,
    })
    
    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300))
    setAdding(false)
  }

  return (
    <Card 
      className="group overflow-hidden border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {product.discount > 0 && (
            <Badge className="absolute left-2 top-2 bg-red-500 hover:bg-red-600">
              {product.discount}% OFF
            </Badge>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                Out of Stock
              </Badge>
            </div>
          )}
          
          {/* Quick Actions on Hover */}
          <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={(e) => {
                e.preventDefault()
                setIsWishlisted(!isWishlisted)
              }}
            >
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={(e) => e.preventDefault()}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">{formatPrice(discountedPrice)}</span>
          {product.discount > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {product.stock > 0 && product.stock <= 10 && (
          <Badge variant="warning" className="mt-2">
            Only {product.stock} left!
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full group/btn"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
        >
          <ShoppingCart className="mr-2 h-4 w-4 transition-transform group-hover/btn:scale-110" />
          {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  )
}
