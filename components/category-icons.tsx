'use client'

import Link from 'next/link'
import { Smartphone, Shirt, Home, Dumbbell, BookOpen, Watch, Laptop, HeadphonesIcon } from 'lucide-react'

const categories = [
  { name: 'Electronics', icon: Smartphone, href: '/products?category=Electronics' },
  { name: 'Fashion', icon: Shirt, href: '/products?category=Fashion' },
  { name: 'Home', icon: Home, href: '/products?category=Home' },
  { name: 'Sports', icon: Dumbbell, href: '/products?category=Sports' },
  { name: 'Books', icon: BookOpen, href: '/products?category=Books' },
  { name: 'Watches', icon: Watch, href: '/products?category=Watches' },
  { name: 'Laptops', icon: Laptop, href: '/products?category=Laptops' },
  { name: 'Audio', icon: HeadphonesIcon, href: '/products?category=Audio' },
]

export function CategoryIcons() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors group"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <category.icon className="w-8 h-8 text-primary" />
          </div>
          <span className="text-sm font-medium text-center">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
