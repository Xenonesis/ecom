import Link from 'next/link'
import { ArrowRight, ShoppingBag, Shield, Truck, Zap, Award, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { createServerClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/database.types'

export default async function Home() {
  const supabase = await createServerClient()
  
  // Fetch featured products
  const { data } = await supabase
    .from('products')
    .select('*')
    .limit(8)
    .order('created_at', { ascending: false })

  const products: Database['public']['Tables']['products']['Row'][] = data || []

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-purple-500/5 to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center animate-fadeIn">
            <div className="mb-6 inline-block">
              <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                🎉 Welcome to ShopHub
              </span>
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Discover Amazing Products
              <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent"> from Verified Sellers</span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
              Shop with confidence from our curated marketplace. Get the best deals, fast shipping, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Browse Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/seller">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8">
                  Become a Seller
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="mt-1 text-sm text-muted-foreground">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5K+</div>
                <div className="mt-1 text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="mt-1 text-sm text-muted-foreground">Verified Sellers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="mt-1 text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-xl bg-background p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Free delivery on all orders over ₹500</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-background p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">100% secure and encrypted transactions</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-background p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Quality Assured</h3>
              <p className="text-sm text-muted-foreground">Only verified sellers and authentic products</p>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl bg-background p-6 shadow-sm transition-all hover:shadow-lg">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                <HeadphonesIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">Dedicated customer support team</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">Discover our hand-picked selection</p>
            </div>
            <Link href="/products" className="hidden sm:block">
              <Button variant="ghost" className="group">
                View All
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          {products && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed py-20 text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No products available yet.</p>
              <Link href="/seller" className="mt-4 inline-block">
                <Button variant="outline">Become a Seller</Button>
              </Link>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-linear-to-br from-primary to-purple-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <Zap className="mx-auto h-12 w-12 mb-6" />
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Start Selling Today</h2>
          <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of successful sellers on ShopHub. Set up your store in minutes and reach millions of customers.
          </p>
          <Link href="/seller">
            <Button size="lg" variant="secondary" className="text-base px-8">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
