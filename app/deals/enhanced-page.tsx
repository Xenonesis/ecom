'use client'

import { useState, useEffect } from 'react'
import { Zap, Clock, TrendingUp, Tag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { ProductCard } from '@/components/product-card'
import { CountdownTimer } from '@/components/countdown-timer'
import { ProductGridSkeleton } from '@/components/skeleton-loader'
import { createClient } from '@/lib/supabase/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Product {
  id: string
  name: string
  price: number
  discount: number | null
  images: string[] | null
  rating: number | null
  seller_id: string | null
  stock: number
  category: string
}

export default function EnhancedDealsPage() {
  const [flashDeals, setFlashDeals] = useState<Product[]>([])
  const [todayDeals, setTodayDeals] = useState<Product[]>([])
  const [clearanceDeals, setClearanceDeals] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    setLoading(true)

    try {
      // Flash deals - highest discounts
      const { data: flash } = await supabase
        .from('products')
        .select('*')
        .gte('discount', 30)
        .order('discount', { ascending: false })
        .limit(8)

      // Today's deals - good discounts
      const { data: today } = await supabase
        .from('products')
        .select('*')
        .gte('discount', 15)
        .lt('discount', 30)
        .order('discount', { ascending: false })
        .limit(8)

      // Clearance - any discount
      const { data: clearance } = await supabase
        .from('products')
        .select('*')
        .gt('discount', 0)
        .lte('stock', 20)
        .order('stock', { ascending: true })
        .limit(8)

      if (flash) setFlashDeals(flash as Product[])
      if (today) setTodayDeals(today as Product[])
      if (clearance) setClearanceDeals(clearance as Product[])
    } catch (error) {
      console.error('Error loading deals:', error)
    } finally {
      setLoading(false)
    }
  }

  // Flash sale ends at midnight
  const flashSaleEnd = new Date()
  flashSaleEnd.setHours(23, 59, 59, 999)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      {/* Hero Section */}
      <div className="mb-12">
        <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <Zap className="h-8 w-8" />
                  <h1 className="text-4xl font-bold">Flash Sale</h1>
                </div>
                <p className="text-xl opacity-90 mb-4">
                  Up to 70% Off - Limited Time Only!
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">Sale ends in:</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <CountdownTimer endDate={flashSaleEnd} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deal Categories */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <Zap className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-bold text-lg mb-1">Flash Deals</h3>
            <p className="text-sm text-muted-foreground">Up to 70% off</p>
            <Badge variant="destructive" className="mt-2">
              {flashDeals.length} Deals
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-orange-500/20 bg-orange-500/5">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 text-orange-500" />
            <h3 className="font-bold text-lg mb-1">Today's Deals</h3>
            <p className="text-sm text-muted-foreground">Best offers today</p>
            <Badge variant="secondary" className="mt-2">
              {todayDeals.length} Deals
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-green-500/20 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <Tag className="h-10 w-10 mx-auto mb-3 text-green-500" />
            <h3 className="font-bold text-lg mb-1">Clearance Sale</h3>
            <p className="text-sm text-muted-foreground">Limited stock</p>
            <Badge variant="secondary" className="mt-2">
              {clearanceDeals.length} Deals
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Deals Tabs */}
      <Tabs defaultValue="flash" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="flash" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Flash Deals
          </TabsTrigger>
          <TabsTrigger value="today" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Today's Deals
          </TabsTrigger>
          <TabsTrigger value="clearance" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Clearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flash">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="today">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {todayDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="clearance">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {clearanceDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Deal Alert */}
      <Card className="mt-12 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Don't Miss Out!</h3>
          <p className="text-muted-foreground mb-4">
            Subscribe to get notifications about exclusive deals and flash sales
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Notify Me
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
