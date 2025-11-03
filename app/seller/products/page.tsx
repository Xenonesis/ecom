import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Database } from '@/lib/supabase/database.types'
import SellerProductsClient from './products-client'

export default async function SellerProductsPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  const products: Database['public']['Tables']['products']['Row'][] = data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link href="/seller/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <SellerProductsClient products={products} />
      ) : (
        <div className="py-20 text-center">
          <p className="mb-4 text-muted-foreground">No products yet</p>
          <Link href="/seller/products/new">
            <Button>Add Your First Product</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
