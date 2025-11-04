'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, Shield, Calendar, Save, Loader2, AlertCircle, CheckCircle2, Package, Heart, ShoppingBag, Eye, Trash2, Star, Palette, Store } from 'lucide-react'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'customer' | 'seller' | 'admin'
  verified: boolean
  avatar_url?: string
  phone?: string
  theme_preference?: string
  created_at: string
}

interface Order {
  id: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  items: any[]
}

interface WishlistItem {
  id: string
  product_id: string
  products: {
    id: string
    name: string
    price: number
    discount: number
    image_url: string
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [switchingRole, setSwitchingRole] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    avatar_url: '',
    theme_preference: 'system',
  })
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const { setTheme } = useTheme()

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile')
        if (!response.ok) {
          if (response.status === 401) {
            router.push('/login')
            return
          }
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
          theme_preference: data.theme_preference || 'system',
        })
        
        // Apply the saved theme preference
        if (data.theme_preference) {
          setTheme(data.theme_preference)
        }

        // Fetch orders
        const ordersResponse = await fetch('/api/orders')
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setOrders(Array.isArray(ordersData) ? ordersData : ordersData.orders || [])
        }

        // Fetch wishlist
        const wishlistResponse = await fetch('/api/wishlist')
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json()
          setWishlist(Array.isArray(wishlistData) ? wishlistData : wishlistData.items || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setSuccess('Profile updated successfully!')
      
      // Apply the theme change immediately
      if (formData.theme_preference) {
        setTheme(formData.theme_preference)
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId }),
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product_id !== productId))
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSwitchToSeller = async () => {
    if (!confirm('Switch to Seller Account? You will be able to list and sell products on our platform.')) {
      return
    }

    setSwitchingRole(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/profile/switch-to-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to switch to seller account')
      }

      const data = await response.json()
      setProfile({ ...profile!, role: 'seller' })
      setSuccess('Successfully switched to seller account! Redirecting to seller dashboard...')
      
      setTimeout(() => {
        router.push('/seller/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch to seller account')
    } finally {
      setSwitchingRole(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>Failed to load profile</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getBadgeVariant = () => {
    if (profile.role === 'admin') return 'default'
    if (profile.role === 'seller') return 'secondary'
    return 'outline'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings, orders, and wishlist</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="wishlist">Wishlist ({wishlist.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Summary Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{profile.name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <Badge variant={getBadgeVariant()}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className={`h-4 w-4 ${profile.verified ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-muted-foreground">Status:</span>
                    <span className={profile.verified ? 'text-green-500 font-medium' : 'text-muted-foreground'}>
                      {profile.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Member since:</span>
                    <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Profile Form */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-3 flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-green-500">{success}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        className="pl-10 bg-muted"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="avatar_url" className="text-sm font-medium">
                      Avatar URL
                    </label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      type="url"
                      value={formData.avatar_url}
                      onChange={handleChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-xs text-muted-foreground">Enter a URL to your profile picture</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme_preference" className="text-sm font-medium flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme Preference
                    </Label>
                    <Select
                      value={formData.theme_preference}
                      onValueChange={(value) => setFormData({ ...formData, theme_preference: value })}
                    >
                      <SelectTrigger id="theme_preference">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">Choose your preferred color theme</p>
                  </div>

                  {/* Seller Account Toggle */}
                  {profile.role === 'customer' && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-start gap-3">
                        <Store className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary">Become a Seller</h3>
                          <p className="text-sm text-primary/80 mt-1">
                            Start selling your products on our platform. You&apos;ll get access to the seller dashboard, 
                            inventory management, and analytics tools.
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        onClick={handleSwitchToSeller}
                        disabled={switchingRole}
                        className="w-full"
                      >
                        {switchingRole ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Switching...
                          </>
                        ) : (
                          <>
                            <Store className="mr-2 h-4 w-4" />
                            Switch to Seller Account
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {profile.role === 'seller' && (
                    <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-green-900 dark:text-green-100">Seller Account Active</h3>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            You have access to the seller dashboard and can manage your products and orders.
                          </p>
                          <Link href="/seller/dashboard" className="inline-block mt-2">
                            <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-100 dark:hover:bg-green-900">
                              <Package className="mr-2 h-3 w-3" />
                              Go to Seller Dashboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" disabled={saving} className="flex-1">
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData({
                          name: profile.name || '',
                          phone: profile.phone || '',
                          avatar_url: profile.avatar_url || '',
                          theme_preference: profile.theme_preference || 'system',
                        })
                        setError(null)
                        setSuccess(null)
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and track your past orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                  <Link href="/products" className="inline-block mt-4">
                    <Button variant="outline">Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wishlist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Wishlist</CardTitle>
              <CardDescription>Products you&apos;ve saved for later</CardDescription>
            </CardHeader>
            <CardContent>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                  <Link href="/products" className="inline-block mt-4">
                    <Button variant="outline">Browse Products</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlist.map((item) => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <Image
                          src={item.products.image_url}
                          alt={item.products.name}
                          width={300}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8"
                          onClick={() => removeFromWishlist(item.product_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{item.products.name}</h3>
                        <p className="text-lg font-bold text-primary mt-1">
                          {formatPrice(item.products.price * (1 - item.products.discount / 100))}
                        </p>
                        {item.products.discount > 0 && (
                          <p className="text-sm text-muted-foreground line-through">
                            {formatPrice(item.products.price)}
                          </p>
                        )}
                        <Link href={`/product/${item.product_id}`} className="mt-3 block">
                          <Button className="w-full">View Product</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
