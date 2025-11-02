'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingBag, Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

function ResetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    // Check if we have the required tokens in the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      // Use setTimeout to avoid setState during render
      setTimeout(() => {
        setError('Invalid reset link. Please request a new password reset.')
      }, 0)
      return
    }

    // Set the session with the tokens from the URL
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    }).catch((error) => {
      console.error('Error setting session:', error)
      setTimeout(() => {
        setError('Invalid reset link. Please request a new password reset.')
      }, 0)
    })
  }, [searchParams, supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })

      if (updateError) {
        setError(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)

      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error) {
      console.error('Unexpected error during password reset:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-linear-to-br from-primary/5 via-purple-500/5 to-background">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Logo/Brand */}
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              <ShoppingBag className="h-8 w-8 text-primary" />
              ShopHub
            </Link>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-bold">Password Updated</CardTitle>
              <CardDescription>
                Your password has been successfully reset
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                You will be redirected to the sign in page shortly...
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-linear-to-br from-primary/5 via-purple-500/5 to-background">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            <ShoppingBag className="h-8 w-8 text-primary" />
            ShopHub
          </Link>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Reset Your Password</CardTitle>
            <CardDescription>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleResetPassword}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 flex items-start gap-2 animate-fadeIn">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>

              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-2 shadow-xl">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
