import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ShopHub - Modern E-Commerce Platform',
    short_name: 'ShopHub',
    description: 'Shop the best products from verified sellers',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7C3AED',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
