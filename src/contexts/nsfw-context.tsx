'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface NSFWContextType {
  isNSFW: boolean
  setIsNSFW: (mode: boolean) => void
  toggleMode: () => void
}

const NSFWContext = createContext<NSFWContextType | undefined>(undefined)

export function NSFWProvider({ children }: { children: ReactNode }) {
  const [isNSFW, setIsNSFWState] = useState(true) // Default to NSFW mode for EDN Marketplace

  // Load NSFW preference from localStorage on mount
  useEffect(() => {
    const savedNSFW = localStorage.getItem('edn-nsfw-mode')
    if (savedNSFW !== null) {
      setIsNSFWState(savedNSFW === 'true')
    }
  }, [])

  // Save NSFW preference to localStorage when it changes
  const setIsNSFW = (mode: boolean) => {
    setIsNSFWState(mode)
    localStorage.setItem('edn-nsfw-mode', mode.toString())
  }

  const toggleMode = () => {
    const newMode = !isNSFW
    setIsNSFW(newMode)
  }

  return (
    <NSFWContext.Provider value={{ isNSFW, setIsNSFW, toggleMode }}>
      {children}
    </NSFWContext.Provider>
  )
}

export function useNSFW(): NSFWContextType {
  const context = useContext(NSFWContext)
  if (context === undefined) {
    // Return a default context instead of throwing an error - default to NSFW for EDN Marketplace
    return {
      isNSFW: true,
      setIsNSFW: () => {},
      toggleMode: () => {}
    }
  }
  return context
}