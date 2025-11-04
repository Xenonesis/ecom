'use client'

import { useState, useEffect } from 'react'
import { 
  Store, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Eye,
  Star,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface SellerStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  averageRating: number
  activeProducts: number
  lowStockProducts: number
  pendingOrders: number
  thisMonthRevenue: number
  lastMonthRevenue: number
  viewsThisMonth: number
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeProducts: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    viewsThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadSellerData()
  }, [])

  const loadSellerData = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Get seller's products
      const { data: products, count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('seller_id', user.id)

      // Count active products (stock > 0)
      const activeCount = products?.filter(p => p.stock > 0).length || 0
      
      // Count low stock products (stock <= 10 but > 0)
      const lowStockCount = products?.filter(p => p.stock > 0 && p.stock <= 10).length || 0

      // Calculate average rating
      const avgRating = products && products.length > 0
        ? products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length
        : 0

      // Get orders for seller's products
      const { data: orders, count: ordersCount } = await supabase
        .from('orders')
        .select('*, items')
        .contains('items', [{ seller_id: user.id }])
        .limit(5)
        .order('created_at', { ascending: false })

      // Calculate revenue (mock calculation)
      const totalRevenue = (ordersCount || 0) * 1200
      const thisMonthRevenue = totalRevenue * 0.3 // Mock 30% this month
      const lastMonthRevenue = totalRevenue * 0.25 // Mock 25% last month

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue,
        averageRating: avgRating,
        activeProducts: activeCount,
        lowStockProducts: lowStockCount,
        pendingOrders: 3, // Mock pending orders
        thisMonthRevenue,
        lastMonthRevenue,
        viewsThisMonth: Math.floor(Math.random() * 5000) + 1000,
      })

      setRecentOrders(orders || [])
    } catch (error) {
      console.error('Error loading seller data:', error)
    } finally {
      setLoading(false)
    }
  }

  const revenueGrowth = stats.lastMonthRevenue > 0 
    ? ((stats.thisMonthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue * 100).toFixed(1)
    : 0

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      trend: `+${revenueGrowth}%`,
      trendUp: parseFloat(revenueGrowth.toString()) > 0,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      trend: `${stats.pendingOrders} pending`,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      trend: `${stats.activeProducts} active`,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      trend: 'Store rating',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  const alertCards = [
    {
      title: 'Low Stock Items',
      value: stats.lowStockProducts,
      description: 'Products need restocking',
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      action: '/seller/products',
    },
    {
      title: 'This Month Revenue',
      value: `₹${stats.thisMonthRevenue.toLocaleString()}`,
      description: 'Current month earnings',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Product Views',
      value: stats.viewsThisMonth.toLocaleString(),
      description: 'Total views this month',
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-8 w-8" />
            Seller Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your store and track performance
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/seller/products">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Alert Cards */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        {alertCards.map((alert) => {
          const Icon = alert.icon
          return (
            <Card key={alert.title} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${alert.bgColor}`}>
                    <Icon className={`h-5 w-5 ${alert.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{alert.value}</p>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">{alert.title}</p>
                <p className="text-xs text-muted-foreground">{alert.description}</p>
                {alert.action && (
                  <Link href={alert.action}>
                    <Button variant="link" className="px-0 mt-2 h-auto">
                      View Details →
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/seller/products">
              <Button variant="outline" className="w-full justify-start">
                <Package className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link href="/seller/orders">
              <Button variant="outline" className="w-full justify-start">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Orders
              </Button>
            </Link>
            <Link href="/seller/analytics">
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{order.total_amount}</p>
                      <Badge variant="secondary" className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">
                No recent orders
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Performance Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Tips to Boost Sales
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Add high-quality product images to increase conversions</li>
            <li>• Respond quickly to customer inquiries for better ratings</li>
            <li>• Keep your inventory updated to avoid cancellations</li>
            <li>• Offer competitive pricing and discounts</li>
            <li>• Maintain good seller ratings by providing quality service</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
