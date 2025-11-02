'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { useNotification } from '@/components/toast-notifications'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const notify = useNotification()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    notify.success('Your message has been sent successfully! We will get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />
      
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <MapPin className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Visit Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              123 E-commerce Street<br />
              Tech City, TC 12345<br />
              United States
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Phone className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Call Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              Sales: +1 (800) 123-4567<br />
              Support: +1 (800) 123-4568
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Mail className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Email Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              General: info@shophub.com<br />
              Support: support@shophub.com
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span className="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span className="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span className="font-medium">Closed</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle>Quick Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                For immediate assistance, try our live chat support available during business hours.
              </p>
              <Button className="w-full">Start Live Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Find answers to commonly asked questions in our help center.
              </p>
              <Button variant="outline" className="w-full" onClick={() => window.location.href = '/help'}>
                Visit Help Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
