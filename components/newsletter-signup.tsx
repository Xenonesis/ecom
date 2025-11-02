'use client'

import { useState } from 'react'
import { Mail, Send, Gift } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useNotification } from '@/components/toast-notifications'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const notify = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    notify.success('Successfully subscribed to newsletter!', 'Welcome Gift Applied')
    setEmail('')
    setLoading(false)
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2 justify-center md:justify-start">
              Subscribe to Our Newsletter
              <Gift className="h-5 w-5 text-primary" />
            </h3>
            <p className="text-muted-foreground">
              Get exclusive deals, new arrivals, and 10% off your first order!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="md:w-64"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                'Subscribing...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
