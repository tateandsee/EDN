'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { TrendingUp, TrendingDown, Eye, Download, Star, Users, DollarSign, Calendar, BarChart3, PieChart, Activity } from 'lucide-react'

export interface AnalyticsData {
  overview: {
    totalViews: number
    totalDownloads: number
    totalRevenue: number
    totalFollowers: number
    averageRating: number
    engagementRate: number
  }
  content: {
    totalContent: number
    contentByType: {
      images: number
      videos: number
      audio: number
      other: number
    }
    topContent: Array<{
      id: string
      title: string
      type: string
      views: number
      downloads: number
      revenue: number
      rating: number
    }>
  }
  audience: {
    demographics: {
      age: Array<{
        range: string
        percentage: number
      }>
      gender: Array<{
        type: string
        percentage: number
      }>
      location: Array<{
        country: string
        percentage: number
      }>
    }
    engagement: {
      daily: Array<{
        date: string
        views: number
        downloads: number
        engagement: number
      }>
      monthly: Array<{
        month: string
        views: number
        downloads: number
        revenue: number
      }>
    }
  }
  revenue: {
    total: number
    bySource: Array<{
      source: string
      amount: number
      percentage: number
    }>
    monthly: Array<{
      month: string
      revenue: number
      growth: number
    }>
    subscriptions: {
      active: number
      canceled: number
      churnRate: number
    }
  }
  performance: {
    loadTime: number
    uptime: number
    errorRate: number
    conversionRate: number
    retentionRate: number
  }
}

interface AnalyticsContextType {
  data: AnalyticsData | null
  isLoading: boolean
  dateRange: '7d' | '30d' | '90d' | '1y'
  setDateRange: (range: '7d' | '30d' | '90d' | '1y') => void
  refreshData: () => Promise<void>
  exportData: (format: 'csv' | 'pdf' | 'json') => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRangeState] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock analytics data
      const mockData: AnalyticsData = {
        overview: {
          totalViews: 2890000,
          totalDownloads: 45600,
          totalRevenue: 12450,
          totalFollowers: 12450,
          averageRating: 4.8,
          engagementRate: 12.5
        },
        content: {
          totalContent: 156,
          contentByType: {
            images: 89,
            videos: 45,
            audio: 12,
            other: 10
          },
          topContent: [
            {
              id: '1',
              title: 'Stunning AI-Generated Portrait',
              type: 'image',
              views: 154200,
              downloads: 892,
              revenue: 450,
              rating: 4.8
            },
            {
              id: '2',
              title: 'Cinematic AI Video',
              type: 'video',
              views: 321000,
              downloads: 567,
              revenue: 780,
              rating: 4.6
            },
            {
              id: '3',
              title: 'Virtual Try-On Experience',
              type: 'image',
              views: 289000,
              downloads: 445,
              revenue: 320,
              rating: 4.7
            }
          ]
        },
        audience: {
          demographics: {
            age: [
              { range: '18-24', percentage: 25 },
              { range: '25-34', percentage: 35 },
              { range: '35-44', percentage: 20 },
              { range: '45-54', percentage: 15 },
              { range: '55+', percentage: 5 }
            ],
            gender: [
              { type: 'Male', percentage: 45 },
              { type: 'Female', percentage: 48 },
              { type: 'Other', percentage: 7 }
            ],
            location: [
              { country: 'United States', percentage: 35 },
              { country: 'United Kingdom', percentage: 15 },
              { country: 'Canada', percentage: 12 },
              { country: 'Germany', percentage: 10 },
              { country: 'Other', percentage: 28 }
            ]
          },
          engagement: {
            daily: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              views: Math.floor(Math.random() * 50000) + 10000,
              downloads: Math.floor(Math.random() * 1000) + 100,
              engagement: Math.random() * 20 + 5
            })),
            monthly: Array.from({ length: 12 }, (_, i) => ({
              month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
              views: Math.floor(Math.random() * 500000) + 100000,
              downloads: Math.floor(Math.random() * 10000) + 1000,
              revenue: Math.floor(Math.random() * 2000) + 500
            }))
          }
        },
        revenue: {
          total: 12450,
          bySource: [
            { source: 'Subscriptions', amount: 8900, percentage: 71.5 },
            { source: 'Marketplace', amount: 2350, percentage: 18.9 },
            { source: 'Affiliate', amount: 800, percentage: 6.4 },
            { source: 'Other', amount: 400, percentage: 3.2 }
          ],
          monthly: Array.from({ length: 12 }, (_, i) => ({
            month: new Date(Date.now() - (11 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short' }),
            revenue: Math.floor(Math.random() * 2000) + 800,
            growth: (Math.random() - 0.5) * 40
          })),
          subscriptions: {
            active: 156,
            canceled: 12,
            churnRate: 7.1
          }
        },
        performance: {
          loadTime: 1.2,
          uptime: 99.9,
          errorRate: 0.1,
          conversionRate: 3.2,
          retentionRate: 85.5
        }
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange])

  const setDateRange = (range: '7d' | '30d' | '90d' | '1y') => {
    setDateRangeState(range)
  }

  const refreshData = async () => {
    await loadAnalyticsData()
  }

  const exportData = async (format: 'csv' | 'pdf' | 'json') => {
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, this would generate and download the file
      console.log(`Exporting data as ${format.toUpperCase()}`)
      
      return Promise.resolve()
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }

  return (
    <AnalyticsContext.Provider value={{
      data,
      isLoading,
      dateRange,
      setDateRange,
      refreshData,
      exportData
    }}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

// Analytics Components
export function AnalyticsOverview() {
  const { data } = useAnalytics()

  if (!data) return null

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  const overviewCards = [
    {
      title: 'Total Views',
      value: formatNumber(data.overview.totalViews),
      change: '+12.5%',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Downloads',
      value: formatNumber(data.overview.totalDownloads),
      change: '+8.3%',
      icon: Download,
      color: 'text-green-600'
    },
    {
      title: 'Revenue',
      value: formatCurrency(data.overview.totalRevenue),
      change: '+15.2%',
      icon: DollarSign,
      color: 'text-purple-600'
    },
    {
      title: 'Followers',
      value: formatNumber(data.overview.totalFollowers),
      change: '+5.7%',
      icon: Users,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((card, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 bg-gray-100 rounded-lg`}>
              <card.icon className={`h-6 w-6 ${card.color}`} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              {card.change}
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{card.value}</div>
          <div className="text-sm text-gray-600">{card.title}</div>
        </div>
      ))}
    </div>
  )
}

export function ContentAnalytics() {
  const { data } = useAnalytics()

  if (!data) return null

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Content Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
        <div className="space-y-4">
          {Object.entries(data.content.contentByType).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="capitalize">{type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{count}</span>
                <span className="text-sm text-gray-500">
                  ({((count / data.content.totalContent) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Content */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
        <div className="space-y-3">
          {data.content.topContent.map((content, index) => (
            <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-sm">{content.title}</div>
                <div className="text-xs text-gray-500 capitalize">{content.type}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{formatNumber(content.views)} views</div>
                <div className="text-xs text-gray-500">{content.rating} ★</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AudienceAnalytics() {
  const { data } = useAnalytics()

  if (!data) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Age Demographics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
        <div className="space-y-3">
          {data.audience.demographics.age.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.range}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender Demographics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
        <div className="space-y-3">
          {data.audience.demographics.gender.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.type}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Demographics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Top Locations</h3>
        <div className="space-y-3">
          {data.audience.demographics.location.slice(0, 5).map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{item.country}</span>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RevenueAnalytics() {
  const { data } = useAnalytics()

  if (!data) return null

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Source */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Revenue by Source</h3>
        <div className="space-y-3">
          {data.revenue.bySource.map((source, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{source.source}</span>
                <span className="text-sm font-medium">{formatCurrency(source.amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${source.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{source.percentage}% of total</div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Subscription Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{data.revenue.subscriptions.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{data.revenue.subscriptions.canceled}</div>
            <div className="text-sm text-gray-600">Canceled</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{data.revenue.subscriptions.churnRate}%</div>
            <div className="text-sm text-gray-600">Churn Rate</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.revenue.total)}</div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PerformanceAnalytics() {
  const { data } = useAnalytics()

  if (!data) return null

  const metrics = [
    {
      title: 'Load Time',
      value: `${data.performance.loadTime}s`,
      target: '< 2s',
      status: data.performance.loadTime < 2 ? 'good' : 'warning'
    },
    {
      title: 'Uptime',
      value: `${data.performance.uptime}%`,
      target: '> 99%',
      status: data.performance.uptime >= 99 ? 'good' : 'warning'
    },
    {
      title: 'Error Rate',
      value: `${data.performance.errorRate}%`,
      target: '< 1%',
      status: data.performance.errorRate < 1 ? 'good' : 'warning'
    },
    {
      title: 'Conversion Rate',
      value: `${data.performance.conversionRate}%`,
      target: '> 2%',
      status: data.performance.conversionRate >= 2 ? 'good' : 'warning'
    },
    {
      title: 'Retention Rate',
      value: `${data.performance.retentionRate}%`,
      target: '> 80%',
      status: data.performance.retentionRate >= 80 ? 'good' : 'warning'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100'
      case 'warning':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm">{metric.title}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(metric.status)}`}>
                {metric.status}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className="text-xs text-gray-500">Target: {metric.target}</div>
          </div>
        ))}
      </div>
    </div>
  )
}