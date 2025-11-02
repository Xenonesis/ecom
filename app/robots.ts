import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/seller/', '/api/', '/checkout/', '/profile/'],
      },
    ],
    sitemap: 'https://shophub.com/sitemap.xml',
  }
}
