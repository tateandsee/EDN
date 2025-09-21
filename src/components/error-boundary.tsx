'use client'

import React from 'react'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; errorInfo: React.ErrorInfo; retry: () => void }>
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    
    // Here you could send the error to an error tracking service
    // this.logErrorToService(error, errorInfo)
  }

  retry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error!} 
          errorInfo={this.state.errorInfo!} 
          retry={this.retry}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, errorInfo, retry }: { 
  error: Error; 
  errorInfo: React.ErrorInfo; 
  retry: () => void 
}) {
  const isDev = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-cyan-50 to-yellow-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl text-red-900">Oops! Something went wrong</CardTitle>
          <CardDescription className="text-red-700">
            We're sorry, but something unexpected happened. Our team has been notified.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={retry} 
              className="w-full"
              variant="outline"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </div>
          
          <div className="text-center">
            <Button 
              variant="link" 
              onClick={() => window.location.href = '/support'}
              className="text-sm text-red-600 hover:text-red-800"
            >
              <Mail className="mr-1 h-3 w-3" />
              Contact Support
            </Button>
          </div>

          {isDev && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">Error Details (Dev Mode)</summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 p-2 bg-red-50 rounded text-xs overflow-x-auto">
                      {error.message}
                    </pre>
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 p-2 bg-red-50 rounded text-xs overflow-x-auto">
                      {error.stack}
                    </pre>
                  </div>
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 p-2 bg-red-50 rounded text-xs overflow-x-auto">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorBoundary