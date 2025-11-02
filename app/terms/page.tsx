'use client'

import { FileText, AlertCircle, Scale, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs className="mb-6" />

      <div className="mb-12 text-center">
        <FileText className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: January 2025
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              By accessing and using ShopHub, you agree to be bound by these Terms of Service 
              and all applicable laws and regulations. If you do not agree with any of these terms, 
              you are prohibited from using this site.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Use of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You agree to use our service only for lawful purposes. You must not:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service in any way that violates any applicable law or regulation</li>
              <li>Engage in any fraudulent or deceptive activities</li>
              <li>Attempt to interfere with the proper functioning of the service</li>
              <li>Use automated systems to access the service without permission</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for maintaining the confidentiality of your account and password.
            </p>
            <p>
              You agree to accept responsibility for all activities that occur under your account. 
              You must notify us immediately of any unauthorized use of your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Orders and Payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              All orders are subject to acceptance and availability. We reserve the right to refuse 
              or cancel any order for any reason, including pricing errors, product availability, 
              or suspected fraud.
            </p>
            <p>
              Prices are subject to change without notice. Payment must be received in full before 
              orders are processed. We accept various payment methods as listed on our checkout page.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              The content on this website, including text, graphics, logos, images, and software, 
              is the property of ShopHub or its content suppliers and is protected by intellectual 
              property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works from any content 
              on this site without our express written permission.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Seller Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              If you are a seller on our platform, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide accurate product descriptions and images</li>
              <li>Honor all confirmed orders in a timely manner</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Maintain adequate inventory levels</li>
              <li>Provide quality customer service</li>
              <li>Pay applicable seller fees and commissions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              To the maximum extent permitted by law, ShopHub shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising out of or relating to 
              your use of the service.
            </p>
            <p>
              Our total liability for any claim arising out of or relating to these terms shall not 
              exceed the amount you paid us in the twelve months prior to the event giving rise to 
              the liability.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Returns and Refunds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our return and refund policy is detailed on our Returns page. By making a purchase, 
              you agree to our return policy terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may terminate or suspend your account and access to the service immediately, 
              without prior notice or liability, for any reason, including breach of these Terms.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which ShopHub operates, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting. Your continued use of the service after changes are posted 
              constitutes acceptance of the modified terms.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Questions?</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-1 text-sm">
              <p>Email: legal@shophub.com</p>
              <p>Phone: +1 (800) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
