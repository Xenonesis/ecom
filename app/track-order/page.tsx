'use client'

import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { Badge } from '@/components/ui/badge'

interface TrackingEvent {
  status: string
  location: string
  timestamp: Date
  description: string
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [email, setEmail] = useState('')
  const [tracking, setTracking] = useState<{
    orderId: string
    status: string
    estimatedDelivery: string
    currentLocation: string
    events: TrackingEvent[]
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setTracking({
        orderId: orderId,
        status: 'In Transit',
        estimatedDelivery: 'Dec 28, 2024',
        currentLocation: 'Distribution Center, Mumbai',
        events: [
          {
            status: 'Order Confirmed',
            location: 'ShopHub Warehouse',
            timestamp: new Date('2024-12-24T10:00:00'),
            description: 'Your order has been confirmed and is being prepared',
          },
          {
            status: 'Order Packed',
            location: 'ShopHub Warehouse',
            timestamp: new Date('2024-12-24T14:30:00'),
            description: 'Your order has been packed and is ready for shipment',
          },
          {
            status: 'Picked Up',
            location: 'ShopHub Warehouse',
            timestamp: new Date('2024-12-25T09:00:00'),
            description: 'Package picked up by courier partner',
          },
          {
            status: 'In Transit',
            location: 'Distribution Center, Mumbai',
            timestamp: new Date('2024-12-26T16:00:00'),
            description: 'Package is in transit to your location',
          },
        ],
      })
      setLoading(false)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Order Confirmed':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'Order Packed':
        return <Package className="h-6 w-6 text-blue-500" />
      case 'Picked Up':
        return <Truck className="h-6 w-6 text-orange-500" />
      case 'In Transit':
        return <Truck className="h-6 w-6 text-blue-500" />
      case 'Out for Delivery':
        return <Truck className="h-6 w-6 text-green-500" />
      case 'Delivered':
        return <CheckCircle className="h-6 w-6 text-green-600" />
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="mb-12 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Enter your order ID and email to track your shipment in real-time
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Enter Tracking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-123456"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  'Tracking...'
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Track Order
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {tracking && (
          <div className="mt-8 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order #{tracking.orderId}</CardTitle>
                  <Badge variant="default" className="text-sm">
                    {tracking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Location</p>
                    <p className="font-medium">{tracking.currentLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{tracking.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="relative pl-8 space-y-6 mt-8">
                  {tracking.events.map((event, index) => (
                    <div key={index} className="relative">
                      {index !== tracking.events.length - 1 && (
                        <div className="absolute left-3 top-8 h-full w-0.5 bg-border" />
                      )}
                      <div className="absolute left-0 -ml-8">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold">{event.status}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {event.location}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                            {event.timestamp.toLocaleDateString()} {event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order, our support team is here to help.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">Contact Support</Button>
                  <Button variant="outline">Live Chat</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
