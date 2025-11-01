'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCartStore } from '@/lib/store/cart'
import { formatPrice } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, Smartphone, Calendar, Clock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  readonly amount: number
  readonly onPaymentSuccess: (paymentIntentId: string) => void
  readonly onPaymentError: (error: string) => void
}

function PaymentForm({ amount, onPaymentSuccess, onPaymentError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { data: { clientSecret } } = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      }).then(res => res.json())

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        onPaymentError('Card element not found')
        return
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        onPaymentError(error.message || 'Payment failed')
      } else if (paymentIntent?.status === 'succeeded') {
        onPaymentSuccess(paymentIntent.id)
      }
    } catch (err) {
      console.error('Payment error:', err)
      onPaymentError('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="card-element" className="text-sm font-medium">Card Information</label>
        <div id="card-element" className="p-3 border rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay ${formatPrice(amount)}`}
      </Button>
    </form>
  )
}

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
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [emiMonths, setEmiMonths] = useState('3')
  const [upiId, setUpiId] = useState('')
  const [paymentError, setPaymentError] = useState('')

  const shippingFee = total > 500 ? 0 : 50
  const finalTotal = total + shippingFee

  const calculateEMI = (months: number) => {
    const principal = finalTotal
    const annualInterest = 0.12 // 12% annual interest
    const monthlyInterest = annualInterest / 12
    const emi = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, months)) /
                (Math.pow(1 + monthlyInterest, months) - 1)
    return Math.round(emi)
  }

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    setLoading(true)
    setPaymentError('')

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
          payment_status: 'paid',
          payment_method: paymentMethod,
          payment_intent_id: paymentIntentId,
          ...(paymentMethod === 'emi' && { emi_months: Number.parseInt(emiMonths) }),
        })
      }

      clearCart()
      router.push('/orders')
    } catch (error) {
      console.error('Order creation error:', error)
      setPaymentError('Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentError = (error: string) => {
    setPaymentError(error)
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPaymentError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      if (paymentMethod === 'card') {
        // Payment will be handled by Stripe Elements
        return
      }

      if (paymentMethod === 'upi' && !upiId.trim()) {
        setPaymentError('Please enter UPI ID')
        setLoading(false)
        return
      }

      // For UPI, EMI, and Pay Later - create order with pending payment
      const ordersBySeller = items.reduce((acc, item) => {
        if (!acc[item.seller_id]) {
          acc[item.seller_id] = []
        }
        acc[item.seller_id].push(item)
        return acc
      }, {} as Record<string, typeof items>)

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
          payment_status: paymentMethod === 'pay_later' ? 'pending' : 'unpaid',
          payment_method: paymentMethod,
          ...(paymentMethod === 'upi' && { upi_id: upiId }),
          ...(paymentMethod === 'emi' && { emi_months: Number.parseInt(emiMonths) }),
        })
      }

      clearCart()
      router.push('/orders')
    } catch (error) {
      console.error('Checkout error:', error)
      setPaymentError('Failed to place order')
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
                    <label htmlFor="full-name" className="text-sm font-medium">Full Name</label>
                    <Input
                      id="full-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-medium">State</label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="text-sm font-medium">Pincode</label>
                    <Input
                      id="pincode"
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

          {/* Payment Method Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span className="hidden sm:inline">Card</span>
                  </TabsTrigger>
                  <TabsTrigger value="upi" className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="hidden sm:inline">UPI</span>
                  </TabsTrigger>
                  <TabsTrigger value="emi" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">EMI</span>
                  </TabsTrigger>
                  <TabsTrigger value="pay_later" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">Pay Later</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pay securely with your credit or debit card
                    </p>
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        amount={finalTotal}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentError={handlePaymentError}
                      />
                    </Elements>
                  </div>
                </TabsContent>

                <TabsContent value="upi" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pay using UPI ID or scan QR code
                    </p>
                    <div className="space-y-2">
                      <label htmlFor="upi-id" className="text-sm font-medium">UPI ID</label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={loading || !upiId.trim()}
                    >
                      {loading ? 'Processing...' : `Pay ${formatPrice(finalTotal)} with UPI`}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="emi" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Split your payment into easy monthly installments
                    </p>
                    <div className="space-y-2">
                      <label htmlFor="emi-tenure" className="text-sm font-medium">EMI Tenure</label>
                      <Select value={emiMonths} onValueChange={setEmiMonths}>
                        <SelectTrigger id="emi-tenure">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 Months - {formatPrice(calculateEMI(3))}/month</SelectItem>
                          <SelectItem value="6">6 Months - {formatPrice(calculateEMI(6))}/month</SelectItem>
                          <SelectItem value="9">9 Months - {formatPrice(calculateEMI(9))}/month</SelectItem>
                          <SelectItem value="12">12 Months - {formatPrice(calculateEMI(12))}/month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 bg-muted rounded-md">
                      <div className="flex justify-between text-sm">
                        <span>Total Amount:</span>
                        <span>{formatPrice(finalTotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Monthly EMI:</span>
                        <span>{formatPrice(calculateEMI(Number.parseInt(emiMonths)))}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total with Interest:</span>
                        <span>{formatPrice(calculateEMI(Number.parseInt(emiMonths)) * Number.parseInt(emiMonths))}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : `Start EMI - ${formatPrice(calculateEMI(Number.parseInt(emiMonths)))}/month`}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="pay_later" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Pay after delivery. No payment required now.
                    </p>
                    <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✓ Pay after receiving your order<br />
                        ✓ 7 days payment window<br />
                        ✓ No interest or fees
                      </p>
                    </div>
                    <Button
                      onClick={handleSubmit}
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order - Pay Later'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {paymentError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-700 dark:text-red-300">{paymentError}</p>
                </div>
              )}
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

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
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
