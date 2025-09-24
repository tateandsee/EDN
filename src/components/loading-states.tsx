'use client'

import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'primary' | 'secondary'
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  className = '',
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const variantClasses = {
    default: 'text-gray-600',
    primary: 'text-primary',
    secondary: 'text-secondary'
  }

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant]
      )} />
      {text && (
        <span className={cn('ml-2 text-sm', variantClasses[variant])}>
          {text}
        </span>
      )}
    </div>
  )
}

interface LoadingCardProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingCard({ title = 'Loading...', description, className = '' }: LoadingCardProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          {description && (
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface LoadingPageProps {
  message?: string
  submessage?: string
  variant?: 'default' | 'hero' | 'minimal'
}

export function LoadingPage({ 
  message = 'Loading EDN Platform...', 
  submessage,
  variant = 'default' 
}: LoadingPageProps) {
  if (variant === 'minimal') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text={message} />
      </div>
    )
  }

  if (variant === 'hero') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-200 via-cyan-200 to-yellow-200 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 mx-auto relative">
              <Sparkles className="absolute inset-0 w-full h-full text-primary animate-pulse" />
              <LoadingSpinner size="xl" variant="primary" />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {message}
          </h1>
          {submessage && (
            <p className="text-gray-600 text-lg">{submessage}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <LoadingSpinner size="xl" />
        <h1 className="text-xl font-semibold text-gray-800 mt-4 mb-2">
          {message}
        </h1>
        {submessage && (
          <p className="text-gray-600">{submessage}</p>
        )}
      </div>
    </div>
  )
}

interface LoadingSkeletonProps {
  lines?: number
  className?: string
}

export function LoadingSkeleton({ lines = 3, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          {i === lines - 1 && <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>}
        </div>
      ))}
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  message?: string
  children: React.ReactNode
}

export function LoadingOverlay({ isLoading, message = 'Loading...', children }: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-sm text-gray-600">{message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for loading states
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = React.useState(initialState)
  const [error, setError] = React.useState<string | null>(null)

  const withLoading = async <T,>(
    fn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await fn()
      return result
    } catch (err) {
      const message = errorMessage || (err instanceof Error ? err.message : 'An error occurred')
      setError(message)
      console.error('Loading error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setError,
    setIsLoading,
    withLoading
  }
}