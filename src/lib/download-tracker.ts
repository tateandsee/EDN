import { createClient } from '@/lib/supabase-client'

export interface DownloadRecord {
  id?: string
  user_id: string
  content_id?: string
  marketplace_item_id?: string
  download_type: 'content' | 'marketplace_item'
  file_url: string
  file_size?: number
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

export class DownloadTracker {
  private supabase = createClient()

  async trackDownload(downloadData: Omit<DownloadRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DownloadRecord | null> {
    try {
      // Get client IP address and user agent if available
      const clientData = this.getClientData()

      const downloadRecord: DownloadRecord = {
        ...downloadData,
        ...clientData
      }

      const { data, error } = await this.supabase
        .from('downloads')
        .insert(downloadRecord)
        .select()
        .single()

      if (error) {
        console.error('Error tracking download:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected error tracking download:', error)
      return null
    }
  }

  async getUserDownloads(userId: string, limit: number = 50): Promise<DownloadRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('downloads')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching user downloads:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching user downloads:', error)
      return []
    }
  }

  async getContentDownloads(contentId: string): Promise<DownloadRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('downloads')
        .select('*')
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching content downloads:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching content downloads:', error)
      return []
    }
  }

  async getMarketplaceItemDownloads(marketplaceItemId: string): Promise<DownloadRecord[]> {
    try {
      const { data, error } = await this.supabase
        .from('downloads')
        .select('*')
        .eq('marketplace_item_id', marketplaceItemId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching marketplace item downloads:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Unexpected error fetching marketplace item downloads:', error)
      return []
    }
  }

  async getDownloadStats(userId: string): Promise<{
    totalDownloads: number
    contentDownloads: number
    marketplaceDownloads: number
    recentDownloads: DownloadRecord[]
  }> {
    try {
      const { data, error } = await this.supabase
        .from('downloads')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching download stats:', error)
        return {
          totalDownloads: 0,
          contentDownloads: 0,
          marketplaceDownloads: 0,
          recentDownloads: []
        }
      }

      const downloads = data || []
      const contentDownloads = downloads.filter(d => d.download_type === 'content').length
      const marketplaceDownloads = downloads.filter(d => d.download_type === 'marketplace_item').length
      const recentDownloads = downloads.slice(0, 10)

      return {
        totalDownloads: downloads.length,
        contentDownloads,
        marketplaceDownloads,
        recentDownloads
      }
    } catch (error) {
      console.error('Unexpected error fetching download stats:', error)
      return {
        totalDownloads: 0,
        contentDownloads: 0,
        marketplaceDownloads: 0,
        recentDownloads: []
      }
    }
  }

  private getClientData(): { ip_address?: string; user_agent?: string } {
    if (typeof window === 'undefined') {
      return {}
    }

    try {
      return {
        // Note: In a real implementation, you'd get the actual IP address from the server
        // For client-side tracking, we'll omit the IP address for privacy reasons
        user_agent: navigator.userAgent
      }
    } catch (error) {
      console.error('Error getting client data:', error)
      return {}
    }
  }
}

export const downloadTracker = new DownloadTracker()