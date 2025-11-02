'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice, calculateDiscountedPrice } from '@/lib/utils'
import { useEffect, useState } from 'react'

export default function CartPage() {
  const { items, recommendations, removeItem, updateQuantity, getTotalPrice, clearCart, loadRecommendations } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const total = getTotalPrice()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Load recommendations based on current cart items
  useEffect(() => {
    if (items.length > 0) {
      const productIds = items.map(item => item.product_id)
      loadRecommendations(productIds)
    }
  }, [items, loadRecommendations])

  const applyCoupon = () => {
    // Simple coupon validation
    const validCoupons: Record<string, number> = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME': 15,
    }

    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()])
      setCouponApplied(true)
    } else {
      alert('Invalid coupon code')
    }
  }

  const removeCoupon = () => {
    setDiscount(0)
    setCouponApplied(false)
    setCouponCode('')
  }

  const discountAmount = (total * discount) / 100
  const finalTotal = total - discountAmount

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
      <Breadcrumbs className="mb-6" />
      
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

          {/* Frequently Bought Together Section */}
          {recommendations.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Frequently Bought Together
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Customers who bought these items also bought these
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {recommendations.map((item) => {
                    const itemPrice = calculateDiscountedPrice(item.price, item.discount)
                    return (
                      <div key={item.product_id} className="group">
                        <Link href={`/product/${item.product_id}`} className="block">
                          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted mb-3">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            {item.discount > 0 && (
                              <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                                {item.discount}% OFF
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {item.name}
                          </h4>
                          <p className="text-sm font-semibold text-primary mt-1">
                            {formatPrice(itemPrice)}
                          </p>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Coupon Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Have a coupon?
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  {couponApplied ? (
                    <Button variant="outline" onClick={removeCoupon}>
                      Remove
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={applyCoupon}>
                      Apply
                    </Button>
                  )}
                </div>
                {couponApplied && (
                  <p className="text-xs text-green-600">
                    ✓ Coupon applied! {discount}% off
                  </p>
                )}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{finalTotal > 500 ? 'FREE' : formatPrice(50)}</span>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal + (finalTotal > 500 ? 0 : 50))}</span>
                </div>
                {finalTotal < 500 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Add {formatPrice(500 - finalTotal)} more for free shipping!
                  </p>
                )}
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
