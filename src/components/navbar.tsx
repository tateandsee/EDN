'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { useNotificationContext } from '@/contexts/notification-context'
import { 
  Home, 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogIn, 
  Sparkles, 
  Star, 
  Bell,
  Settings as SettingsIcon
} from 'lucide-react'

export default function Navbar() {
  const { isNSFW, setIsNSFW } = useNSFW()
  const { user } = useAuth()
  const { unreadCount } = useNotificationContext()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3">
            <div className="relative">
              {/* Logo Image */}
              <img 
                src="/logo.svg" 
                alt="EDN Logo" 
                className="h-8 w-8 md:h-10 md:w-10"
              />
              {/* Logo Text */}
              <div className="hidden md:block ml-3">
                <div className="text-xl md:text-2xl font-bold">
                  <span className="text-amber-500">E</span><span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">DN</span>
                </div>
                <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 opacity-50"></div>
              </div>
            </div>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
              Dashboard
            </Link>
            <Link
              href="/marketplace"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Store className="inline-block w-4 h-4 mr-2" />
              Marketplace
            </Link>
            <Link
              href="/showcase"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Star className="inline-block w-4 h-4 mr-2" />
              Showcase
            </Link>
            {user && (
              <Link
                href="/create"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                <Settings className="inline-block w-4 h-4 mr-2" />
                Create
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile menu button would go here */}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="sfw-toggle" className="text-sm font-medium">
                SFW
              </Label>
              <Switch
                id="sfw-toggle"
                checked={!isNSFW}
                onCheckedChange={(checked) => setIsNSFW(!checked)}
              />
              <Label htmlFor="sfw-toggle" className="text-sm font-medium">
                NSFW
              </Label>
            </div>
            
            {/* Notification Bell for logged-in users */}
            {user && (
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs min-w-5"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
            )}
            
            <nav className="flex items-center gap-2">
              {!user && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/signin">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )}
              {user && (
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
              )}
              <Button size="sm" asChild>
                <Link href={user ? "/dashboard" : "/auth/signin"}>
                  {user ? "Dashboard" : "Get Started"}
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </nav>
  )
}