'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Mail, Lock, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Database } from '@/lib/supabase/database.types'

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-linear-to-br from-primary/5 via-purple-500/5 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            <ShoppingBag className="h-8 w-8 text-primary" />
            ShopHub
          </Link>
        </div>

        <Card className="border-2 shadow-xl">
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
                            checkPasswordStrength(password).strength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(checkPasswordStrength(password).strength / 5) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-medium ${
                        checkPasswordStrength(password).strength <= 1 ? 'text-red-500' :
                        checkPasswordStrength(password).strength <= 2 ? 'text-orange-500' :
                        checkPasswordStrength(password).strength <= 3 ? 'text-yellow-500' :
                        checkPasswordStrength(password).strength <= 4 ? 'text-blue-500' : 'text-green-500'
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
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="text-primary font-semibold hover:underline transition-colors">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
