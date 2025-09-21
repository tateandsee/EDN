'use client'

import { useState, useEffect } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('lg')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      let currentBreakpoint: Breakpoint = 'xs'

      for (const [key, value] of Object.entries(breakpoints)) {
        if (width >= value) {
          currentBreakpoint = key as Breakpoint
        }
      }

      setBreakpoint(currentBreakpoint)
    }

    // Set initial breakpoint
    updateBreakpoint()

    // Add event listener
    window.addEventListener('resize', updateBreakpoint)
    
    // Cleanup
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Add event listener
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    
    // Cleanup
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}

// Common media query hooks
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1025px)')
}

export function useIsLargeDesktop(): boolean {
  return useMediaQuery('(min-width: 1280px)')
}

// Responsive value utilities
export function getResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  currentBreakpoint: Breakpoint,
  defaultValue: T
): T {
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
  const currentIndex = breakpointOrder.indexOf(currentBreakpoint)
  
  // Find the largest breakpoint that has a value and is <= current breakpoint
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i]
    if (values[bp] !== undefined) {
      return values[bp]!
    }
  }
  
  return defaultValue
}

// Responsive spacing utilities
export const responsiveSpacing = {
  padding: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  margin: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
  gap: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    '2xl': '4rem',
  },
}

// Responsive font sizes
export const responsiveFontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  md: '1rem',       // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
}

// Responsive container widths
export const responsiveContainer = {
  xs: '100%',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

// Responsive grid columns
export const responsiveGrid = {
  cols: {
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
    xl: 5,
    '2xl': 6,
  },
}

// Hook for responsive values
export function useResponsiveValue<T>(
  values: Partial<Record<Breakpoint, T>>,
  defaultValue: T
): T {
  const breakpoint = useBreakpoint()
  return getResponsiveValue(values, breakpoint, defaultValue)
}

// Hook for responsive container
export function useResponsiveContainer() {
  return useResponsiveValue(responsiveContainer, '100%')
}

// Hook for responsive grid
export function useResponsiveGrid() {
  return useResponsiveValue(responsiveGrid.cols, 1)
}

// Touch device detection
export function useIsTouchDevice(): boolean {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      )
    }

    checkTouch()
  }, [])

  return isTouch
}

// Screen orientation hook
export function useScreenOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// Responsive image utilities
export function getResponsiveImageSrc(
  baseUrl: string,
  breakpoint: Breakpoint,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string {
  const sizeMap = {
    xs: '320',
    sm: '640',
    md: '768',
    lg: '1024',
    xl: '1280',
    '2xl': '1536',
  }

  return `${baseUrl}-${sizeMap[breakpoint]}.${format}`
}

// Performance optimized responsive hook
export function useResponsive() {
  const breakpoint = useBreakpoint()
  const isMobile = useIsMobile()
  const isTablet = useIsTablet()
  const isDesktop = useIsDesktop()
  const isLargeDesktop = useIsLargeDesktop()
  const isTouch = useIsTouchDevice()
  const orientation = useScreenOrientation()

  return {
    breakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isTouch,
    orientation,
    // Utility functions
    getValue: <T>(values: Partial<Record<Breakpoint, T>>, defaultValue: T) =>
      getResponsiveValue(values, breakpoint, defaultValue),
    getContainer: () => getResponsiveValue(responsiveContainer, breakpoint, '100%'),
    getGridCols: () => getResponsiveValue(responsiveGrid.cols, breakpoint, 1),
    getImageSrc: (baseUrl: string, format?: 'webp' | 'jpg' | 'png') =>
      getResponsiveImageSrc(baseUrl, breakpoint, format),
  }
}