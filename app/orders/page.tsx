import { redirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, formatDate } from '@/lib/utils'
import { Database } from '@/lib/supabase/database.types'

export default async function OrdersPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const orders: Database['public']['Tables']['orders']['Row'][] = data || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between">
                  <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                  <div className="flex gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                      order.payment_status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {order.payment_status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ordered on {order.created_at ? formatDate(order.created_at) : 'Unknown date'}
                  </p>
                  <p className="text-lg font-semibold">
                    Total: {formatPrice(Number(order.total_amount))}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      )}
    </div>
  )
}
