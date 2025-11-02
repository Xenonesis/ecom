'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Star, ShoppingCart, Heart, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cart'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  images: string[]
  description: string
  rating: number
  seller_id: string
  stock: number
  category: string
}

interface QuickViewModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
}

export function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  if (!product) return null

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount)

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      quantity,
      image: product.images[0] || '/placeholder.svg',
      seller_id: product.seller_id,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Quick View</span>
            <Link 
              href={`/product/${product.id}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
              onClick={onClose}
            >
              Full Details <ExternalLink className="h-3 w-3" />
            </Link>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
              />
              {product.discount > 0 && (
                <Badge className="absolute left-2 top-2 bg-red-500">
                  {product.discount}% OFF
                </Badge>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <Badge variant="outline" className="mt-2">
                {product.category}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating.toFixed(1)})
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(discountedPrice)}
              </span>
              {product.discount > 0 && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-3">
              {product.description}
            </p>

            {product.stock > 0 && product.stock <= 10 && (
              <Badge variant="warning">
                Only {product.stock} left in stock!
              </Badge>
            )}

            {product.stock === 0 && (
              <Badge variant="destructive">Out of Stock</Badge>
            )}

            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <Link href={`/product/${product.id}`} onClick={onClose}>
              <Button variant="outline" className="w-full">
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
