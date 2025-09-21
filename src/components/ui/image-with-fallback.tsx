'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'

interface ImageWithFallbackProps {
  src?: string
  alt: string
  className?: string
  fallbackClassName?: string
  width?: number
  height?: number
  fallback?: React.ReactNode
  showFallbackText?: boolean
  fallbackText?: string
  retryCount?: number
  loading?: 'lazy' | 'eager'
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackClassName = '',
  width,
  height,
  fallback,
  showFallbackText = true,
  fallbackText = 'Image Not Available',
  retryCount = 2,
  loading = 'lazy'
}: ImageWithFallbackProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [currentRetry, setCurrentRetry] = useState(0)

  // Get the best image URL
  const getImageUrl = () => {
    if (!src) return null
    
    // If it's a base64 data URL, return it as-is
    if (src.startsWith('data:')) {
      return src
    }
    
    // If it's a relative URL without leading slash, add it
    if (!src.startsWith('http') && !src.startsWith('/')) {
      return `/${src}`
    }
    
    return src
  }

  const imageUrl = getImageUrl()

  // Handle image load error with retry logic
  const handleImageError = () => {
    if (currentRetry < retryCount) {
      // Retry loading the image
      setCurrentRetry(prev => prev + 1)
      setImageLoaded(false)
      // Force re-render by changing the key
      setTimeout(() => {
        const img = document.querySelector(`#img-${alt.replace(/\s+/g, '-')}`) as HTMLImageElement
        if (img && imageUrl) {
          img.src = imageUrl + (imageUrl.includes('?') ? '&' : '?') + `retry=${currentRetry + 1}`
        }
      }, 1000)
    } else {
      setImageError(true)
      setImageLoaded(false)
    }
  }

  // Handle successful image load
  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  // Default fallback component
  const defaultFallback = (
    <div className={`flex flex-col items-center justify-center ${fallbackClassName}`}>
      <ImageOff className="w-8 h-8 mb-2 text-gray-400" />
      {showFallbackText && (
        <div className="text-center">
          <div className="text-sm font-medium text-gray-500 mb-1">
            {fallbackText}
          </div>
          {alt && (
            <div className="text-xs text-gray-400 max-w-full truncate">
              {alt}
            </div>
          )}
        </div>
      )}
    </div>
  )

  // If no image source or error after retries, show fallback
  if (!imageUrl || imageError) {
    return fallback || defaultFallback
  }

  return (
    <div className="relative" style={{ width, height }}>
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded">
          <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image */}
      <img
        id={`img-${alt.replace(/\s+/g, '-')}`}
        key={`img-${alt.replace(/\s+/g, '-')}-${currentRetry}`}
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading={loading}
        style={{ width, height }}
      />
    </div>
  )
}