export interface DownloadRequest {
  generationId: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  downloadUrl: string
}

export interface DownloadResult {
  id: string
  fileName: string
  downloadUrl: string
  expiresAt: Date
  hoursLeft: number
  isExpiringSoon: boolean
  maxDownloads: number
  downloadCount: number
}

export interface DownloadHistoryItem {
  id: string
  fileName: string
  fileSize: number
  expiresAt: Date
  downloadCount: number
  maxDownloads: number
  hoursLeft: number
  isExpiringSoon: boolean
  isExpired: boolean
  createdAt: Date
  generation: {
    id: string
    type: string
    prompt: string
    createdAt: Date
  }
}

export interface DownloadStats {
  totalDownloads: number
  activeDownloads: number
  expiredDownloads: number
  totalStorageUsed: number // in bytes
}