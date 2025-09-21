'use client'

import { useEffect, useState } from 'react'
import { imageIntegrityService, type ImageValidationResult } from '@/lib/image-integrity'

interface StrictImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  loading?: 'lazy' | 'eager'
  context?: string
  onImageError?: (error: string) => void
  onImageValid?: (result: ImageValidationResult) => void
  showValidationStatus?: boolean
}

export default function StrictImage({
  src,
  alt,
  className = '',
  width,
  height,
  loading = 'lazy',
  context = 'Unknown',
  onImageError,
  onImageValid,
  showValidationStatus = false
}: StrictImageProps) {
  const [imageState, setImageState] = useState<'loading' | 'valid' | 'error'>('loading')
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null)
  const [errorDetails, setErrorDetails] = useState<string>('')

  useEffect(() => {
    const validateImage = async () => {
      try {
        setImageState('loading')
        setErrorDetails('')

        // Validate image integrity before attempting to load
        const result = await imageIntegrityService.validateImage(src)
        setValidationResult(result)

        if (!result.isValid) {
          const errorMessage = `Image validation failed: ${result.error}`
          setErrorDetails(errorMessage)
          setImageState('error')
          onImageError?.(errorMessage)
          return
        }

        // Ensure image exists and is accessible
        await imageIntegrityService.ensureImageExists(src, context)
        
        setImageState('valid')
        onImageValid?.(result)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown image validation error'
        setErrorDetails(errorMessage)
        setImageState('error')
        onImageError?.(errorMessage)
      }
    }

    validateImage()
  }, [src, context, onImageError, onImageValid])

  const handleImageError = () => {
    const errorMessage = `Failed to load image: ${src}`
    setErrorDetails(errorMessage)
    setImageState('error')
    onImageError?.(errorMessage)
  }

  const handleImageLoad = () => {
    if (imageState === 'loading') {
      setImageState('valid')
    }
  }

  // If image is not valid, show nothing (no fallbacks allowed)
  if (imageState === 'error') {
    if (showValidationStatus) {
      return (
        <div className={`border-2 border-red-500 bg-red-50 p-4 text-center ${className}`} style={{ width, height }}>
          <div className="text-red-600 font-semibold">IMAGE UNAVAILABLE</div>
          <div className="text-red-500 text-sm mt-1">Strict validation failed</div>
          {errorDetails && (
            <div className="text-red-400 text-xs mt-2 font-mono">{errorDetails}</div>
          )}
        </div>
      )
    }
    
    // Return null to show nothing - no fallbacks allowed
    return null
  }

  // While loading, show a minimal loading indicator
  if (imageState === 'loading') {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ width, height }}>
        <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // Image is valid, render it normally
  return (
    <>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} transition-opacity duration-300`}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ width, height }}
      />
      
      {showValidationStatus && validationResult && (
        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded opacity-75">
          ✓ Valid
        </div>
      )}
    </>
  )
}