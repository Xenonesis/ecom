'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground/50" />
        <h1 className="mt-6 mb-4 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mb-8 text-muted-foreground">Discover amazing products and start shopping!</p>
        <Link href="/products">
          <Button size="lg">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Shopping Cart</h1>
        <p className="mt-2 text-muted-foreground">
          {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
        </p>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const itemPrice = calculateDiscountedPrice(item.price, item.discount)
            return (
              <Card key={item.product_id} className="overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href={`/product/${item.product_id}`} className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-lg flex-shrink-0 bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between gap-3">
                      <div>
                        <Link href={`/product/${item.product_id}`}>
                          <h3 className="font-semibold hover:text-primary transition-colors">{item.name}</h3>
                        </Link>
                        <div className="mt-1 flex items-center gap-2">
                          <p className="text-sm font-medium text-primary">
                            {formatPrice(itemPrice)}
                          </p>
                          {item.discount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {item.discount}% OFF
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="font-bold text-lg">
                          {formatPrice(itemPrice * item.quantity)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 sm:ml-auto"
                          onClick={() => removeItem(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{total > 500 ? 'FREE' : formatPrice(50)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total + (total > 500 ? 0 : 50))}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Link href="/checkout" className="w-full">
                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
