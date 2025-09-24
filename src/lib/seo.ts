import type { Metadata, ResolvingMetadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  openGraph?: {
    title?: string
    description?: string
    images?: Array<{
      url: string
      width?: number
      height?: number
      alt?: string
    }>
    type?: 'website' | 'article' | 'product'
    url?: string
    siteName?: string
    locale?: string
  }
  twitter?: {
    card?: 'summary' | 'summary_large_image'
    title?: string
    description?: string
    images?: string[]
    creator?: string
    site?: string
  }
  robots?: string
  alternate?: Array<{
    hrefLang: string
    href: string
  }>
  noIndex?: boolean
  noFollow?: boolean
}

const defaultSEO: SEOProps = {
  title: 'EDN - AI Content Creation Platform',
  description: 'Create stunning AI-generated content for SFW and NSFW platforms. Advanced AI models for influencers, creators, and content creators with professional tools and distribution.',
  keywords: [
    'AI content creation',
    'influencer marketing',
    'NSFW content',
    'SFW content',
    'AI models',
    'content generation',
    'AI influencer',
    'content distribution',
    'digital creators',
    'AI-powered content',
    'content automation',
    'social media content',
    'creator tools',
    'AI platform',
    'EDN platform'
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'EDN Platform',
    title: 'EDN - AI Content Creation Platform',
    description: 'Create stunning AI-generated content for SFW and NSFW platforms with advanced AI models.',
    images: [
      {
        url: '/hero-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'EDN AI Content Creation Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EDN - AI Content Creation Platform',
    description: 'Create stunning AI-generated content for SFW and NSFW platforms.',
    images: ['/hero-homepage.jpg'],
    creator: '@ednplatform',
    site: '@ednplatform'
  },
  robots: 'index, follow'
}

export function generateSEO(props: SEOProps = {}): Metadata {
  const seo = { ...defaultSEO, ...props }
  
  const metadata: Metadata = {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    authors: [{ name: 'EDN Team' }],
    creator: 'EDN Platform',
    publisher: 'EDN Platform',
    robots: seo.noIndex || seo.noFollow 
      ? `${seo.noIndex ? 'noindex' : 'index'}, ${seo.noFollow ? 'nofollow' : 'follow'}`
      : seo.robots,
    openGraph: seo.openGraph ? {
      title: seo.openGraph.title || seo.title,
      description: seo.openGraph.description || seo.description,
      url: seo.openGraph.url,
      siteName: seo.openGraph.siteName,
      locale: seo.openGraph.locale,
      type: seo.openGraph.type,
      images: seo.openGraph.images
    } : undefined,
    twitter: seo.twitter ? {
      card: seo.twitter.card,
      title: seo.twitter.title || seo.title,
      description: seo.twitter.description || seo.description,
      images: seo.twitter.images,
      creator: seo.twitter.creator,
      site: seo.twitter.site
    } : undefined,
    alternates: seo.alternate ? {
      canonical: seo.canonical,
      languages: seo.alternate.reduce((acc, alt) => {
        acc[alt.hrefLang] = alt.href
        return acc
      }, {} as Record<string, string>)
    } : seo.canonical ? {
      canonical: seo.canonical
    } : undefined,
    other: {
      'twitter:domain': 'ednplatform.com',
      'twitter:label1': 'Platform',
      'twitter:data1': 'AI Content Creation',
      'twitter:label2': 'Pricing',
      'twitter:data2': 'Free to Enterprise'
    }
  }

  return metadata
}

// Page-specific SEO configurations
export const pageSEO = {
  home: generateSEO({
    title: 'EDN - AI Content Creation Platform for Creators',
    description: 'Create stunning AI-generated content for SFW and NSFW platforms. Advanced AI models for influencers, creators, and content creators with professional tools and multi-platform distribution.',
    keywords: [
      'AI content creation',
      'influencer platform',
      'NSFW content creation',
      'SFW content creation',
      'AI models',
      'content distribution',
      'creator tools',
      'AI influencer'
    ]
  }),

  marketplace: generateSEO({
    title: 'EDN Marketplace - AI Models & Digital Assets',
    description: 'Browse and purchase premium AI models, templates, and digital assets for content creation. Professional tools for creators and influencers.',
    keywords: [
      'AI marketplace',
      'digital assets',
      'AI models',
      'creator tools',
      'content templates',
      'digital marketplace',
      'AI assets'
    ],
    openGraph: {
      type: 'website',
      title: 'EDN Marketplace - AI Models & Digital Assets',
      description: 'Browse and purchase premium AI models, templates, and digital assets for content creation.'
    }
  }),

  showcase: generateSEO({
    title: 'EDN Showcase - AI-Generated Influencer Gallery',
    description: 'Explore stunning AI-generated influencers and content created with EDN platform. Get inspired by our community of creators.',
    keywords: [
      'AI influencers',
      'influencer showcase',
      'AI-generated content',
      'creator gallery',
      'digital influencers',
      'AI showcase'
    ],
    openGraph: {
      type: 'website',
      title: 'EDN Showcase - AI-Generated Influencer Gallery',
      description: 'Explore stunning AI-generated influencers and content created with EDN platform.'
    }
  }),

  create: generateSEO({
    title: 'Create AI Content - EDN Content Creation Tools',
    description: 'Create stunning AI-generated content with EDN\'s powerful creation tools. Customize, generate, and distribute content across multiple platforms.',
    keywords: [
      'AI content creation',
      'content creation tools',
      'AI generator',
      'content creator',
      'AI tools',
      'content automation'
    ],
    openGraph: {
      type: 'website',
      title: 'Create AI Content - EDN Content Creation Tools',
      description: 'Create stunning AI-generated content with EDN\'s powerful creation tools.'
    }
  }),

  distribute: generateSEO({
    title: 'Distribute Content - Multi-Platform Distribution | EDN',
    description: 'Distribute your content across 14+ platforms automatically. Reach your audience everywhere with EDN\'s intelligent distribution system.',
    keywords: [
      'content distribution',
      'multi-platform posting',
      'social media automation',
      'content scheduling',
      'platform integration',
      'content syndication'
    ],
    openGraph: {
      type: 'website',
      title: 'Distribute Content - Multi-Platform Distribution | EDN',
      description: 'Distribute your content across 14+ platforms automatically with EDN.'
    }
  }),

  pricing: generateSEO({
    title: 'Pricing Plans - EDN Content Creation Platform',
    description: 'Choose the perfect EDN plan for your content creation needs. From free to enterprise solutions with advanced AI models and distribution.',
    keywords: [
      'AI platform pricing',
      'content creation pricing',
      'creator plans',
      'AI subscription',
      'platform pricing',
      'creator tools cost'
    ],
    openGraph: {
      type: 'website',
      title: 'Pricing Plans - EDN Content Creation Platform',
      description: 'Choose the perfect EDN plan for your content creation needs.'
    }
  }),

  features: generateSEO({
    title: 'Features - Advanced AI Content Creation Tools | EDN',
    description: 'Explore EDN\'s powerful features including AI models, content distribution, analytics, and collaboration tools for creators.',
    keywords: [
      'AI platform features',
      'content creation features',
      'AI tools',
      'creator features',
      'platform capabilities',
      'AI features'
    ],
    openGraph: {
      type: 'website',
      title: 'Features - Advanced AI Content Creation Tools | EDN',
      description: 'Explore EDN\'s powerful features for AI content creation and distribution.'
    }
  }),

  affiliate: generateSEO({
    title: 'Affiliate Program - Earn with EDN Platform',
    description: 'Join EDN\'s affiliate program and earn commissions by referring creators. Multiple tiers, generous commissions, and marketing tools.',
    keywords: [
      'affiliate program',
      'creator affiliate',
      'referral program',
      'earn money',
      'creator monetization',
      'affiliate marketing'
    ],
    openGraph: {
      type: 'website',
      title: 'Affiliate Program - Earn with EDN Platform',
      description: 'Join EDN\'s affiliate program and earn commissions by referring creators.'
    }
  }),

  support: generateSEO({
    title: 'Support Center - Help & Documentation | EDN',
    description: 'Get help with EDN platform. Find documentation, tutorials, and contact our support team for assistance with AI content creation.',
    keywords: [
      'platform support',
      'creator help',
      'documentation',
      'AI platform support',
      'customer service',
      'help center'
    ],
    openGraph: {
      type: 'website',
      title: 'Support Center - Help & Documentation | EDN',
      description: 'Get help with EDN platform. Find documentation, tutorials, and support.'
    }
  }),

  blog: generateSEO({
    title: 'EDN Blog - AI Content Creation Tips & News',
    description: 'Stay updated with the latest AI content creation trends, tips, and news from EDN platform. Expert insights for creators.',
    keywords: [
      'AI content blog',
      'creator blog',
      'AI trends',
      'content creation tips',
      'industry news',
      'creator insights'
    ],
    openGraph: {
      type: 'website',
      title: 'EDN Blog - AI Content Creation Tips & News',
      description: 'Stay updated with the latest AI content creation trends and news from EDN.'
    }
  }),

  auth: generateSEO({
    title: 'Sign In - EDN Platform',
    description: 'Sign in to your EDN account to access AI content creation tools, marketplace, and distribution features.',
    noIndex: true
  }),

  dashboard: generateSEO({
    title: 'Dashboard - EDN Content Creation Platform',
    description: 'Access your EDN dashboard to manage content, view analytics, and control your AI creation tools.',
    noIndex: true
  })
}

// Dynamic SEO for marketplace items
export function generateMarketplaceItemSEO(item: {
  id: string
  title: string
  description?: string
  category: string
  isNsfw?: boolean
  price: number
}): Metadata {
  return generateSEO({
    title: `${item.title} - EDN Marketplace`,
    description: item.description || `Purchase ${item.title} from EDN Marketplace. ${item.category} - $${item.price}`,
    keywords: [
      item.title,
      item.category,
      'AI model',
      'digital asset',
      'marketplace',
      item.isNsfw ? 'NSFW' : 'SFW'
    ],
    openGraph: {
      type: 'product',
      title: `${item.title} - EDN Marketplace`,
      description: item.description || `Purchase ${item.title} from EDN Marketplace`,
      images: item.id ? [`/marketplace-item-${item.id.split('-').pop() || '1'}.jpg`] : undefined
    }
  })
}

// Dynamic SEO for showcase items
export function generateShowcaseItemSEO(item: {
  id: string
  name: string
  bio?: string
  tags?: string[]
}): Metadata {
  return generateSEO({
    title: `${item.name} - EDN Showcase`,
    description: item.bio || `View ${item.name}'s profile on EDN Showcase. AI-generated influencer and content creator.`,
    keywords: [
      item.name,
      'AI influencer',
      'showcase',
      'digital creator',
      ...(item.tags || [])
    ],
    openGraph: {
      type: 'profile',
      title: `${item.name} - EDN Showcase`,
      description: item.bio || `View ${item.name}'s profile on EDN Showcase.`,
      images: item.id ? [`/marketplace-item-${item.id}.jpg`] : undefined
    }
  })
}

// Structured data generation
export function generateStructuredData(type: 'organization' | 'website' | 'product', data: any) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  }

  return {
    __html: JSON.stringify(structuredData)
  }
}