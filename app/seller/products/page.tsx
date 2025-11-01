import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Edit, Trash } from 'lucide-react'
import { Database } from '@/lib/supabase/database.types'

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
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span>Price: ₹{product.price}</span>
                      <span>Stock: {product.stock}</span>
                      <span>Rating: {(product.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/seller/products/${product.id}/edit`}>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
