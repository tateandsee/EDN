'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface SecurityLog {
  id: string
  type: 'login' | 'logout' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'suspicious_activity' | 'data_export'
  timestamp: string
  ipAddress: string
  location: string
  device: string
  status: 'success' | 'failed' | 'warning'
  details: string
}

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  type: 'toggle' | 'config'
  lastUpdated?: string
}

interface TwoFactorMethod {
  id: string
  name: string
  description: string
  enabled: boolean
  setupRequired: boolean
}

interface SecurityAlert {
  id: string
  type: 'critical' | 'warning' | 'info'
  title: string
  description: string
  timestamp: string
  resolved: boolean
  action?: string
}

interface SecurityState {
  logs: SecurityLog[]
  settings: SecuritySetting[]
  twoFactorMethods: TwoFactorMethod[]
  alerts: SecurityAlert[]
  loading: boolean
  error: string | null
  securityScore: number
  overview: {
    securityScore: number
    twoFactorEnabled: boolean
    activeSessions: number
    unresolvedAlerts: number
    lastLogin: string
    recentActivity: SecurityLog[]
  }
  monitoring: {
    realTimeMonitoring: Record<string, string>
    threatDetection: Record<string, any>
    dataProtection: Record<string, string>
    networkSecurity: Record<string, string>
  }
}

type SecurityAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOGS'; payload: SecurityLog[] }
  | { type: 'SET_SETTINGS'; payload: SecuritySetting[] }
  | { type: 'SET_TWO_FACTOR_METHODS'; payload: TwoFactorMethod[] }
  | { type: 'SET_ALERTS'; payload: SecurityAlert[] }
  | { type: 'SET_OVERVIEW'; payload: SecurityState['overview'] }
  | { type: 'SET_MONITORING'; payload: SecurityState['monitoring'] }
  | { type: 'SET_SECURITY_SCORE'; payload: number }
  | { type: 'ADD_LOG'; payload: SecurityLog }
  | { type: 'UPDATE_SETTING'; payload: { id: string; updates: Partial<SecuritySetting> } }
  | { type: 'UPDATE_TWO_FACTOR_METHOD'; payload: { id: string; updates: Partial<TwoFactorMethod> } }
  | { type: 'UPDATE_ALERT'; payload: { id: string; updates: Partial<SecurityAlert> } }
  | { type: 'REMOVE_ALERT'; payload: string }

const initialState: SecurityState = {
  logs: [],
  settings: [],
  twoFactorMethods: [],
  alerts: [],
  loading: false,
  error: null,
  securityScore: 0,
  overview: {
    securityScore: 0,
    twoFactorEnabled: false,
    activeSessions: 0,
    unresolvedAlerts: 0,
    lastLogin: '',
    recentActivity: []
  },
  monitoring: {
    realTimeMonitoring: {},
    threatDetection: {},
    dataProtection: {},
    networkSecurity: {}
  }
}

function securityReducer(state: SecurityState, action: SecurityAction): SecurityState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_LOGS':
      return { ...state, logs: action.payload }

    case 'SET_SETTINGS':
      return { ...state, settings: action.payload }

    case 'SET_TWO_FACTOR_METHODS':
      return { ...state, twoFactorMethods: action.payload }

    case 'SET_ALERTS':
      return { ...state, alerts: action.payload }

    case 'SET_OVERVIEW':
      return { ...state, overview: action.payload }

    case 'SET_MONITORING':
      return { ...state, monitoring: action.payload }

    case 'SET_SECURITY_SCORE':
      return { ...state, securityScore: action.payload }

    case 'ADD_LOG':
      return { ...state, logs: [action.payload, ...state.logs] }

    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: state.settings.map(setting =>
          setting.id === action.payload.id
            ? { ...setting, ...action.payload.updates }
            : setting
        )
      }

    case 'UPDATE_TWO_FACTOR_METHOD':
      return {
        ...state,
        twoFactorMethods: state.twoFactorMethods.map(method =>
          method.id === action.payload.id
            ? { ...method, ...action.payload.updates }
            : method
        )
      }

    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.id === action.payload.id
            ? { ...alert, ...action.payload.updates }
            : alert
        )
      }

    case 'REMOVE_ALERT':
      return {
        ...state,
        alerts: state.alerts.filter(alert => alert.id !== action.payload)
      }

    default:
      return state
  }
}

interface SecurityContextType {
  state: SecurityState
  fetchLogs: (limit?: number, offset?: number) => Promise<void>
  fetchSettings: () => Promise<void>
  fetchTwoFactorMethods: () => Promise<void>
  fetchAlerts: (limit?: number, offset?: number) => Promise<void>
  fetchOverview: () => Promise<void>
  fetchMonitoring: () => Promise<void>
  enable2FA: (methodId: string, setupData?: any) => Promise<void>
  disable2FA: (methodId: string, currentPassword: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>
  updateSecuritySetting: (settingId: string, enabled: boolean, config?: any) => Promise<void>
  generateBackupCodes: () => Promise<void>
  verify2FA: (methodId: string, code: string) => Promise<void>
  revokeSession: (sessionId: string) => Promise<void>
  revokeAllSessions: (excludeCurrent?: boolean) => Promise<void>
  resolveSecurityAlert: (alertId: string, resolution?: string) => Promise<void>
  exportSecurityData: (format: string, dateRange: string) => Promise<void>
  setupSecurityQuestion: (question: string, answer: string) => Promise<void>
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined)

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(securityReducer, initialState)

  const fetchLogs = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/security?type=logs&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch security logs')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_LOGS', payload: data.logs })
      } else {
        dispatch({ type: 'SET_LOGS', payload: [...state.logs, ...data.logs] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security?type=settings')
      if (!response.ok) throw new Error('Failed to fetch security settings')
      
      const data = await response.json()
      dispatch({ type: 'SET_SETTINGS', payload: data.settings })
      dispatch({ type: 'SET_SECURITY_SCORE', payload: data.securityScore })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchTwoFactorMethods = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security?type=2fa')
      if (!response.ok) throw new Error('Failed to fetch 2FA methods')
      
      const data = await response.json()
      dispatch({ type: 'SET_TWO_FACTOR_METHODS', payload: data.methods })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchAlerts = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/security?type=alerts&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch security alerts')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_ALERTS', payload: data.alerts })
      } else {
        dispatch({ type: 'SET_ALERTS', payload: [...state.alerts, ...data.alerts] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchOverview = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security?type=overview')
      if (!response.ok) throw new Error('Failed to fetch security overview')
      
      const data = await response.json()
      dispatch({ type: 'SET_OVERVIEW', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchMonitoring = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security?type=monitoring')
      if (!response.ok) throw new Error('Failed to fetch security monitoring')
      
      const data = await response.json()
      dispatch({ type: 'SET_MONITORING', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const enable2FA = async (methodId: string, setupData?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'enable_2fa', data: { methodId, setupData } })
      })
      
      if (!response.ok) throw new Error('Failed to enable 2FA')
      
      const result = await response.json()
      // Update 2FA methods in state
      dispatch({ type: 'UPDATE_TWO_FACTOR_METHOD', payload: { id: methodId, updates: { enabled: true, setupRequired: false } } })
      
      // Add security log
      dispatch({ type: 'ADD_LOG', payload: {
        id: `log_${Date.now()}`,
        type: '2fa_enabled',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        location: 'Current Location',
        device: 'Current Device',
        status: 'success',
        details: 'Two-factor authentication enabled'
      } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const disable2FA = async (methodId: string, currentPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable_2fa', data: { methodId: disableMethodId, currentPassword } })
      })
      
      if (!response.ok) throw new Error('Failed to disable 2FA')
      
      const result = await response.json()
      // Update 2FA methods in state
      dispatch({ type: 'UPDATE_TWO_FACTOR_METHOD', payload: { id: methodId, updates: { enabled: false } } })
      
      // Add security log
      dispatch({ type: 'ADD_LOG', payload: {
        id: `log_${Date.now()}`,
        type: '2fa_disabled',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        location: 'Current Location',
        device: 'Current Device',
        status: 'success',
        details: 'Two-factor authentication disabled'
      } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', data: { currentPassword, newPassword, confirmPassword } })
      })
      
      if (!response.ok) throw new Error('Failed to change password')
      
      const result = await response.json()
      
      // Add security log
      dispatch({ type: 'ADD_LOG', payload: {
        id: `log_${Date.now()}`,
        type: 'password_change',
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.100',
        location: 'Current Location',
        device: 'Current Device',
        status: 'success',
        details: 'Password changed successfully'
      } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateSecuritySetting = async (settingId: string, enabled: boolean, config?: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_security_setting', data: { settingId, enabled, config } })
      })
      
      if (!response.ok) throw new Error('Failed to update security setting')
      
      const result = await response.json()
      dispatch({ type: 'UPDATE_SETTING', payload: { id: settingId, updates: { enabled, lastUpdated: result.timestamp } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const generateBackupCodes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_backup_codes' })
      })
      
      if (!response.ok) throw new Error('Failed to generate backup codes')
      
      const result = await response.json()
      // Handle backup codes (could store in state or return to caller)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const verify2FA = async (methodId: string, code: string) => {
    try {
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_2fa', data: { methodId: verifyMethodId, code } })
      })
      
      if (!response.ok) throw new Error('Failed to verify 2FA')
      
      const result = await response.json()
      return result
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
      throw error
    }
  }

  const revokeSession = async (sessionId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_session', data: { sessionId } })
      })
      
      if (!response.ok) throw new Error('Failed to revoke session')
      
      const result = await response.json()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const revokeAllSessions = async (excludeCurrent = false) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke_all_sessions', data: { excludeCurrent } })
      })
      
      if (!response.ok) throw new Error('Failed to revoke all sessions')
      
      const result = await response.json()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const resolveSecurityAlert = async (alertId: string, resolution?: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve_security_alert', data: { alertId, resolution } })
      })
      
      if (!response.ok) throw new Error('Failed to resolve security alert')
      
      const result = await response.json()
      dispatch({ type: 'UPDATE_ALERT', payload: { id: alertId, updates: { resolved: true } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const exportSecurityData = async (format: string, dateRange: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export_security_data', data: { exportFormat: format, dateRange } })
      })
      
      if (!response.ok) throw new Error('Failed to export security data')
      
      const result = await response.json()
      // Handle download URL or trigger download
      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank')
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const setupSecurityQuestion = async (question: string, answer: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup_security_question', data: { question, answer } })
      })
      
      if (!response.ok) throw new Error('Failed to setup security question')
      
      const result = await response.json()
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    // Initial data fetch
    fetchOverview()
    fetchSettings()
    fetchTwoFactorMethods()
    fetchAlerts()
  }, [])

  const value: SecurityContextType = {
    state,
    fetchLogs,
    fetchSettings,
    fetchTwoFactorMethods,
    fetchAlerts,
    fetchOverview,
    fetchMonitoring,
    enable2FA,
    disable2FA,
    changePassword,
    updateSecuritySetting,
    generateBackupCodes,
    verify2FA,
    revokeSession,
    revokeAllSessions,
    resolveSecurityAlert,
    exportSecurityData,
    setupSecurityQuestion
  }

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurity() {
  const context = useContext(SecurityContext)
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider')
  }
  return context
}