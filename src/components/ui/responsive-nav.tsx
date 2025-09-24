'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Menu, X, Bell, Search, User, Home, Settings, LogOut } from 'lucide-react'

interface MobileNavProps {
  children?: React.ReactNode
}

export function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const advancedNavItems = [
    { icon: Search, label: 'Advanced AI', href: '/advanced-ai' },
    { icon: User, label: 'Social', href: '/social' },
    { icon: Bell, label: 'Marketing', href: '/marketing' },
    { icon: Settings, label: 'Security', href: '/security' },
  ]

  return (
    <>
      {/* Mobile Navigation Bar */}
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        'border-b border-border',
        isScrolled && 'shadow-sm'
      )}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EDN</span>
            </div>
            <span className="font-semibold text-lg">EDN AI</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-2">
              <Bell className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">EDN</span>
                  </div>
                  <span className="font-semibold text-lg">EDN AI</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Main
                  </div>
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => {
                        window.location.href = item.href
                        setIsOpen(false)
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                  
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-4">
                    Advanced Features
                  </div>
                  {advancedNavItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start gap-3 h-12"
                      onClick={() => {
                        window.location.href = item.href
                        setIsOpen(false)
                      }}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>

                {/* User Section */}
                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">John Doe</div>
                      <div className="text-sm text-muted-foreground">Premium Member</div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3"
                    onClick={() => {
                      // Handle logout
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.slice(0, 5).map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="flex-col h-auto py-2 px-1 gap-1"
              onClick={() => window.location.href = item.href}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Spacer for mobile navigation */}
      <div className="h-16 md:hidden" />
    </>
  )
}

interface DesktopNavProps {
  children?: React.ReactNode
}

export function DesktopNav({ children }: DesktopNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Create', href: '/create' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Profile', href: '/profile' },
  ]

  const advancedNavItems = [
    { label: 'Advanced AI', href: '/advanced-ai' },
    { label: 'Social', href: '/social' },
    { label: 'Marketing', href: '/marketing' },
    { label: 'Security', href: '/security' },
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      'border-b border-border',
      isScrolled && 'shadow-sm'
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">EDN</span>
            </div>
            <span className="font-semibold text-lg">EDN AI</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.label}
              </a>
            ))}
            
            {/* Advanced Features Dropdown */}
            <div className="relative group">
              <button className="text-foreground hover:text-primary transition-colors duration-200 font-medium flex items-center gap-1">
                Advanced
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {advancedNavItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

interface ResponsiveNavigationProps {
  children?: React.ReactNode
}

export function ResponsiveNavigation({ children }: ResponsiveNavigationProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  return isMobile ? <MobileNav>{children}</MobileNav> : <DesktopNav>{children}</DesktopNav>
}