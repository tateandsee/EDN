export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly context?: Record<string, any>

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.context = context
    
    // Maintains proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 400, true, context)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required', context?: Record<string, any>) {
    super(message, 401, true, context)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions', context?: Record<string, any>) {
    super(message, 403, true, context)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', context?: Record<string, any>) {
    super(message, 404, true, context)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 409, true, context)
    this.name = 'ConflictError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests', context?: Record<string, any>) {
    super(message, 429, true, context)
    this.name = 'RateLimitError'
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message: string,
    public readonly service: string,
    context?: Record<string, any>
  ) {
    super(message, 502, true, { ...context, service })
    this.name = 'ExternalServiceError'
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, context?: Record<string, any>) {
    super(message, 503, true, context)
    this.name = 'DatabaseError'
  }
}

// Error handling utilities
export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const getErrorStatus = (error: unknown): number => {
  if (isAppError(error)) {
    return error.statusCode
  }
  return 500
}

export const getErrorMessage = (error: unknown): string => {
  if (isAppError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}

export const getErrorContext = (error: unknown): Record<string, any> | undefined => {
  if (isAppError(error)) {
    return error.context
  }
  return undefined
}

// Error logging utility
export const logError = (error: unknown, context?: Record<string, any>) => {
  const errorMessage = getErrorMessage(error)
  const errorStatus = getErrorStatus(error)
  const errorContext = getErrorContext(error)
  
  console.error('Error occurred:', {
    message: errorMessage,
    status: errorStatus,
    context: { ...errorContext, ...context },
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  })

  // Here you could send the error to an external logging service
  // Example: Sentry, LogRocket, custom webhook, etc.
}

// Error response formatter for API routes
export const formatErrorResponse = (error: unknown) => {
  const message = getErrorMessage(error)
  const status = getErrorStatus(error)
  const context = getErrorContext(error)
  
  return {
    error: {
      message,
      status,
      context: process.env.NODE_ENV === 'development' ? context : undefined
    }
  }
}

// Async error wrapper for API routes
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args)
    } catch (error) {
      logError(error)
      throw error // Re-throw to be handled by the route handler
    }
  }
}

// React hook for error handling
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: unknown) => {
    const appError = isAppError(error) 
      ? error 
      : new AppError(getErrorMessage(error))
    
    setError(appError)
    logError(appError)
    
    // Optionally show a toast notification
    // toast.error(appError.message)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, handleError, clearError }
}

// Error boundary component hook
export const useErrorBoundary = () => {
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setError(event.error)
      logError(event.error)
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setError(new Error(event.reason))
      logError(event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  return { error, resetError }
}