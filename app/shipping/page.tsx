'use client'

import { Truck, Package, Clock, MapPin, Shield } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function ShippingPage() {
  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Delivery',
      duration: '3-5 Business Days',
      cost: '₹50 (Free on orders ₹500+)',
      description: 'Reliable delivery to your doorstep',
    },
    {
      icon: Package,
      title: 'Express Delivery',
      duration: '1-2 Business Days',
      cost: '₹150',
      description: 'Fast delivery for urgent orders',
    },
    {
      icon: Clock,
      title: 'Same Day Delivery',
      duration: 'Within 24 Hours',
      cost: '₹250',
      description: 'Available in select cities',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We deliver across the country with multiple shipping options to meet your needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        {shippingOptions.map((option) => {
          const Icon = option.icon
          return (
            <Card key={option.title} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10 w-fit">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{option.title}</CardTitle>
                <CardDescription className="text-lg font-semibold text-foreground">
                  {option.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-primary font-semibold mb-2">{option.cost}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We deliver to all serviceable pin codes across India. Enter your pin code at checkout 
              to check availability and estimated delivery date.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Major Cities</h4>
                <p className="text-sm text-muted-foreground">
                  Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, and 100+ cities
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Other Areas</h4>
                <p className="text-sm text-muted-foreground">
                  We deliver to 25,000+ pin codes across India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Orders are processed within 24 hours of placement. You will receive a confirmation 
              email with tracking details once your order is shipped.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  1
                </div>
                <div>
                  <h4 className="font-semibold">Order Confirmed</h4>
                  <p className="text-sm text-muted-foreground">
                    You receive an order confirmation email
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  2
                </div>
                <div>
                  <h4 className="font-semibold">Order Processed</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order is packed and ready for shipment
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  3
                </div>
                <div>
                  <h4 className="font-semibold">Order Shipped</h4>
                  <p className="text-sm text-muted-foreground">
                    You receive tracking information via email
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  4
                </div>
                <div>
                  <h4 className="font-semibold">Order Delivered</h4>
                  <p className="text-sm text-muted-foreground">
                    Your order arrives at your doorstep
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Safe Delivery Promise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Secure packaging for all orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Real-time tracking available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Contactless delivery option available</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span>Insurance coverage on all shipments</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
