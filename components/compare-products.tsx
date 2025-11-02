'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Product {
  id: string
  name: string
  price: number
  discount: number
  images: string[]
  rating: number
  stock: number
  category: string
  description: string
}

interface CompareProductsProps {
  open: boolean
  onClose: () => void
  products: Product[]
  onRemove: (productId: string) => void
}

export function CompareProducts({ open, onClose, products, onRemove }: CompareProductsProps) {
  const maxProducts = 4

  const compareFeatures = [
    { key: 'price', label: 'Price' },
    { key: 'discount', label: 'Discount' },
    { key: 'rating', label: 'Rating' },
    { key: 'stock', label: 'Stock' },
    { key: 'category', label: 'Category' },
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Products</DialogTitle>
        </DialogHeader>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products to compare</p>
            <Button onClick={onClose}>Browse Products</Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-4 border-b font-semibold">Feature</th>
                  {products.map((product) => (
                    <th key={product.id} className="p-4 border-b min-w-[200px]">
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => onRemove(product.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-sm font-medium line-clamp-2">
                          {product.name}
                        </div>
                      </div>
                    </th>
                  ))}
                  {products.length < maxProducts && (
                    <th className="p-4 border-b min-w-[200px]">
                      <div className="flex items-center justify-center h-full min-h-[200px] border-2 border-dashed rounded-lg">
                        <div className="text-center">
                          <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Add Product</p>
                        </div>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {compareFeatures.map((feature) => (
                  <tr key={feature.key} className="border-b">
                    <td className="p-4 font-medium">{feature.label}</td>
                    {products.map((product) => (
                      <td key={product.id} className="p-4 text-center">
                        {renderFeatureValue(feature.key, product)}
                      </td>
                    ))}
                    {products.length < maxProducts && (
                      <td className="p-4"></td>
                    )}
                  </tr>
                ))}
                <tr>
                  <td className="p-4 font-medium">Actions</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-4">
                      <div className="space-y-2">
                        <Link href={`/product/${product.id}`} className="block">
                          <Button variant="outline" className="w-full" size="sm">
                            View Details
                          </Button>
                        </Link>
                        <Button className="w-full" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </td>
                  ))}
                  {products.length < maxProducts && (
                    <td className="p-4"></td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function renderFeatureValue(key: string, product: Product) {
  switch (key) {
    case 'price':
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount)
      return (
        <div className="space-y-1">
          <div className="text-lg font-bold text-primary">
            {formatPrice(discountedPrice)}
          </div>
          {product.discount > 0 && (
            <div className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </div>
          )}
        </div>
      )
    case 'discount':
      return product.discount > 0 ? (
        <Badge variant="destructive">{product.discount}% OFF</Badge>
      ) : (
        <span className="text-muted-foreground">No discount</span>
      )
    case 'rating':
      return (
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{product.rating.toFixed(1)}</span>
        </div>
      )
    case 'stock':
      return product.stock > 0 ? (
        <Badge variant="outline" className="bg-green-50">
          <Check className="h-3 w-3 mr-1" />
          In Stock ({product.stock})
        </Badge>
      ) : (
        <Badge variant="destructive">Out of Stock</Badge>
      )
    case 'category':
      return <Badge variant="secondary">{product.category}</Badge>
    default:
      return null
  }
}

// Hook to manage comparison
export function useCompareProducts() {
  const [compareProducts, setCompareProducts] = useState<Product[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('compareProducts')
    if (saved) {
      setCompareProducts(JSON.parse(saved))
    }
  }, [])

  const addToCompare = (product: Product) => {
    setCompareProducts((prev) => {
      if (prev.length >= 4) {
        notify.warning('You can only compare up to 4 products')
        return prev
      }
      if (prev.some((p) => p.id === product.id)) {
        return prev
      }
      const updated = [...prev, product]
      localStorage.setItem('compareProducts', JSON.stringify(updated))
      return updated
    })
  }

  const removeFromCompare = (productId: string) => {
    setCompareProducts((prev) => {
      const updated = prev.filter((p) => p.id !== productId)
      localStorage.setItem('compareProducts', JSON.stringify(updated))
      return updated
    })
  }

  const clearCompare = () => {
    setCompareProducts([])
    localStorage.removeItem('compareProducts')
  }

  return {
    compareProducts,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isOpen,
    setIsOpen,
  }
}
