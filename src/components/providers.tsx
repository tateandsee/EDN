'use client'

import { NSFWProvider } from '@/contexts/nsfw-context'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'
import { IntegrationProvider } from '@/contexts/integration-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NSFWProvider>
      <AuthProvider>
        <NotificationProvider>
          <IntegrationProvider>
            {children}
          </IntegrationProvider>
        </NotificationProvider>
      </AuthProvider>
    </NSFWProvider>
  )
}