'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const setUser = useAuthStore((state) => state.setUser)
  const setUserRole = useAuthStore((state) => state.setUserRole)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          return
        }

        if (!data.session?.user) {
          setStatus('error')
          setMessage('No user session found.')
          return
        }

        const user = data.session.user

        // Set user in auth store
        setUser(user)

        // Check if user profile exists, create if not
        const { data: existingUser, error: fetchError } = await (supabase as any)
          .from('users')
          .select('role, name')
          .eq('id', user.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error fetching user profile:', fetchError)
          setStatus('error')
          setMessage('Failed to load user profile.')
          return
        }

        let userRole: 'customer' | 'seller' | 'admin' = 'customer'

        if (!existingUser) {
          // Create new user profile
          const userName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'

          const { error: insertError } = await (supabase as any)
            .from('users')
            .insert({
              id: user.id,
              name: userName,
              email: user.email!,
              role: 'customer',
              verified: true,
            } as any)

          if (insertError) {
            console.error('Error creating user profile:', insertError)
            setStatus('error')
            setMessage('Failed to create user profile.')
            return
          }

          userRole = 'customer'
        } else {
          userRole = (existingUser as any).role
        }

        // Set user role
        setUserRole(userRole)

        setStatus('success')
        setMessage('Successfully signed in! Redirecting...')

        // Redirect after a short delay
        setTimeout(() => {
          router.push('/')
          router.refresh()
        }, 1500)

      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        setStatus('error')
        setMessage('An unexpected error occurred.')
      }
    }

    handleAuthCallback()
  }, [router, setUser, setUserRole, supabase])

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-linear-to-br from-primary/5 via-purple-500/5 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
            Authentication
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processing your sign in...'}
            {status === 'success' && 'Welcome back!'}
            {status === 'error' && 'Something went wrong'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          {status === 'error' && (
            <button
              onClick={() => router.push('/login')}
              className="mt-4 text-primary hover:underline"
            >
              Return to login
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}