'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
}

export function ResponsiveContainer({ children, className }: ResponsiveContainerProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 768)
      setIsTablet(width >= 768 && width < 1024)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return (
    <div className={cn(
      'w-full',
      isMobile && 'px-2', // Reduced padding for mobile
      isTablet && 'px-4', // Medium padding for tablet
      !isMobile && !isTablet && 'px-4', // Default padding for desktop
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  mobileCols?: 1 | 2
  tabletCols?: 1 | 2 | 3
  desktopCols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
}

export function ResponsiveGrid({ 
  children, 
  className,
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 'md'
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  return (
    <div className={cn(
      'grid',
      `grid-cols-${mobileCols}`,
      `md:grid-cols-${tabletCols}`,
      `lg:grid-cols-${desktopCols}`,
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  variant?: 'heading' | 'subheading' | 'body' | 'caption'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

export function ResponsiveText({ children, className, variant = 'body', weight = 'normal' }: ResponsiveTextProps) {
  const variantClasses = {
    heading: 'text-2xl md:text-3xl lg:text-4xl',
    subheading: 'text-lg md:text-xl lg:text-2xl',
    body: 'text-sm md:text-base',
    caption: 'text-xs md:text-sm'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  return (
    <span className={cn(variantClasses[variant], weightClasses[weight], className)}>
      {children}
    </span>
  )
}

interface ResponsiveButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export function ResponsiveButton({ 
  children, 
  onClick, 
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false
}: ResponsiveButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-md transition-colors duration-200',
        'active:scale-95 touch-manipulation', // Better mobile interaction
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  )
}

interface ResponsiveCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  pressable?: boolean
}

export function ResponsiveCard({ children, className, hover = false, pressable = false }: ResponsiveCardProps) {
  return (
    <div className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      'transition-all duration-200',
      hover && 'hover:shadow-md hover:scale-[1.02]',
      pressable && 'active:scale-[0.98] active:shadow-sm',
      className
    )}>
      {children}
    </div>
  )
}