'use client'

import { NSFWProvider } from '@/contexts/nsfw-context'
import { AuthProvider } from '@/contexts/auth-context'
import { NotificationProvider } from '@/contexts/notification-context'
import { IntegrationProvider } from '@/contexts/integration-context'
import { UserProvider } from '@/contexts/user-context'
import { AnalyticsProvider } from '@/contexts/analytics-context'
import { SearchProvider } from '@/contexts/search-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NSFWProvider>
      <AuthProvider>
        <NotificationProvider>
          <IntegrationProvider>
            <UserProvider>
              <AnalyticsProvider>
                <SearchProvider>
                  {children}
                </SearchProvider>
              </AnalyticsProvider>
            </UserProvider>
          </IntegrationProvider>
        </NotificationProvider>
      </AuthProvider>
    </NSFWProvider>
  )
}