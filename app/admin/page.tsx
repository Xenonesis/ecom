import { redirect } from 'next/navigation'
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('role, name')
    .eq('id', user.id)
    .single()

  if (!userProfile || (userProfile as { role: string; name: string }).role !== 'admin') {
    redirect('/')
  }

  // Fetch admin stats
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })

  const { data: orders } = await supabase
    .from('orders')
    .select('total_amount')

  const totalRevenue = (orders as { total_amount: number }[] | null)?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

  // Fetch pending sellers
  const { data: pendingSellers } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'seller')
    .eq('verified', false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {(userProfile as { role: string; name: string }).name}!</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Sellers */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Seller Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingSellers && pendingSellers.length > 0 ? (
            <div className="space-y-4">
              {(pendingSellers as { id: string; name: string; email: string }[]).map((seller) => (
                <div key={seller.id} className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-semibold">{seller.name}</p>
                    <p className="text-sm text-muted-foreground">{seller.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600">
                      Approve
                    </button>
                    <button className="rounded bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending approvals</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
