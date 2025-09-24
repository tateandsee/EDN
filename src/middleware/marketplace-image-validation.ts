import { NextRequest, NextResponse } from 'next/server'
import { marketplaceImageValidator } from '@/lib/marketplace-image-validator'

export async function marketplaceImageValidation(request: NextRequest) {
  // Only validate marketplace-related requests
  if (!request.nextUrl.pathname.startsWith('/api/marketplace')) {
    return NextResponse.next()
  }
  
  // Validate marketplace item creation/update
  if (request.method === 'POST' && request.nextUrl.pathname === '/api/marketplace/items') {
    try {
      const body = await request.clone().json()
      
      // Validate images
      const validation = await marketplaceImageValidator.validateMarketplaceItem({
        thumbnail: body.thumbnail,
        images: body.images
      })
      
      if (!validation.isValid) {
        return NextResponse.json(
          { 
            error: 'Image validation failed',
            details: validation.errors 
          },
          { status: 400 }
        )
      }
      
      // Add validation info to request headers for processing
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-image-validation', 'passed')
      requestHeaders.set('x-image-warnings', JSON.stringify(validation.warnings))
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        }
      })
      
    } catch (error) {
      // If we can't parse the body, let it continue to the normal error handling
      console.error('Middleware validation error:', error)
      return NextResponse.next()
    }
  }
  
  return NextResponse.next()
}

export default marketplaceImageValidation