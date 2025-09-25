'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
<<<<<<< HEAD
=======
import { useAuth } from './auth-context'
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

interface NSFWContextType {
  isNSFW: boolean
  setIsNSFW: (mode: boolean) => void
  toggleMode: () => void
<<<<<<< HEAD
=======
  isAgeVerified: boolean
  setAgeVerified: (verified: boolean) => void
  showAgeVerification: boolean
  setShowAgeVerification: (show: boolean) => void
  canBypassRestrictions: boolean
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
}

const NSFWContext = createContext<NSFWContextType | undefined>(undefined)

export function NSFWProvider({ children }: { children: ReactNode }) {
<<<<<<< HEAD
  const [isNSFW, setIsNSFWState] = useState(true) // Default to NSFW mode for EDN Marketplace
=======
  const { user } = useAuth()
  const [isNSFW, setIsNSFWState] = useState(false)
  const [isAgeVerified, setIsAgeVerifiedState] = useState(false)
  const [showAgeVerification, setShowAgeVerificationState] = useState(false)

  // Check if user can bypass restrictions (admin or development mode)
  const canBypassRestrictions = user?.role === 'ADMIN' || process.env.NODE_ENV === 'development'
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539

  // Load NSFW preference from localStorage on mount
  useEffect(() => {
    const savedNSFW = localStorage.getItem('edn-nsfw-mode')
<<<<<<< HEAD
    if (savedNSFW !== null) {
      setIsNSFWState(savedNSFW === 'true')
    }
  }, [])

=======
    const savedAgeVerification = localStorage.getItem('edn-age-verified')
    
    if (savedNSFW !== null) {
      setIsNSFWState(savedNSFW === 'true')
    }
    
    if (savedAgeVerification !== null) {
      setIsAgeVerifiedState(savedAgeVerification === 'true')
    }
  }, [])

  // Auto-verify age for admin users and in development mode
  useEffect(() => {
    if (canBypassRestrictions) {
      setIsAgeVerifiedState(true)
      localStorage.setItem('edn-age-verified', 'true')
    }
  }, [canBypassRestrictions])

>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
  // Save NSFW preference to localStorage when it changes
  const setIsNSFW = (mode: boolean) => {
    setIsNSFWState(mode)
    localStorage.setItem('edn-nsfw-mode', mode.toString())
  }

  const toggleMode = () => {
    const newMode = !isNSFW
    setIsNSFW(newMode)
  }

<<<<<<< HEAD
  return (
    <NSFWContext.Provider value={{ isNSFW, setIsNSFW, toggleMode }}>
=======
  const setAgeVerified = (verified: boolean) => {
    setIsAgeVerifiedState(verified)
    localStorage.setItem('edn-age-verified', verified.toString())
  }

  const setShowAgeVerification = (show: boolean) => {
    // Don't show age verification for admin users or in development mode
    if (!canBypassRestrictions) {
      setShowAgeVerificationState(show)
    }
  }

  return (
    <NSFWContext.Provider value={{ 
      isNSFW, 
      setIsNSFW, 
      toggleMode,
      isAgeVerified,
      setAgeVerified,
      showAgeVerification,
      setShowAgeVerification,
      canBypassRestrictions
    }}>
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
      {children}
    </NSFWContext.Provider>
  )
}

export function useNSFW(): NSFWContextType {
  const context = useContext(NSFWContext)
  if (context === undefined) {
<<<<<<< HEAD
    // Return a default context instead of throwing an error - default to NSFW for EDN Marketplace
    return {
      isNSFW: true,
      setIsNSFW: () => {},
      toggleMode: () => {}
=======
    // Return a default context instead of throwing an error
    return {
      isNSFW: false,
      setIsNSFW: () => {},
      toggleMode: () => {},
      isAgeVerified: false,
      setAgeVerified: () => {},
      showAgeVerification: false,
      setShowAgeVerification: () => {},
      canBypassRestrictions: process.env.NODE_ENV === 'development'
>>>>>>> 5f0a3f67cc9176021538ab562209642046544539
    }
  }
  return context
}