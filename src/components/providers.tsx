'use client'

import { NSFWProvider } from '@/contexts/nsfw-context'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <NSFWProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </NSFWProvider>
    </AuthProvider>
  )
}