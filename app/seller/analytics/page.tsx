'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Eye,
  ShoppingCart,
  DollarSign,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'

export default function SellerAnalyticsPage() {
  const [data, setData] = useState({
    salesByMonth: [] as { month: string; sales: number }[],
    topProducts: [] as any[],
    productPerformance: [] as any[],
    recentActivity: [] as any[],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      // Load seller's products
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('rating', { ascending: false })

      setData({
        salesByMonth: generateMockSalesData(),
        topProducts: products?.slice(0, 5) || [],
        productPerformance: products?.map(p => ({
          name: p.name,
          views: Math.floor(Math.random() * 1000) + 100,
          sales: Math.floor(Math.random() * 50) + 10,
          revenue: p.price * (Math.floor(Math.random() * 50) + 10),
        })) || [],
        recentActivity: generateMockActivity(),
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockSalesData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      sales: Math.floor(Math.random() * 50000) + 20000
    }))
  }

  const generateMockActivity = () => {
    return [
      { type: 'sale', message: 'Product sold: Wireless Headphones', time: '2 hours ago' },
      { type: 'view', message: 'Product viewed: Smart Watch', time: '3 hours ago' },
      { type: 'sale', message: 'Product sold: Running Shoes', time: '5 hours ago' },
      { type: 'review', message: 'New review received: 5 stars', time: '1 day ago' },
    ]
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    )
  }

  const totalRevenue = data.salesByMonth.reduce((acc, item) => acc + item.sales, 0)
  const totalViews = data.productPerformance.reduce((acc, item) => acc + item.views, 0)
  const totalSales = data.productPerformance.reduce((acc, item) => acc + item.sales, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Sales Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Track your store performance and insights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-50">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-50">
                <ShoppingCart className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">{totalSales}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Sales */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Sales Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.salesByMonth.map((item) => (
              <div key={item.month}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.month}</span>
                  <span className="text-sm font-bold">₹{item.sales.toLocaleString()}</span>
                </div>
                <Progress value={(item.sales / 70000) * 100} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Rating: {product.rating?.toFixed(1) || 'N/A'} | Stock: {product.stock}
                    </p>
                  </div>
                  <span className="text-sm font-bold">₹{product.price}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.productPerformance.slice(0, 5).map((product) => (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium truncate">{product.name}</span>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{product.views} views</p>
                      <p className="text-xs font-bold">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={(product.sales / 100) * 100} className="flex-1" />
                    <span className="text-xs font-medium">₹{product.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'sale' ? 'bg-green-50' :
                  activity.type === 'view' ? 'bg-blue-50' :
                  'bg-yellow-50'
                }`}>
                  {activity.type === 'sale' && <ShoppingCart className="h-4 w-4 text-green-600" />}
                  {activity.type === 'view' && <Eye className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'review' && <BarChart3 className="h-4 w-4 text-yellow-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
