'use client'

import { useState } from 'react'
import { Search, ChevronDown, MessageCircle, Phone, Mail, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How can I track my order?',
        a: 'You can track your order by visiting the Orders page in your account. You will receive tracking information via email once your order is shipped.',
      },
      {
        q: 'What are the shipping charges?',
        a: 'We offer free shipping on all orders above ₹500. For orders below ₹500, a nominal shipping charge of ₹50 applies.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3-5 business days. Express delivery options are available at checkout for faster shipping.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 7-day return policy for most products. Items must be unused and in original packaging. Some products may have different return policies.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Go to your Orders page, select the order you want to return, and click on the "Return" button. Follow the instructions to complete the return process.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive the returned item. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Credit/Debit Cards, UPI, Net Banking, and Pay Later options. EMI is available on purchases above ₹3,000.',
      },
      {
        q: 'Is it safe to use my credit card?',
        a: 'Yes, all transactions are secured with 256-bit SSL encryption. We never store your complete card details.',
      },
      {
        q: 'Can I use multiple payment methods?',
        a: 'Currently, we support one payment method per order. However, you can split payments using EMI options.',
      },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page. Enter your email address and follow the instructions sent to your email.',
      },
      {
        q: 'Can I change my email address?',
        a: 'Currently, email addresses cannot be changed. Please contact our support team if you need assistance.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Contact our support team to request account deletion. Please note that this action is irreversible.',
      },
    ],
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />
      
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
        <p className="text-muted-foreground mb-8">
          Find answers to commonly asked questions or contact our support team
        </p>
        
        <div className="max-w-2xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg"
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 mb-12">
        <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Chat with our support team</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Phone className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Call Us</CardTitle>
            <CardDescription>+1 (800) 123-4567</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Call Now</Button>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>support@shophub.com</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Send Email</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Support hours: Monday - Friday, 9:00 AM - 6:00 PM IST</span>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        
        {filteredFaqs.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
            <div className="space-y-3">
              {category.questions.map((item, index) => {
                const id = `${categoryIndex}-${index}`
                const isExpanded = expandedItems.has(id)
                
                return (
                  <Card key={id} className="overflow-hidden">
                    <button
                      onClick={() => toggleItem(id)}
                      className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium pr-4">{item.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 text-muted-foreground animate-in slide-in-from-top-2">
                        {item.a}
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
        
        {filteredFaqs.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear search
            </Button>
          </Card>
        )}
      </div>

      <Card className="mt-12 bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-4">
            Our support team is here to assist you with any questions
          </p>
          <Button size="lg">Contact Support</Button>
        </CardContent>
      </Card>
    </div>
  )
}
