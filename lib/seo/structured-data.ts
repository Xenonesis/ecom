import { Database } from '@/lib/supabase/database.types'

type Product = Database['public']['Tables']['products']['Row']

export function generateProductSchema(product: Product & { category?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.[0] || '',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: product.stock && product.stock > 0 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
    },
    aggregateRating: product.rating ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
    brand: {
      '@type': 'Brand',
      name: 'ShopHub',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ShopHub',
    description: 'Modern E-Commerce Platform - Shop the best products from verified sellers',
    url: 'https://shophub.com',
    logo: 'https://shophub.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'Customer Service',
      availableLanguage: 'English',
    },
    sameAs: [
      'https://facebook.com/shophub',
      'https://twitter.com/shophub',
      'https://instagram.com/shophub',
    ],
  };
}

interface Review {
  rating: number;
  comment?: string | null;
  created_at: string;
  users?: { name: string } | null;
}

export function generateReviewSchema(product: Product, reviews: Review[]) {
  if (!reviews || reviews.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    review: reviews.map(review => ({
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
      },
      author: {
        '@type': 'Person',
        name: review.users?.name || 'Anonymous',
      },
      reviewBody: review.comment || '',
      datePublished: review.created_at,
    })),
  };
}
