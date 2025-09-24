'use client'

import { useState } from 'react'
import { useAnalytics } from '@/contexts/analytics-context'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  RefreshCw, 
  Calendar, 
  Users, 
  DollarSign, 
  Eye,
  FileText,
  PieChart,
  Activity,
  Settings,
  Filter,
  Download as DownloadIcon
} from 'lucide-react'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive'
import { 
  AnalyticsOverview, 
  ContentAnalytics, 
  AudienceAnalytics, 
  RevenueAnalytics, 
  PerformanceAnalytics 
} from '@/contexts/analytics-context'

export default function AnalyticsPage() {
  const { 
    data, 
    isLoading, 
    dateRange, 
    setDateRange, 
    refreshData, 
    exportData 
  } = useAnalytics()
  
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState('overview')
  const [isExporting, setIsExporting] = useState(false)

  const handleRefresh = async () => {
    try {
      await refreshData()
      addNotification({
        type: 'success',
        title: 'Analytics Refreshed',
        message: 'Your analytics data has been updated successfully.'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Refresh Failed',
        message: 'Failed to refresh analytics data. Please try again.'
      })
    }
  }

  const handleExport = async (format: 'csv' | 'pdf' | 'json') => {
    setIsExporting(true)
    try {
      await exportData(format)
      addNotification({
        type: 'success',
        title: 'Export Started',
        message: `Your analytics data is being exported as ${format.toUpperCase()}.`
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export Failed',
        message: `Failed to export data as ${format.toUpperCase()}. Please try again.`
      })
    } finally {
      setIsExporting(false)
    }
  }

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

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer>
      <div className="max-w-7xl mx-auto py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center gap-3 mb-4 lg:mb-0">
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Analytics</h1>
              <p className="text-muted-foreground">Track your performance and growth</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <DownloadIcon className="h-4 w-4" />
                  Export
                </Button>
                
                {/* Export Dropdown */}
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover:block">
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-t-lg"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-b-lg"
                  >
                    Export as JSON
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Views</span>
              </div>
              <div className="text-xl font-bold">{formatNumber(data.overview.totalViews)}</div>
              <div className="text-xs text-green-600">+12.5%</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Downloads</span>
              </div>
              <div className="text-xl font-bold">{formatNumber(data.overview.totalDownloads)}</div>
              <div className="text-xs text-green-600">+8.3%</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <div className="text-xl font-bold">{formatCurrency(data.overview.totalRevenue)}</div>
              <div className="text-xs text-green-600">+15.2%</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="text-sm text-gray-600">Followers</span>
              </div>
              <div className="text-xl font-bold">{formatNumber(data.overview.totalFollowers)}</div>
              <div className="text-xs text-green-600">+5.7%</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Rating</span>
              </div>
              <div className="text-xl font-bold">{data.overview.averageRating.toFixed(1)}</div>
              <div className="text-xs text-green-600">+0.2</div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Engagement</span>
              </div>
              <div className="text-xl font-bold">{data.overview.engagementRate.toFixed(1)}%</div>
              <div className="text-xs text-green-600">+2.1%</div>
            </div>
          </div>
        )}

        {/* Main Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AnalyticsOverview />
            
            {/* Quick Insights */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Insights
                  </CardTitle>
                  <CardDescription>Important trends and patterns in your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Top Performing Content</h4>
                      <p className="text-sm text-blue-700">
                        Your video content is generating 3x more engagement than images
                      </p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Revenue Growth</h4>
                      <p className="text-sm text-green-700">
                        Subscription revenue increased by 23% this month
                      </p>
                    </div>
                    
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Audience Growth</h4>
                      <p className="text-sm text-purple-700">
                        25-34 age group shows highest engagement rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentAnalytics />
            
            {/* Content Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Content Performance Over Time
                </CardTitle>
                <CardDescription>Views and downloads trends for your content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Performance chart visualization</p>
                    <p className="text-sm text-gray-400">Interactive charts would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <AudienceAnalytics />
            
            {/* Engagement Trends */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Engagement Trends
                  </CardTitle>
                  <CardDescription>Daily engagement metrics over the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Engagement trends visualization</p>
                      <p className="text-sm text-gray-400">Line chart showing daily engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <RevenueAnalytics />
            
            {/* Revenue Trends */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Revenue Trends
                  </CardTitle>
                  <CardDescription>Monthly revenue and growth rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Revenue trends visualization</p>
                      <p className="text-sm text-gray-400">Area chart showing monthly revenue</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceAnalytics />
            
            {/* System Health */}
            {data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Health
                  </CardTitle>
                  <CardDescription>Overall system performance and reliability metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Server Response Time</span>
                        <Badge variant="outline" className="text-green-600">
                          {data.performance.loadTime.toFixed(2)}s
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">System Uptime</span>
                        <Badge variant="outline" className="text-green-600">
                          {data.performance.uptime.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Error Rate</span>
                        <Badge variant="outline" className="text-yellow-600">
                          {data.performance.errorRate.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <Badge variant="outline" className="text-green-600">
                          {data.performance.conversionRate.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">User Retention</span>
                        <Badge variant="outline" className="text-green-600">
                          {data.performance.retentionRate.toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Last Updated</span>
                        <Badge variant="outline">
                          {new Date().toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}