'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, TrendingUp, Package, Eye, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']

export default function ProductAnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })

      setProducts(data || [])
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate analytics
  const totalProducts = products.length
  const publicProducts = products.filter(p => p.visibility === 'public').length
  const draftProducts = products.filter(p => p.visibility === 'draft').length
  const privateProducts = products.filter(p => p.visibility === 'private').length
  
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  const avgPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0
  const avgRating = totalProducts > 0 ? products.reduce((sum, p) => sum + (p.rating || 0), 0) / totalProducts : 0
  const avgStock = totalProducts > 0 ? products.reduce((sum, p) => sum + p.stock, 0) / totalProducts : 0

  const outOfStock = products.filter(p => p.stock === 0).length
  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length
  const inStock = products.filter(p => p.stock >= 10).length

  // Category breakdown
  const categoryBreakdown = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Top products by rating
  const topRatedProducts = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 5)

  // Products with discount
  const discountedProducts = products.filter(p => (p.discount || 0) > 0)
  const avgDiscount = discountedProducts.length > 0
    ? discountedProducts.reduce((sum, p) => sum + (p.discount || 0), 0) / discountedProducts.length
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/seller/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Product Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Insights and metrics about your product catalog
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading analytics...</div>
      ) : (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {publicProducts} public, {draftProducts} draft
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{totalInventoryValue.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: ₹{avgPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgRating.toFixed(2)} ⭐</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all products
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Stock</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgStock.toFixed(0)} units</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Per product
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stock Status */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">In Stock (≥10 units)</span>
                  </div>
                  <span className="font-semibold">{inStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Low Stock (&lt;10 units)</span>
                  </div>
                  <span className="font-semibold">{lowStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">Out of Stock</span>
                  </div>
                  <span className="font-semibold">{outOfStock}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Products by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(categoryBreakdown)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(count / totalProducts) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Discount Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Discount Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Products with Discount</span>
                  <span className="font-semibold">
                    {discountedProducts.length} ({((discountedProducts.length / totalProducts) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Average Discount</span>
                  <span className="font-semibold">{avgDiscount.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Products without Discount</span>
                  <span className="font-semibold">{totalProducts - discountedProducts.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Rated Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Rated Products</CardTitle>
            </CardHeader>
            <CardContent>
              {topRatedProducts.length > 0 ? (
                <div className="space-y-3">
                  {topRatedProducts.map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground w-6">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{(product.rating || 0).toFixed(2)} ⭐</div>
                        <div className="text-xs text-muted-foreground">₹{product.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No rated products yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Visibility Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Product Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Public (visible to all)</span>
                  </div>
                  <span className="font-semibold">{publicProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm">Private (only you)</span>
                  </div>
                  <span className="font-semibold">{privateProducts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Draft (work in progress)</span>
                  </div>
                  <span className="font-semibold">{draftProducts}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
