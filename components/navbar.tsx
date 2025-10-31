'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart, Settings, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const user = useAuthStore((state) => state.user)
  const userRole = useAuthStore((state) => state.userRole)
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${scrolled ? 'shadow-md' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                ShopHub
              </Link>
              <div className="hidden lg:flex items-center gap-6">
                <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
                  Products
                </Link>
                <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
                  Categories
                </Link>
                <Link href="/deals" className="text-sm font-medium hover:text-primary transition-colors">
                  Deals
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-accent"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Link href="/cart" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 min-w-5 p-0 flex items-center justify-center text-xs">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {user ? (
                <DropdownMenu
                  trigger={
                    <Button variant="ghost" size="icon" className="hover:bg-accent">
                      <User className="h-5 w-5" />
                    </Button>
                  }
                >
                  <div className="px-2 py-1.5 text-sm font-semibold">My Account</div>
                  <DropdownMenuSeparator />
                  {userRole === 'admin' && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  {userRole === 'seller' && (
                    <Link href="/seller">
                      <DropdownMenuItem>
                        <Package className="mr-2 h-4 w-4" />
                        Seller Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/orders">
                    <DropdownMenuItem>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/wishlist">
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex gap-2">
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </div>
              )}

              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background lg:hidden animate-slideIn">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-4">
              <Link href="/products" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link href="/categories" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/deals" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                Deals
              </Link>
              <Link href="/cart" className="text-lg font-medium hover:text-primary flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                Cart {totalItems > 0 && <Badge>{totalItems}</Badge>}
              </Link>
              <hr className="border-border" />
              {user ? (
                <>
                  <Link href="/orders" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    My Orders
                  </Link>
                  <Link href="/wishlist" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                    Wishlist
                  </Link>
                  {userRole === 'seller' && (
                    <Link href="/seller" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                      Seller Dashboard
                    </Link>
                  )}
                  {userRole === 'admin' && (
                    <Link href="/admin" className="text-lg font-medium hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="w-full justify-start">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
