'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface IntegrationState {
  // Marketing-Affiliate Integration
  campaignAffiliateLinks: Array<{
    campaignId: string
    affiliateCode: string
    customLandingPage: string
    conversionRate: number
    totalReferrals: number
    totalEarnings: number
  }>
  
  // Social-Affiliate Integration
  socialAffiliatePosts: Array<{
    postId: string
    platform: string
    affiliateLink: string
    clicks: number
    conversions: number
    earnings: number
  }>
  
  // Cross-Platform Analytics
  unifiedAnalytics: {
    totalCampaigns: number
    affiliateEnabledCampaigns: number
    totalSocialPosts: number
    affiliateEnabledPosts: number
    totalReferrals: number
    totalEarnings: number
    topPerformingCampaigns: Array<{
      campaignId: string
      campaignName: string
      referrals: number
      earnings: number
    }>
    topPerformingPosts: Array<{
      postId: string
      platform: string
      referrals: number
      earnings: number
    }>
  }
  
  // Integration Settings
  settings: {
    autoGenerateAffiliateLinks: boolean
    trackSocialEngagement: boolean
    enableCrossPlatformAnalytics: boolean
    defaultCommissionRate: number
    customTrackingParameters: Record<string, string>
  }
  
  // Loading and Error States
  loading: boolean
  error: string | null
}

type IntegrationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CAMPAIGN_AFFILIATE_LINKS'; payload: IntegrationState['campaignAffiliateLinks'] }
  | { type: 'ADD_CAMPAIGN_AFFILIATE_LINK'; payload: IntegrationState['campaignAffiliateLinks'][0] }
  | { type: 'UPDATE_CAMPAIGN_AFFILIATE_LINK'; payload: { campaignId: string; updates: Partial<IntegrationState['campaignAffiliateLinks'][0]> } }
  | { type: 'REMOVE_CAMPAIGN_AFFILIATE_LINK'; payload: string }
  | { type: 'SET_SOCIAL_AFFILIATE_POSTS'; payload: IntegrationState['socialAffiliatePosts'] }
  | { type: 'ADD_SOCIAL_AFFILIATE_POST'; payload: IntegrationState['socialAffiliatePosts'][0] }
  | { type: 'UPDATE_SOCIAL_AFFILIATE_POST'; payload: { postId: string; updates: Partial<IntegrationState['socialAffiliatePosts'][0]> } }
  | { type: 'REMOVE_SOCIAL_AFFILIATE_POST'; payload: string }
  | { type: 'SET_UNIFIED_ANALYTICS'; payload: IntegrationState['unifiedAnalytics'] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<IntegrationState['settings']> }
  | { type: 'RESET_STATE' }

const initialState: IntegrationState = {
  campaignAffiliateLinks: [],
  socialAffiliatePosts: [],
  unifiedAnalytics: {
    totalCampaigns: 0,
    affiliateEnabledCampaigns: 0,
    totalSocialPosts: 0,
    affiliateEnabledPosts: 0,
    totalReferrals: 0,
    totalEarnings: 0,
    topPerformingCampaigns: [],
    topPerformingPosts: []
  },
  settings: {
    autoGenerateAffiliateLinks: true,
    trackSocialEngagement: true,
    enableCrossPlatformAnalytics: true,
    defaultCommissionRate: 15,
    customTrackingParameters: {}
  },
  loading: false,
  error: null
}

function integrationReducer(state: IntegrationState, action: IntegrationAction): IntegrationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_CAMPAIGN_AFFILIATE_LINKS':
      return { ...state, campaignAffiliateLinks: action.payload }

    case 'ADD_CAMPAIGN_AFFILIATE_LINK':
      return { 
        ...state, 
        campaignAffiliateLinks: [...state.campaignAffiliateLinks, action.payload]
      }

    case 'UPDATE_CAMPAIGN_AFFILIATE_LINK':
      return {
        ...state,
        campaignAffiliateLinks: state.campaignAffiliateLinks.map(link =>
          link.campaignId === action.payload.campaignId
            ? { ...link, ...action.payload.updates }
            : link
        )
      }

    case 'REMOVE_CAMPAIGN_AFFILIATE_LINK':
      return {
        ...state,
        campaignAffiliateLinks: state.campaignAffiliateLinks.filter(
          link => link.campaignId !== action.payload
        )
      }

    case 'SET_SOCIAL_AFFILIATE_POSTS':
      return { ...state, socialAffiliatePosts: action.payload }

    case 'ADD_SOCIAL_AFFILIATE_POST':
      return { 
        ...state, 
        socialAffiliatePosts: [...state.socialAffiliatePosts, action.payload]
      }

    case 'UPDATE_SOCIAL_AFFILIATE_POST':
      return {
        ...state,
        socialAffiliatePosts: state.socialAffiliatePosts.map(post =>
          post.postId === action.payload.postId
            ? { ...post, ...action.payload.updates }
            : post
        )
      }

    case 'REMOVE_SOCIAL_AFFILIATE_POST':
      return {
        ...state,
        socialAffiliatePosts: state.socialAffiliatePosts.filter(
          post => post.postId !== action.payload
        )
      }

    case 'SET_UNIFIED_ANALYTICS':
      return { ...state, unifiedAnalytics: action.payload }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      }

    case 'RESET_STATE':
      return initialState

    default:
      return state
  }
}

interface IntegrationContextType {
  state: IntegrationState
  dispatch: React.Dispatch<IntegrationAction>
  
  // Marketing-Affiliate Integration Actions
  createCampaignAffiliateLink: (campaignId: string, affiliateCode: string, customLandingPage?: string) => Promise<void>
  updateCampaignAffiliateLink: (campaignId: string, updates: Partial<IntegrationState['campaignAffiliateLinks'][0]>) => Promise<void>
  removeCampaignAffiliateLink: (campaignId: string) => Promise<void>
  
  // Social-Affiliate Integration Actions
  createSocialAffiliatePost: (postId: string, platform: string, affiliateLink: string) => Promise<void>
  updateSocialAffiliatePost: (postId: string, updates: Partial<IntegrationState['socialAffiliatePosts'][0]>) => Promise<void>
  removeSocialAffiliatePost: (postId: string) => Promise<void>
  
  // Analytics Actions
  fetchUnifiedAnalytics: () => Promise<void>
  
  // Settings Actions
  updateIntegrationSettings: (settings: Partial<IntegrationState['settings']>) => Promise<void>
  
  // Utility Actions
  generateAffiliateLinkForCampaign: (campaignId: string) => string
  generateAffiliateLinkForSocialPost: (postId: string, platform: string) => string
  trackReferralConversion: (source: string, sourceId: string, conversionValue: number) => Promise<void>
}

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined)

export function IntegrationProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(integrationReducer, initialState)

  // Marketing-Affiliate Integration Actions
  const createCampaignAffiliateLink = async (campaignId: string, affiliateCode: string, customLandingPage?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_campaign_integration',
          data: {
            campaignId,
            referralCode: affiliateCode,
            customLandingPage: customLandingPage || '/',
            trackingSettings: state.settings.customTrackingParameters
          }
        })
      })

      if (!response.ok) throw new Error('Failed to create campaign affiliate link')

      const result = await response.json()
      
      dispatch({
        type: 'ADD_CAMPAIGN_AFFILIATE_LINK',
        payload: {
          campaignId,
          affiliateCode,
          customLandingPage: customLandingPage || '/',
          conversionRate: 0,
          totalReferrals: 0,
          totalEarnings: 0
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateCampaignAffiliateLink = async (campaignId: string, updates: Partial<IntegrationState['campaignAffiliateLinks'][0]>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/affiliate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'campaign_integration',
          id: campaignId,
          updates
        })
      })

      if (!response.ok) throw new Error('Failed to update campaign affiliate link')

      dispatch({ type: 'UPDATE_CAMPAIGN_AFFILIATE_LINK', payload: { campaignId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeCampaignAffiliateLink = async (campaignId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch(`/api/affiliate?type=campaign_integration&id=${campaignId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove campaign affiliate link')

      dispatch({ type: 'REMOVE_CAMPAIGN_AFFILIATE_LINK', payload: campaignId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Social-Affiliate Integration Actions
  const createSocialAffiliatePost = async (postId: string, platform: string, affiliateLink: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_social_integration',
          data: {
            postId,
            platform,
            content: '', // Will be filled from social post
            affiliateLink
          }
        })
      })

      if (!response.ok) throw new Error('Failed to create social affiliate post')

      dispatch({
        type: 'ADD_SOCIAL_AFFILIATE_POST',
        payload: {
          postId,
          platform,
          affiliateLink,
          clicks: 0,
          conversions: 0,
          earnings: 0
        }
      })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateSocialAffiliatePost = async (postId: string, updates: Partial<IntegrationState['socialAffiliatePosts'][0]>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch('/api/affiliate', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'social_integration',
          id: postId,
          updates
        })
      })

      if (!response.ok) throw new Error('Failed to update social affiliate post')

      dispatch({ type: 'UPDATE_SOCIAL_AFFILIATE_POST', payload: { postId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const removeSocialAffiliatePost = async (postId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const response = await fetch(`/api/affiliate?type=social_integration&id=${postId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to remove social affiliate post')

      dispatch({ type: 'REMOVE_SOCIAL_AFFILIATE_POST', payload: postId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Analytics Actions
  const fetchUnifiedAnalytics = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const [campaignResponse, socialResponse, affiliateResponse] = await Promise.all([
        fetch('/api/marketing?type=overview'),
        fetch('/api/social?type=stats'),
        fetch('/api/affiliate?type=overview')
      ])

      if (!campaignResponse.ok || !socialResponse.ok || !affiliateResponse.ok) {
        throw new Error('Failed to fetch unified analytics')
      }

      const [campaignData, socialData, affiliateData] = await Promise.all([
        campaignResponse.json(),
        socialResponse.json(),
        affiliateResponse.json()
      ])

      const unifiedAnalytics = {
        totalCampaigns: campaignData.totalCampaigns || 0,
        affiliateEnabledCampaigns: state.campaignAffiliateLinks.length,
        totalSocialPosts: socialData.totalPosts || 0,
        affiliateEnabledPosts: state.socialAffiliatePosts.length,
        totalReferrals: affiliateData.stats?.totalReferrals || 0,
        totalEarnings: affiliateData.stats?.totalEarnings || 0,
        topPerformingCampaigns: state.campaignAffiliateLinks
          .sort((a, b) => b.totalEarnings - a.totalEarnings)
          .slice(0, 5)
          .map(link => ({
            campaignId: link.campaignId,
            campaignName: `Campaign ${link.campaignId}`,
            referrals: link.totalReferrals,
            earnings: link.totalEarnings
          })),
        topPerformingPosts: state.socialAffiliatePosts
          .sort((a, b) => b.earnings - a.earnings)
          .slice(0, 5)
          .map(post => ({
            postId: post.postId,
            platform: post.platform,
            referrals: post.conversions,
            earnings: post.earnings
          }))
      }

      dispatch({ type: 'SET_UNIFIED_ANALYTICS', payload: unifiedAnalytics })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Settings Actions
  const updateIntegrationSettings = async (settings: Partial<IntegrationState['settings']>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      // Save settings to localStorage or backend
      localStorage.setItem('integrationSettings', JSON.stringify(settings))
      
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Utility Actions
  const generateAffiliateLinkForCampaign = (campaignId: string) => {
    const existingLink = state.campaignAffiliateLinks.find(link => link.campaignId === campaignId)
    if (existingLink) {
      return `https://edn.com/ref/${existingLink.affiliateCode}`
    }
    
    const code = `CAMP${campaignId.slice(-6).toUpperCase()}`
    return `https://edn.com/ref/${code}`
  }

  const generateAffiliateLinkForSocialPost = (postId: string, platform: string) => {
    const existingPost = state.socialAffiliatePosts.find(post => post.postId === postId && post.platform === platform)
    if (existingPost) {
      return existingPost.affiliateLink
    }
    
    const code = `SOCIAL${postId.slice(-6).toUpperCase()}`
    return `https://edn.com/ref/${code}`
  }

  const trackReferralConversion = async (source: string, sourceId: string, conversionValue: number) => {
    try {
      await fetch('/api/affiliate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_conversion',
          data: {
            referralId: sourceId,
            conversionValue,
            planType: source
          }
        })
      })
    } catch (error) {
      console.error('Failed to track conversion:', error)
    }
  }

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        
        // Load settings from localStorage
        const savedSettings = localStorage.getItem('integrationSettings')
        if (savedSettings) {
          dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) })
        }
        
        // Load campaign integrations
        const campaignResponse = await fetch('/api/affiliate?type=campaign_integrations')
        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json()
          dispatch({ type: 'SET_CAMPAIGN_AFFILIATE_LINKS', payload: campaignData })
        }
        
        // Load social integrations
        const socialResponse = await fetch('/api/affiliate?type=social_integrations')
        if (socialResponse.ok) {
          const socialData = await socialResponse.json()
          dispatch({ type: 'SET_SOCIAL_AFFILIATE_POSTS', payload: socialData })
        }
        
        // Load unified analytics
        await fetchUnifiedAnalytics()
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
    
    loadInitialData()
  }, [])

  const value: IntegrationContextType = {
    state,
    dispatch,
    createCampaignAffiliateLink,
    updateCampaignAffiliateLink,
    removeCampaignAffiliateLink,
    createSocialAffiliatePost,
    updateSocialAffiliatePost,
    removeSocialAffiliatePost,
    fetchUnifiedAnalytics,
    updateIntegrationSettings,
    generateAffiliateLinkForCampaign,
    generateAffiliateLinkForSocialPost,
    trackReferralConversion
  }

  return (
    <IntegrationContext.Provider value={value}>
      {children}
    </IntegrationContext.Provider>
  )
}

export function useIntegration() {
  const context = useContext(IntegrationContext)
  if (context === undefined) {
    throw new Error('useIntegration must be used within an IntegrationProvider')
  }
  return context
}