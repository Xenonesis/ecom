import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShopHub - Modern E-Commerce Platform",
  description: "Shop the best products from verified sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        
        {/* Enhanced Footer */}
        <footer className="border-t bg-muted/30">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              {/* Brand */}
              <div className="lg:col-span-2">
                <Link href="/" className="text-2xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  ShopHub
                </Link>
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  Your trusted marketplace for quality products from verified sellers. Shop with confidence and enjoy exceptional service.
                </p>
                <div className="mt-6">
                  <p className="text-sm font-semibold mb-3">Subscribe to our newsletter</p>
                  <div className="flex gap-2 max-w-sm">
                    <Input type="email" placeholder="Enter your email" className="bg-background" />
                    <Button>
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold mb-4">Shop</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">
                      Deals
                    </Link>
                  </li>
                  <li>
                    <Link href="/seller" className="text-muted-foreground hover:text-primary transition-colors">
                      Become a Seller
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Customer Service */}
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                      Shipping Info
                    </Link>
                  </li>
                  <li>
                    <Link href="/returns" className="text-muted-foreground hover:text-primary transition-colors">
                      Returns
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; 2025 ShopHub. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Facebook className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Instagram className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Youtube className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
