'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { useResponsive } from '@/hooks/use-responsive'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  center?: boolean
  fluid?: boolean
  as?: React.ElementType
}

export function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'xl',
  center = true,
  fluid = false,
  as: Component = 'div',
  ...props
}: ResponsiveContainerProps) {
  const { getValue } = useResponsive()

  const containerClasses = cn(
    'w-full',
    {
      'mx-auto': center && !fluid,
      'px-4': !fluid, // Default padding
      'px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8': fluid, // Progressive padding for fluid
    },
    className
  )

  const maxWidthClasses = cn({
    'max-w-xs': maxWidth === 'xs',
    'max-w-sm': maxWidth === 'sm',
    'max-w-md': maxWidth === 'md',
    'max-w-lg': maxWidth === 'lg',
    'max-w-xl': maxWidth === 'xl',
    'max-w-2xl': maxWidth === '2xl',
    'max-w-full': maxWidth === 'full',
  })

  const style = fluid ? {} : { maxWidth: getValue({
    xs: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }, '100%') as React.CSSProperties }

  return (
    <Component className={cn(containerClasses, maxWidthClasses)} style={style} {...props}>
      {children}
    </Component>
  )
}

interface ResponsiveGridProps {
  children: React.ReactNode
  className?: string
  cols?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', number>>
  gap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  as?: React.ElementType
}

export function ResponsiveGrid({
  children,
  className = '',
  cols = { xs: 1, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 },
  gap = { xs: '2', sm: '4', md: '6', lg: '8', xl: '12', '2xl': '16' },
  as: Component = 'div',
  ...props
}: ResponsiveGridProps) {
  const { getValue } = useResponsive()

  const gridClasses = cn(
    'grid',
    getValue({
      xs: `grid-cols-${cols.xs || 1}`,
      sm: `sm:grid-cols-${cols.sm || 2}`,
      md: `md:grid-cols-${cols.md || 3}`,
      lg: `lg:grid-cols-${cols.lg || 4}`,
      xl: `xl:grid-cols-${cols.xl || 5}`,
      '2xl': `2xl:grid-cols-${cols['2xl'] || 6}`,
    }, 'grid-cols-1'),
    getValue({
      xs: `gap-${gap.xs || 2}`,
      sm: `sm:gap-${gap.sm || 4}`,
      md: `md:gap-${gap.md || 6}`,
      lg: `lg:gap-${gap.lg || 8}`,
      xl: `xl:gap-${gap.xl || 12}`,
      '2xl': `2xl:gap-${gap['2xl'] || 16}`,
    }, 'gap-4'),
    className
  )

  return (
    <Component className={gridClasses} {...props}>
      {children}
    </Component>
  )
}

interface ResponsiveFlexProps {
  children: React.ReactNode
  className?: string
  direction?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'row' | 'col' | 'row-reverse' | 'col-reverse'>>
  wrap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', boolean>>
  justify?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>>
  align?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'start' | 'end' | 'center' | 'baseline' | 'stretch'>>
  gap?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  as?: React.ElementType
}

export function ResponsiveFlex({
  children,
  className = '',
  direction = { xs: 'row', sm: 'row' },
  wrap = { xs: true, sm: true },
  justify = { xs: 'start', sm: 'start' },
  align = { xs: 'start', sm: 'start' },
  gap = { xs: '2', sm: '4' },
  as: Component = 'div',
  ...props
}: ResponsiveFlexProps) {
  const { getValue } = useResponsive()

  const flexClasses = cn(
    'flex',
    getValue({
      xs: `flex-${direction.xs || 'row'}`,
      sm: `sm:flex-${direction.sm || 'row'}`,
      md: `md:flex-${direction.md || 'row'}`,
      lg: `lg:flex-${direction.lg || 'row'}`,
      xl: `xl:flex-${direction.xl || 'row'}`,
      '2xl': `2xl:flex-${direction['2xl'] || 'row'}`,
    }, 'flex-row'),
    {
      'flex-wrap': getValue(wrap, true),
      'flex-nowrap': !getValue(wrap, true),
    },
    getValue({
      xs: `justify-${justify.xs || 'start'}`,
      sm: `sm:justify-${justify.sm || 'start'}`,
      md: `md:justify-${justify.md || 'start'}`,
      lg: `lg:justify-${justify.lg || 'start'}`,
      xl: `xl:justify-${justify.xl || 'start'}`,
      '2xl': `2xl:justify-${justify['2xl'] || 'start'}`,
    }, 'justify-start'),
    getValue({
      xs: `items-${align.xs || 'start'}`,
      sm: `sm:items-${align.sm || 'start'}`,
      md: `md:items-${align.md || 'start'}`,
      lg: `lg:items-${align.lg || 'start'}`,
      xl: `xl:items-${align.xl || 'start'}`,
      '2xl': `2xl:items-${align['2xl'] || 'start'}`,
    }, 'items-start'),
    getValue({
      xs: `gap-${gap.xs || 2}`,
      sm: `sm:gap-${gap.sm || 4}`,
      md: `md:gap-${gap.md || 6}`,
      lg: `lg:gap-${gap.lg || 8}`,
      xl: `xl:gap-${gap.xl || 12}`,
      '2xl': `2xl:gap-${gap['2xl'] || 16}`,
    }, 'gap-4'),
    className
  )

  return (
    <Component className={flexClasses} {...props}>
      {children}
    </Component>
  )
}

interface ResponsiveTextProps {
  children: React.ReactNode
  className?: string
  size?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  weight?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'normal' | 'medium' | 'semibold' | 'bold'>>
  align?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', 'left' | 'center' | 'right' | 'justify'>>
  as?: React.ElementType
}

export function ResponsiveText({
  children,
  className = '',
  size = { xs: 'sm', sm: 'base', md: 'lg', lg: 'xl', xl: '2xl', '2xl': '3xl' },
  weight = { xs: 'normal', sm: 'normal' },
  align = { xs: 'left', sm: 'left' },
  as: Component = 'p',
  ...props
}: ResponsiveTextProps) {
  const { getValue } = useResponsive()

  const textClasses = cn(
    getValue({
      xs: `text-${size.xs || 'sm'}`,
      sm: `sm:text-${size.sm || 'base'}`,
      md: `md:text-${size.md || 'lg'}`,
      lg: `lg:text-${size.lg || 'xl'}`,
      xl: `xl:text-${size.xl || '2xl'}`,
      '2xl': `2xl:text-${size['2xl'] || '3xl'}`,
    }, 'text-base'),
    getValue({
      xs: `font-${weight.xs || 'normal'}`,
      sm: `sm:font-${weight.sm || 'normal'}`,
      md: `md:font-${weight.md || 'normal'}`,
      lg: `lg:font-${weight.lg || 'normal'}`,
      xl: `xl:font-${weight.xl || 'normal'}`,
      '2xl': `2xl:font-${weight['2xl'] || 'normal'}`,
    }, 'font-normal'),
    getValue({
      xs: `text-${align.xs || 'left'}`,
      sm: `sm:text-${align.sm || 'left'}`,
      md: `md:text-${align.md || 'left'}`,
      lg: `lg:text-${align.lg || 'left'}`,
      xl: `xl:text-${align.xl || 'left'}`,
      '2xl': `2xl:text-${align['2xl'] || 'left'}`,
    }, 'text-left'),
    className
  )

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  )
}

interface ResponsiveSpacingProps {
  children: React.ReactNode
  className?: string
  padding?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  margin?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>
  as?: React.ElementType
}

export function ResponsiveSpacing({
  children,
  className = '',
  padding = { xs: '4', sm: '6', md: '8', lg: '12', xl: '16', '2xl': '20' },
  margin = { xs: '0', sm: '0', md: '0', lg: '0', xl: '0', '2xl': '0' },
  as: Component = 'div',
  ...props
}: ResponsiveSpacingProps) {
  const { getValue } = useResponsive()

  const spacingClasses = cn(
    getValue({
      xs: `p-${padding.xs || 4}`,
      sm: `sm:p-${padding.sm || 6}`,
      md: `md:p-${padding.md || 8}`,
      lg: `lg:p-${padding.lg || 12}`,
      xl: `xl:p-${padding.xl || 16}`,
      '2xl': `2xl:p-${padding['2xl'] || 20}`,
    }, 'p-4'),
    getValue({
      xs: `m-${margin.xs || 0}`,
      sm: `sm:m-${margin.sm || 0}`,
      md: `md:m-${margin.md || 0}`,
      lg: `lg:m-${margin.lg || 0}`,
      xl: `xl:m-${margin.xl || 0}`,
      '2xl': `2xl:m-${margin['2xl'] || 0}`,
    }, 'm-0'),
    className
  )

  return (
    <Component className={spacingClasses} {...props}>
      {children}
    </Component>
  )
}