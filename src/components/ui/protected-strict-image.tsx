'use client'

import { useState } from 'react'
import { ImageProtection } from '@/components/image-protection'
import StrictImage from './strict-image'
import type { ImageValidationResult } from '@/lib/image-integrity'

interface ProtectedStrictImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  context?: string
  protectionOptions?: {
    disableRightClick?: boolean
    disableDrag?: boolean
    disableContextMenu?: boolean
    showWatermark?: boolean
    watermarkText?: string
  }
  onImageError?: (error: string) => void
  onImageValid?: (result: ImageValidationResult) => void
  showValidationStatus?: boolean
}

export default function ProtectedStrictImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  context = 'Unknown',
  protectionOptions = {},
  onImageError,
  onImageValid,
  showValidationStatus = false
}: ProtectedStrictImageProps) {
  const [imageKey, setImageKey] = useState(0)
  const [retryCount, setRetryCount] = useState(0)

  const handleImageError = (error: string) => {
    console.error(`Protected image error for ${context}:`, error)
    onImageError?.(error)
    
    // Implement retry logic with limited attempts
    if (retryCount < 2) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1)
        setImageKey(prev => prev + 1) // Force re-render
      }, 1000 * (retryCount + 1)) // Exponential backoff
    }
  }

  const handleImageValid = (result: ImageValidationResult) => {
    // Reset retry count on successful validation
    setRetryCount(0)
    onImageValid?.(result)
  }

  return (
    <ImageProtection
      disableRightClick={protectionOptions.disableRightClick ?? true}
      disableDrag={protectionOptions.disableDrag ?? true}
      disableContextMenu={protectionOptions.disableContextMenu ?? true}
      showWatermark={protectionOptions.showWatermark ?? true}
      watermarkText={protectionOptions.watermarkText ?? 'EDN Protected'}
      className={className}
    >
      <StrictImage
        key={`${src}-${imageKey}-${retryCount}`}
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        width={width}
        height={height}
        loading={loading}
        context={context}
        onImageError={handleImageError}
        onImageValid={handleImageValid}
        showValidationStatus={showValidationStatus}
      />
    </ImageProtection>
  )
}