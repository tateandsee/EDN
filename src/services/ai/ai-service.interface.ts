export interface AiGenerationRequest {
  prompt: string
  negativePrompt?: string
  settings: AiGenerationSettings
  type: 'image' | 'video' | 'text'
  isNSFW: boolean
}

export interface AiGenerationSettings {
  hair: string
  skin: string
  clothing: string
  pose: string
  background: string
  lighting: string
  style: string
  faceCloning?: boolean
  voiceIntegration?: boolean
  virtualTryOn?: boolean
}

export interface AiGenerationResult {
  id: string
  type: string
  prompt: string
  result: string
  status: 'completed' | 'failed' | 'processing'
  creditsUsed: number
  isNSFW: boolean
  createdAt: Date
  completedAt?: Date
  error?: string
}

export interface AiModelDownload {
  id: string
  fileName: string
  filePath: string
  fileSize: number
  mimeType: string
  downloadUrl: string
  expiresAt: Date
  isExpired: boolean
  isDeleted: boolean
  downloadCount: number
  maxDownloads: number
  hoursLeft: number
  isExpiringSoon: boolean
  createdAt: Date
}