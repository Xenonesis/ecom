'use client'

import { RotateCcw, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Returns & Refunds</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          We want you to be completely satisfied with your purchase. If you're not happy, 
          we're here to help with our hassle-free return policy.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">7 Days</h3>
            <p className="text-sm text-muted-foreground">Return window from delivery</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Free Pickup</h3>
            <p className="text-sm text-muted-foreground">We'll collect from your address</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Easy Process</h3>
            <p className="text-sm text-muted-foreground">Initiate returns from your account</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
              <RotateCcw className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Quick Refund</h3>
            <p className="text-sm text-muted-foreground">Refund within 5-7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Return Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Items Eligible for Return
              </h4>
              <ul className="space-y-2 text-muted-foreground ml-7">
                <li>• Products must be unused and in original condition</li>
                <li>• Original packaging and tags must be intact</li>
                <li>• Return request within 7 days of delivery</li>
                <li>• Product not listed in non-returnable category</li>
              </ul>
            </div>

            <div className="pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Non-Returnable Items
              </h4>
              <ul className="space-y-2 text-muted-foreground ml-7">
                <li>• Perishable goods (food, flowers, etc.)</li>
                <li>• Intimate or sanitary goods</li>
                <li>• Customized or personalized items</li>
                <li>• Downloadable software or digital products</li>
                <li>• Items marked as "non-returnable" on product page</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Return an Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Log into Your Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Go to "My Orders" and select the order you want to return
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Select Item & Reason</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose the item you wish to return and provide a reason
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Schedule Pickup</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose a convenient date and time for pickup
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Pack the Item</h4>
                  <p className="text-sm text-muted-foreground">
                    Pack the item securely in its original packaging
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Handover to Courier</h4>
                  <p className="text-sm text-muted-foreground">
                    Our courier partner will collect the item from your address
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  6
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Receive Refund</h4>
                  <p className="text-sm text-muted-foreground">
                    Once we receive and verify the item, your refund will be processed
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Once your return is received and inspected, we will send you an email notification. 
              If approved, your refund will be processed.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Original Payment Method</h4>
                <p className="text-sm text-muted-foreground">
                  Refund credited within 5-7 business days
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Store Credit</h4>
                <p className="text-sm text-muted-foreground">
                  Instant credit to your account wallet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about returns or refunds, our customer support team is here to help.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                Contact Support
              </button>
              <button className="px-6 py-2 border border-input rounded-md hover:bg-accent transition-colors">
                Live Chat
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
