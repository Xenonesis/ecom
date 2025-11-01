'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, Smartphone, Shirt, Home, Dumbbell, BookOpen, Watch, Laptop, HeadphonesIcon } from 'lucide-react'

const categories = [
  {
    name: 'Electronics',
    icon: Smartphone,
    subcategories: ['Smartphones', 'Tablets', 'Cameras', 'Accessories'],
  },
  {
    name: 'Fashion',
    icon: Shirt,
    subcategories: ['Men', 'Women', 'Kids', 'Accessories'],
  },
  {
    name: 'Home & Living',
    icon: Home,
    subcategories: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
  },
  {
    name: 'Sports',
    icon: Dumbbell,
    subcategories: ['Fitness', 'Outdoor', 'Team Sports', 'Accessories'],
  },
  {
    name: 'Books',
    icon: BookOpen,
    subcategories: ['Fiction', 'Non-Fiction', 'Educational', 'Comics'],
  },
  {
    name: 'Watches',
    icon: Watch,
    subcategories: ['Smart Watches', 'Analog', 'Digital', 'Luxury'],
  },
  {
    name: 'Laptops',
    icon: Laptop,
    subcategories: ['Gaming', 'Business', 'Student', 'Ultrabooks'],
  },
  {
    name: 'Audio',
    icon: HeadphonesIcon,
    subcategories: ['Headphones', 'Earbuds', 'Speakers', 'Accessories'],
  },
]

export function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2"
      >
        Categories
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-0 w-screen max-w-4xl bg-background border rounded-lg shadow-2xl z-50 animate-fadeIn">
          <div className="grid grid-cols-4 gap-6 p-6">
            {categories.map((category) => (
              <div key={category.name} className="space-y-3">
                <Link
                  href={`/products?category=${category.name}`}
                  className="flex items-center gap-2 font-semibold text-sm hover:text-primary transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span>{category.name}</span>
                </Link>
                <ul className="space-y-2 pl-12">
                  {category.subcategories.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`/products?category=${category.name}&subcategory=${sub}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
