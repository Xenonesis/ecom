'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, User, Menu, X, LogOut, Package, Heart, Settings, Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { AdvancedSearch } from '@/components/advanced-search'
import { Notifications } from '@/components/notifications'
import { MegaMenu } from '@/components/mega-menu'
import { Logo } from '@/components/logo'
import { useCartStore } from '@/lib/store/cart'
import { useAuthStore } from '@/lib/store/auth'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

interface UserData {
  role: 'customer' | 'seller' | 'admin' | null
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const user = useAuthStore((state) => state.user)
  const userRole = useAuthStore((state) => state.userRole)
  const setUser = useAuthStore((state) => state.setUser)
  const setUserRole = useAuthStore((state) => state.setUserRole)
  const router = useRouter()
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="h-5 w-5" />
    if (theme === 'light') return <Sun className="h-5 w-5" />
    return <Monitor className="h-5 w-5" />
  }

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        
        // Fetch user role from database
        try {
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (roleError) {
            console.error('Error fetching user role:', roleError)
          } else if (userData && (userData as UserData).role) {
            setUserRole((userData as UserData).role)
          }
        } catch (error) {
          console.error('Error during auth initialization:', error)
        }
      }
    }
    
    initAuth()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)

        try {
          const { data: userData, error: roleError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (roleError) {
            console.error('Error fetching user role on sign in:', roleError)
          } else if (userData && (userData as UserData).role) {
            setUserRole((userData as UserData).role)
          }
        } catch (error) {
          console.error('Error during auth state change:', error)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setUserRole(null)
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, setUser, setUserRole])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserRole(null)
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-all duration-300 ${scrolled ? 'shadow-lg border-primary/10' : ''}`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="hover:opacity-90 transition-opacity">
                <Logo variant="full" size={32} />
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                <MegaMenu />
                <Link href="/products" className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50 group">
                  Products
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </Link>
                <Link href="/deals" className="relative text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-3 rounded-md hover:bg-accent/50 group">
                  Deals
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full group-hover:left-0"></span>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <AdvancedSearch />
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (theme === 'light') setTheme('dark')
                  else if (theme === 'dark') setTheme('system')
                  else setTheme('light')
                }}
                className="hover:bg-accent hover:scale-110 transition-all duration-200"
                title={`Current theme: ${theme || 'system'}`}
              >
                {getThemeIcon()}
              </Button>

              <Link href="/cart" className="hidden sm:block">
                <Button variant="ghost" size="icon" className="relative hover:bg-accent hover:scale-110 transition-all duration-200 group">
                  <ShoppingCart className="h-5 w-5 group-hover:text-primary transition-colors" />
                  {totalItems > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 min-w-5 p-0 flex items-center justify-center text-xs animate-pulse bg-primary hover:bg-primary/90">
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              {user && <Notifications />}

              {user ? (
                 <DropdownMenu
                   trigger={
                     <Button variant="ghost" size="icon" className="hover:bg-accent hover:scale-110 transition-all duration-200 group">
                       <User className="h-5 w-5 group-hover:text-primary transition-colors" />
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
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </DropdownMenuItem>
                  </Link>
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
                    <Button variant="ghost" className="hover:bg-accent hover:scale-105 transition-all duration-200">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg">Sign Up</Button>
                  </Link>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-accent hover:scale-110 transition-all duration-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <AdvancedSearch />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-lg lg:hidden animate-slideIn border-t border-border/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col space-y-2">
              <Link href="/products" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                Products
              </Link>
              <Link href="/categories" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                Categories
              </Link>
              <Link href="/deals" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200" onClick={() => setMobileMenuOpen(false)}>
                Deals
              </Link>
              <Link href="/cart" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <ShoppingCart className="h-5 w-5" />
                Cart {totalItems > 0 && <Badge className="bg-primary">{totalItems}</Badge>}
              </Link>
              <hr className="border-border" />
              {user ? (
                <>
                  <div className="border-t border-border/50 pt-4 mt-4">
                    <div className="text-sm font-semibold text-muted-foreground mb-3 px-4">Account</div>
                    <Link href="/profile" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                      <User className="h-5 w-5" />
                      My Profile
                    </Link>
                    <Link href="/orders" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                      <Package className="h-5 w-5" />
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                      <Heart className="h-5 w-5" />
                      Wishlist
                    </Link>
                    {userRole === 'seller' && (
                      <Link href="/seller" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                        <Package className="h-5 w-5" />
                        Seller Dashboard
                      </Link>
                    )}
                    {userRole === 'admin' && (
                      <Link href="/admin" className="text-lg font-medium hover:text-primary hover:bg-accent/50 py-3 px-4 rounded-lg transition-all duration-200 flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                        <Settings className="h-5 w-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <div className="pt-2">
                      <Button variant="outline" onClick={handleLogout} className="w-full justify-start hover:bg-destructive hover:text-destructive-foreground transition-all duration-200">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-border/50 pt-4 mt-4 space-y-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full hover:bg-accent transition-all duration-200">Sign In</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full hover:scale-105 transition-all duration-200">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
