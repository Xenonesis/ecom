'use client'

import { Shield, Eye, Lock, UserCheck, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Breadcrumbs className="mb-6" />

      <div className="mb-12 text-center">
        <Shield className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">
          Last updated: January 2025
        </p>
      </div>

      <div className="prose prose-slate max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name, email address, and contact information</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely through our payment partners)</li>
              <li>Order history and preferences</li>
              <li>Communication preferences and feedback</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your questions and provide customer support</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Detect and prevent fraud</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We take the security of your data seriously and implement appropriate technical 
              and organizational measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>
            <p>
              All payment transactions are processed through secure payment gateways using 
              industry-standard encryption (SSL/TLS). We never store complete credit card information.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at privacy@shophub.com
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience, 
              analyze site traffic, and understand where our visitors are coming from.
            </p>
            <p>
              You can control cookies through your browser settings. However, disabling cookies 
              may limit your ability to use certain features of our website.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may share your information with third-party service providers who assist us in 
              operating our website, conducting our business, or servicing you. These parties are 
              obligated to keep your information confidential.
            </p>
            <p>Third-party services we use include:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Payment processors (Stripe)</li>
              <li>Shipping and logistics partners</li>
              <li>Email service providers</li>
              <li>Analytics services</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Our services are not intended for children under 13 years of age. We do not 
              knowingly collect personal information from children under 13.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We may update this privacy policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this privacy policy, please contact us at:
            </p>
            <div className="space-y-1 text-sm">
              <p>Email: privacy@shophub.com</p>
              <p>Phone: +1 (800) 123-4567</p>
              <p>Address: 123 E-commerce Street, Tech City, TC 12345</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
