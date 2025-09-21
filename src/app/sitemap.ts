import { MetadataRoute } from 'next'
import { constants } from './constants'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ednplatform.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '',
    '/marketplace',
    '/showcase',
    '/create',
    '/distribute',
    '/pricing',
    '/features',
    '/affiliate',
    '/support',
    '/blog',
    '/auth/signin',
    '/privacy',
    '/terms',
    '/gdpr',
    '/ccpa',
    '/compliance'
  ]

  const sitemap: MetadataRoute.Sitemap = staticPages.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))

  // Add marketplace categories
  const marketplaceCategories = ['MODELS', 'EDUCATION', 'TOOLS', 'SERVICES', 'ENTERTAINMENT']
  marketplaceCategories.forEach((category) => {
    sitemap.push({
      url: `${siteUrl}/marketplace?category=${category.toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  })

  // Add blog posts (if you have a dynamic blog system)
  // This would typically come from your CMS or database
  const blogPosts = [
    'getting-started-with-ai-content-creation',
    'top-10-ai-tools-for-creators',
    'how-to-monetize-your-ai-content',
    'nsfw-content-creation-best-practices',
    'multi-platform-content-distribution-guide'
  ]

  blogPosts.forEach((slug) => {
    sitemap.push({
      url: `${siteUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  })

  return sitemap
}