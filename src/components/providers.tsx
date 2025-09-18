'use client'

import { NSFWProvider } from '@/contexts/nsfw-context'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NSFWProvider>
      <AuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </AuthProvider>
    </NSFWProvider>
  )
}