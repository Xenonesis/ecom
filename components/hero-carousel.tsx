'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Promotion {
  id: string
  title: string
  description: string | null
  image_url: string
  link_url: string | null
  category: string | null
  is_active: boolean
  display_order: number
}

interface HeroCarouselProps {
  readonly promotions?: Promotion[]
}

export function HeroCarousel({ promotions = [] }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Default slides if no promotions provided
  const defaultSlides: Promotion[] = [
    {
      id: 'default-1',
      title: 'Welcome to ShopHub',
      description: 'Discover amazing deals on quality products from verified sellers',
      image_url: '/placeholder.svg',
      link_url: '/products',
      category: null,
      is_active: true,
      display_order: 1,
    },
    {
      id: 'default-2',
      title: 'Flash Sale Today',
      description: 'Up to 50% off on selected items - Limited time offer',
      image_url: '/placeholder.svg',
      link_url: '/deals',
      category: null,
      is_active: true,
      display_order: 2,
    },
    {
      id: 'default-3',
      title: 'New Arrivals',
      description: 'Check out our latest collection of trending products',
      image_url: '/placeholder.svg',
      link_url: '/products',
      category: null,
      is_active: true,
      display_order: 3,
    },
  ]

  const slides = promotions.length > 0 ? promotions : defaultSlides

  useEffect(() => {
    if (slides.length === 0) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Auto-advance every 5 seconds

    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
        <span className="text-muted-foreground text-lg">No promotions available.</span>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg bg-muted">
      {/* Slides */}
      {slides.map((promo, index) => (
        <div
          key={promo.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {promo.link_url ? (
            <Link href={promo.link_url} className="block w-full h-full relative">
              <Image
                src={promo.image_url}
                alt={promo.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">{promo.title}</h2>
                {promo.description && (
                  <p className="text-lg md:text-xl opacity-90 max-w-2xl">{promo.description}</p>
                )}
              </div>
            </Link>
          ) : (
            <div className="relative w-full h-full">
              <Image
                src={promo.image_url}
                alt={promo.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-2">{promo.title}</h2>
                {promo.description && (
                  <p className="text-lg md:text-xl opacity-90 max-w-2xl">{promo.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full opacity-80 hover:opacity-100"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((promo, index) => (
              <button
                key={`slide-${promo.id}-${index}`}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
