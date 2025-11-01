'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Package, Truck, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

interface Order {
  id: string
  user_id: string
  seller_id: string
  items: any
  total_amount: number
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
  payment_status: 'paid' | 'unpaid' | 'refunded'
  created_at: string
  updated_at: string
  shipping_address: any
}

export default function OrdersClientPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login?redirect=/orders')
        return
      }
      
      fetchOrders()
    }
    
    init()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/orders')
      const data = await response.json()
      
      if (response.ok) {
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: 'secondary',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
    }
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    )
  }

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, any> = {
      paid: 'default',
      unpaid: 'destructive',
      refunded: 'secondary',
    }
    return (
      <Badge variant={variants[status] || 'secondary'} className="capitalize">
        {status}
      </Badge>
    )
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl flex items-center gap-3">
          <Package className="h-8 w-8" />
          My Orders
        </h1>
        <p className="mt-2 text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter} className="mb-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="all">
            All ({orderCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({orderCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="shipped">
            Shipped ({orderCounts.shipped})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({orderCounts.delivered})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getStatusBadge(order.status)}
                    {getPaymentBadge(order.payment_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Total Amount */}
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - #{selectedOrder?.id.slice(0, 8)}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">Order ID:</span>
                                <p className="text-muted-foreground">{selectedOrder.id}</p>
                              </div>
                              <div>
                                <span className="font-semibold">Status:</span>
                                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                              </div>
                              <div>
                                <span className="font-semibold">Payment Status:</span>
                                <div className="mt-1">{getPaymentBadge(selectedOrder.payment_status)}</div>
                              </div>
                              <div>
                                <span className="font-semibold">Total Amount:</span>
                                <p className="text-lg font-bold text-primary">
                                  ₹{selectedOrder.total_amount.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    {order.status === 'delivered' && (
                      <Button variant="outline" size="sm">
                        Leave Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No orders found</h3>
          <p className="mt-2 text-muted-foreground">
            {filter === 'all' 
              ? "You haven't placed any orders yet" 
              : `No ${filter} orders`}
          </p>
          <Button className="mt-6" onClick={() => router.push('/products')}>
            Start Shopping
          </Button>
        </Card>
      )}
    </div>
  )
}
