'use client'

import { Award, Users, Target, TrendingUp, Heart, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumbs } from '@/components/breadcrumbs'
import Image from 'next/image'

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '1M+', icon: Users },
    { label: 'Products Listed', value: '100K+', icon: Award },
    { label: 'Sellers', value: '5K+', icon: Target },
    { label: 'Daily Orders', value: '10K+', icon: TrendingUp },
  ]

  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize customer satisfaction above everything else. Your happiness is our success.',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Shop with confidence. We ensure secure transactions and protect your data.',
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'Only verified sellers and authentic products. Quality is our commitment.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'We continuously improve our platform to provide the best shopping experience.',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs className="mb-6" />

      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold mb-4 sm:text-5xl">About ShopHub</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted marketplace connecting millions of buyers with thousands of sellers, 
          offering quality products at the best prices.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-16">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="text-center">
              <CardContent className="pt-6">
                <Icon className="h-10 w-10 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Story Section */}
      <div className="grid gap-12 lg:grid-cols-2 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded in 2020, ShopHub started with a simple mission: to create a marketplace 
              where everyone can buy and sell with confidence. What began as a small platform 
              has grown into one of the most trusted e-commerce destinations.
            </p>
            <p>
              Today, we serve millions of customers across the country, offering everything from 
              electronics to fashion, home goods to sports equipment. Our platform empowers 
              thousands of sellers to reach a wider audience and grow their businesses.
            </p>
            <p>
              We&apos;re more than just a marketplace – we&apos;re a community. A community built on trust, 
              quality, and exceptional service. Every day, we work to make shopping online easier, 
              safer, and more enjoyable for everyone.
            </p>
          </div>
        </div>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <Image
            src="/placeholder.svg"
            alt="ShopHub Team"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <Card key={value.title} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Mission Section */}
      <Card className="mb-16 bg-primary/5 border-primary/20">
        <CardContent className="p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            To empower people everywhere to buy and sell anything, creating economic opportunities 
            and building trusted connections in communities around the world.
          </p>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Whether you&apos;re looking to shop for the best deals or start selling your products, 
          ShopHub is the perfect platform for you.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="/products">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
              Start Shopping
            </button>
          </a>
          <a href="/seller">
            <button className="px-8 py-3 border border-input rounded-md hover:bg-accent transition-colors font-medium">
              Become a Seller
            </button>
          </a>
        </div>
      </div>
    </div>
  )
}
