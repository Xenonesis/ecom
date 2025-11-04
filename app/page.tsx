import Link from 'next/link'
import { ArrowRight, ShoppingBag, Shield, Truck, Zap, Award, HeadphonesIcon, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { CategoryIcons } from '@/components/category-icons'
import { HeroCarousel } from '@/components/hero-carousel'
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

  // // Fetch active promotions for carousel
  // const { data: promotions } = await supabase
  //   .from('promotions')
  //   .select('*')
  //   .eq('is_active', true)
  //   .order('display_order', { ascending: true })
  //   .limit(5)

  return (
    <div className="flex flex-col">
      {/* Hero Carousel */}
      <section className="container mx-auto px-4 pt-8">
        <HeroCarousel />
      </section>

      {/* Category Icons */}
      <section className="container mx-auto px-4 py-8">
        <CategoryIcons />
      </section>

      {/* Special Offers Banner */}
      <section className="container mx-auto px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <Sparkles className="absolute -right-4 -top-4 h-24 w-24 opacity-20" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Flash Sale</h3>
              <p className="text-sm opacity-90 mb-4">Up to 50% off on selected items</p>
              <Link href="/deals">
                <Button variant="secondary" size="sm">Shop Now</Button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-accent to-accent/80 p-6 text-accent-foreground">
            <TrendingUp className="absolute -right-4 -top-4 h-24 w-24 opacity-20" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
              <p className="text-sm opacity-90 mb-4">Discover the latest products</p>
              <Link href="/products">
                <Button variant="secondary" size="sm">Explore</Button>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-success to-success/80 p-6 text-success-foreground sm:col-span-2 lg:col-span-1">
            <Award className="absolute -right-4 -top-4 h-24 w-24 opacity-20" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-2">Best Sellers</h3>
              <p className="text-sm opacity-90 mb-4">Most popular products this month</p>
              <Link href="/products?sort=popular">
                <Button variant="secondary" size="sm">View All</Button>
              </Link>
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
      <section className="border-t bg-gradient-to-br from-primary to-primary/60 py-16 text-primary-foreground">
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
