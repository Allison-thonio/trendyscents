import { MetadataRoute } from 'next'
import { scents } from '@/lib/catalog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://trendyscents.ng'
  const currentDate = new Date()

  // Primary static routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Dynamic scent product URLs for Google indexation
  const scentRoutes = scents.map((scent) => ({
    url: `${baseUrl}/shop#${scent.id}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...routes, ...scentRoutes]
}
