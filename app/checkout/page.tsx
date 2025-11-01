'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Tag, X } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const total = getTotalPrice()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponError, setCouponError] = useState('')
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  const applyCoupon = async () => {
    if (!couponCode.trim()) return

    setApplyingCoupon(true)
    setCouponError('')

    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error || !coupon) {
        setCouponError('Invalid coupon code')
        setApplyingCoupon(false)
        return
      }

      // Check if coupon is still valid
      const now = new Date()
      const validFrom = new Date(coupon.valid_from)
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null

      if (now < validFrom || (validUntil && now > validUntil)) {
        setCouponError('Coupon has expired')
        setApplyingCoupon(false)
        return
      }

      // Check minimum order amount
      if (total < coupon.min_order_amount) {
        setCouponError(`Minimum order amount is ${formatPrice(coupon.min_order_amount)}`)
        setApplyingCoupon(false)
        return
      }

      // Check usage limit
      if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
        setCouponError('Coupon usage limit reached')
        setApplyingCoupon(false)
        return
      }

      setAppliedCoupon(coupon)
      setCouponCode('')
    } catch (error) {
      console.error('Error applying coupon:', error)
      setCouponError('Failed to apply coupon')
    } finally {
      setApplyingCoupon(false)
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0

    let discount = 0
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (total * appliedCoupon.discount_value) / 100
      if (appliedCoupon.max_discount_amount) {
        discount = Math.min(discount, appliedCoupon.max_discount_amount)
      }
    } else {
      discount = appliedCoupon.discount_value
    }

    return Math.min(discount, total)
  }

  const discount = calculateDiscount()
  const shippingFee = total > 500 ? 0 : 50
  const finalTotal = total - discount + shippingFee

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      // Group items by seller
      const ordersBySeller = items.reduce((acc, item) => {
        if (!acc[item.seller_id]) {
          acc[item.seller_id] = []
        }
        acc[item.seller_id].push(item)
        return acc
      }, {} as Record<string, typeof items>)

      // Create orders for each seller
      for (const [seller_id, sellerItems] of Object.entries(ordersBySeller)) {
        const orderTotal = sellerItems.reduce((sum, item) => {
          const itemPrice = item.price - (item.price * item.discount) / 100
          return sum + itemPrice * item.quantity
        }, 0)

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any).from('orders').insert({
          user_id: user.id,
          seller_id,
          items: sellerItems,
          total_amount: orderTotal,
          shipping_address: formData,
          status: 'pending',
          payment_status: 'unpaid',
        })
      }

      clearCart()
      router.push('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">1</div>
            <span className="ml-2 hidden sm:inline text-sm font-medium">Cart</span>
          </div>
          <div className="h-px w-12 sm:w-24 bg-primary"></div>
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">2</div>
            <span className="ml-2 hidden sm:inline text-sm font-medium">Checkout</span>
          </div>
          <div className="h-px w-12 sm:w-24 bg-border"></div>
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-semibold">3</div>
            <span className="ml-2 hidden sm:inline text-sm">Confirmation</span>
          </div>
        </div>
      </div>

      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pincode</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product_id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Section */}
              <div className="border-t pt-4">
                <div className="mb-3">
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Have a Coupon?
                  </label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      />
                      <Button
                        variant="outline"
                        onClick={applyCoupon}
                        disabled={!couponCode.trim() || applyingCoupon}
                      >
                        {applyingCoupon ? 'Applying...' : 'Apply'}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-600">
                          {appliedCoupon.code}
                        </Badge>
                        <span className="text-sm text-green-700 dark:text-green-300">
                          {appliedCoupon.discount_type === 'percentage'
                            ? `${appliedCoupon.discount_value}% off`
                            : `${formatPrice(appliedCoupon.discount_value)} off`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={removeCoupon}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {couponError && (
                    <p className="text-sm text-red-500 mt-2">{couponError}</p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                <div className="mt-2 flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
