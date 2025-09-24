'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Sparkles, Menu, X, Home, ShoppingBag, Plus, Star, Zap, LogIn, LogOut, User } from 'lucide-react'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isNSFW, setIsNSFW } = useNSFW()
  const { user, loading, signOut } = useAuth()

  const colors = {
    sfw: {
      bg: 'bg-gray-900/95',
      text: 'text-white',
      button: 'bg-gradient-to-r from-orange-500 to-cyan-500 hover:from-orange-600 hover:to-cyan-600',
      toggleSfw: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white',
      toggleNsfw: 'border-cyan-400 text-cyan-300 hover:bg-cyan-800/50',
      loginButton: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white',
      logoutButton: 'border-cyan-400 text-cyan-300 hover:bg-cyan-800/50',
      border: 'border-gray-700',
      hoverBg: 'hover:bg-gray-800',
      hoverText: 'hover:text-orange-400',
      logoGlow: 'shadow-orange-500/25'
    },
    nsfw: {
      bg: 'bg-gray-900/95',
      text: 'text-white',
      button: 'bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700',
      toggleSfw: 'border-pink-400 text-pink-300 hover:bg-pink-800/50',
      toggleNsfw: 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white',
      loginButton: 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white',
      logoutButton: 'border-pink-400 text-pink-300 hover:bg-pink-800/50',
      border: 'border-pink-700',
      hoverBg: 'hover:bg-gray-800',
      hoverText: 'hover:text-pink-300',
      logoGlow: 'shadow-pink-500/25'
    }
  }

  const scheme = colors[isNSFW ? 'nsfw' : 'sfw']

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${scheme.bg} backdrop-blur-md border-b ${scheme.border} transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="EDN Logo" 
              className="h-24 w-auto object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {[
              { href: '/', icon: Home, label: 'Home' },
              { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
              { href: '/showcase', icon: Star, label: 'Showcase' },
              { href: '/create', icon: Plus, label: 'Create' }
            ].map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${scheme.text} ${scheme.hoverBg} ${scheme.hoverText} hover:scale-105 hover:shadow-lg relative overflow-hidden group`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <item.icon className="h-4 w-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>
            ))}
            
            {/* Enhanced Mode Toggle */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant={!isNSFW ? 'default' : 'outline'}
                  onClick={() => setIsNSFW(false)}
                  className={`!rounded-xl ${!isNSFW ? scheme.toggleSfw : scheme.toggleSfw} transition-all duration-300 font-semibold`}
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    SFW
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  variant={isNSFW ? 'default' : 'outline'}
                  onClick={() => setIsNSFW(true)}
                  className={`!rounded-xl ${isNSFW ? scheme.toggleNsfw : scheme.toggleNsfw} transition-all duration-300 font-semibold`}
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    NSFW
                  </span>
                </Button>
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className={`${scheme.button} text-white !rounded-xl font-semibold shadow-lg`} onClick={() => window.location.href = '/pricing'}>
                Get Started
              </Button>
            </motion.div>

            {/* Auth Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || user.email} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className={`text-sm font-medium ${scheme.text}`}>
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className={`!rounded-xl ${scheme.logoutButton} font-semibold`}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => window.location.href = '/auth/signin'}
                  className={`!rounded-xl ${scheme.loginButton} font-semibold shadow-lg`}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`${scheme.text} hover:bg-white/10 !rounded-xl`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden py-4 border-t border-white/20"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-2">
              {[
                { href: '/', icon: Home, label: 'Home' },
                { href: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
                { href: '/showcase', icon: Star, label: 'Showcase' },
                { href: '/create', icon: Plus, label: 'Create' }
              ].map((item, index) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${scheme.text} ${scheme.hoverBg} ${scheme.hoverText} hover:scale-105`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </motion.a>
              ))}
              
              {/* Mobile Mode Toggle */}
              <div className="flex items-center space-x-2 py-2">
                <Button
                  size="sm"
                  variant={!isNSFW ? 'default' : 'outline'}
                  onClick={() => {
                    setIsNSFW(false)
                    setIsMenuOpen(false)
                  }}
                  className={`!rounded-xl ${!isNSFW ? scheme.toggleSfw : scheme.toggleSfw} flex-1 font-semibold`}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  SFW
                </Button>
                <Button
                  size="sm"
                  variant={isNSFW ? 'default' : 'outline'}
                  onClick={() => {
                    setIsNSFW(true)
                    setIsMenuOpen(false)
                  }}
                  className={`!rounded-xl ${isNSFW ? scheme.toggleNsfw : scheme.toggleNsfw} flex-1 font-semibold`}
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  NSFW
                </Button>
              </div>

              <Button className={`${scheme.button} text-white w-full !rounded-xl font-semibold shadow-lg`} onClick={() => window.location.href = '/pricing'}>
                Get Started
              </Button>

              {/* Mobile Auth Button */}
              {loading ? (
                <div className="w-full h-10 rounded-full bg-gray-200 animate-pulse" />
              ) : user ? (
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2 px-4 py-2">
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name || user.email} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <span className={`text-sm font-medium ${scheme.text}`}>
                      {user.name || user.email.split('@')[0]}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className={`w-full !rounded-xl ${scheme.logoutButton} font-semibold`}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    window.location.href = '/auth/signin'
                    setIsMenuOpen(false)
                  }}
                  className={`w-full !rounded-xl ${scheme.loginButton} font-semibold shadow-lg`}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}