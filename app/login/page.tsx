'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle2, Package } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export default function LoginPage() {
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('rememberedEmail') || ''
    }
    return ''
  })
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('rememberedEmail')
    }
    return false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const setUser = useAuthStore((state) => state.setUser)
  const setUserRole = useAuthStore((state) => state.setUserRole)

  // Real-time email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError(null)
    }
  }

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    const feedback = []

    if (password.length >= 8) strength++
    else feedback.push('At least 8 characters')

    if (/[a-z]/.test(password)) strength++
    else feedback.push('Lowercase letter')

    if (/[A-Z]/.test(password)) strength++
    else feedback.push('Uppercase letter')

    if (/\d/.test(password)) strength++
    else feedback.push('Number')

    if (/[^a-zA-Z\d]/.test(password)) strength++
    else feedback.push('Special character')

    return { strength, feedback }
  }

  // Real-time password validation
  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required')
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
    } else {
      setPasswordError(null)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    validateEmail(value)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      // OAuth will redirect, so we don't need to handle the response here
    } catch (error) {
      console.error('Social login error:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate all fields before submission
    validateEmail(email)
    validatePassword(password)

    if (emailError || passwordError) {
      setLoading(false)
      return
    }

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Login failed. Please try again.')
        setLoading(false)
        return
      }

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // Set user in auth store
      setUser(data.user)

      // Fetch and set user role
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (roleError) {
        console.error('Error fetching user role:', roleError)
        setError('Account setup incomplete. Please contact support.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Type assertion for Supabase response
      const typedUserData = userData as { role: 'customer' | 'seller' | 'admin' } | null

      if (!typedUserData?.role) {
        setError('User profile not found. Please contact support.')
        await supabase.auth.signOut()
        setLoading(false)
        return
      }

      // Set user role
      setUserRole(typedUserData.role)

      // Navigate to home page
      router.push('/')
      router.refresh()

      // Reset loading state after a short delay to allow navigation
      setTimeout(() => setLoading(false), 500)
    } catch (error) {
      console.error('Unexpected error during login:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-primary/3 to-background relative overflow-hidden">
      {/* Enhanced background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-primary/15 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '3s', animationDuration: '3.5s' }}></div>
      </div>

      <div className="w-full max-w-6xl animate-fadeIn relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Login Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
            <ShoppingBag className="h-8 w-8 text-primary" />
            ShopHub
          </Link>
        </div>

        <Card className="border-2 shadow-2xl bg-card/95 backdrop-blur-sm hover:shadow-3xl transition-all duration-300">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue shopping</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                  Email Address
                  {email && !emailError && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`pl-10 transition-colors ${emailError ? 'border-destructive focus:border-destructive' : email && !emailError ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive animate-fadeIn">{emailError}</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    Password
                    {password && !passwordError && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                    className={`pl-10 pr-10 transition-colors ${passwordError ? 'border-destructive focus:border-destructive' : password && !passwordError ? 'border-green-500 focus:border-green-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-destructive animate-fadeIn">{passwordError}</p>
                )}
                {password && !passwordError && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            checkPasswordStrength(password).strength <= 1 ? 'bg-red-500' :
                            checkPasswordStrength(password).strength <= 2 ? 'bg-orange-500' :
                            checkPasswordStrength(password).strength <= 3 ? 'bg-yellow-500' :
                            checkPasswordStrength(password).strength <= 4 ? 'bg-primary' : 'bg-success'
                          }`}
                          style={{ width: `${(checkPasswordStrength(password).strength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        checkPasswordStrength(password).strength <= 1 ? 'text-red-500' :
                        checkPasswordStrength(password).strength <= 2 ? 'text-orange-500' :
                        checkPasswordStrength(password).strength <= 3 ? 'text-yellow-500' :
                        checkPasswordStrength(password).strength <= 4 ? 'text-primary' : 'text-success'
                      }`}>
                        {checkPasswordStrength(password).strength <= 1 ? 'Weak' :
                         checkPasswordStrength(password).strength <= 2 ? 'Fair' :
                         checkPasswordStrength(password).strength <= 3 ? 'Good' :
                         checkPasswordStrength(password).strength <= 4 ? 'Strong' : 'Very Strong'}
                      </span>
                    </div>
                    {checkPasswordStrength(password).strength < 5 && (
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">Suggestions: </span>
                        {checkPasswordStrength(password).feedback.slice(0, 2).join(', ')}
                        {checkPasswordStrength(password).feedback.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                size="lg"
                disabled={loading || !!emailError || !!passwordError}
              >
                <span className={`transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  Sign In
                </span>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="text-sm">Signing in...</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                  Sign up
                </Link>
              </p>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading}
                  className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 group"
                >
                  <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin('github')}
                  disabled={loading}
                  className="w-full hover:bg-gray-900 hover:border-gray-900 hover:text-white transition-all duration-200 group"
                >
                  <svg className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  GitHub
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
          </div>

          {/* Feature Showcase - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Welcome Back to ShopHub
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Discover amazing products, connect with sellers, and enjoy seamless shopping experiences.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300 animate-float">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Wide Selection</h3>
                  <p className="text-muted-foreground">Browse thousands of products from trusted sellers worldwide.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300 animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Fast Delivery</h3>
                  <p className="text-muted-foreground">Get your orders delivered quickly and securely to your doorstep.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/70 transition-all duration-300 animate-float" style={{ animationDelay: '2s' }}>
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure Shopping</h3>
                  <p className="text-muted-foreground">Shop with confidence with our advanced security and buyer protection.</p>
                </div>
              </div>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                New to ShopHub?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                  Create your account
                </Link>{' '}
                and start shopping today!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
