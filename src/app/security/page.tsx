'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ResponsiveContainer, ResponsiveGrid, ResponsiveText, ResponsiveButton, ResponsiveCard } from "@/components/ui/responsive"
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  Smartphone, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Fingerprint,
  UserCheck,
  Database,
  Network,
  Wifi,
  Monitor,
  MapPin,
  Calendar,
  Activity,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Copy,
  QrCode,
  CreditCard,
  Users,
  FileText,
  Bell,
  Zap
} from "lucide-react"

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
  icon: React.ElementType
  lastUpdated?: string
}

interface TwoFactorMethod {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: React.ElementType
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

const mockSecurityLogs: SecurityLog[] = [
  {
    id: '1',
    type: 'login',
    timestamp: '2024-01-20T14:30:00Z',
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Chrome on Windows',
    status: 'success',
    details: 'Successful login from new device'
  },
  {
    id: '2',
    type: '2fa_enabled',
    timestamp: '2024-01-20T14:25:00Z',
    ipAddress: '192.168.1.100',
    location: 'New York, NY',
    device: 'Chrome on Windows',
    status: 'success',
    details: 'Two-factor authentication enabled'
  },
  {
    id: '3',
    type: 'suspicious_activity',
    timestamp: '2024-01-19T23:45:00Z',
    ipAddress: '45.67.89.123',
    location: 'Unknown Location',
    device: 'Unknown Device',
    status: 'warning',
    details: 'Multiple failed login attempts detected'
  }
]

const mockSecuritySettings: SecuritySetting[] = [
  {
    id: '1',
    name: 'Two-Factor Authentication',
    description: 'Add an extra layer of security to your account',
    enabled: true,
    type: 'toggle',
    icon: Shield,
    lastUpdated: '2024-01-20T14:25:00Z'
  },
  {
    id: '2',
    name: 'Login Notifications',
    description: 'Get notified when someone logs into your account',
    enabled: true,
    type: 'toggle',
    icon: Bell,
    lastUpdated: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    name: 'Session Timeout',
    description: 'Automatically log out after inactivity',
    enabled: true,
    type: 'config',
    icon: Clock
  },
  {
    id: '4',
    name: 'Data Encryption',
    description: 'Encrypt sensitive data at rest and in transit',
    enabled: true,
    type: 'toggle',
    icon: Lock
  },
  {
    id: '5',
    name: 'IP Whitelisting',
    description: 'Restrict access to specific IP addresses',
    enabled: false,
    type: 'config',
    icon: Network
  }
]

const mockTwoFactorMethods: TwoFactorMethod[] = [
  {
    id: '1',
    name: 'Authenticator App',
    description: 'Use Google Authenticator or similar apps',
    enabled: true,
    icon: Smartphone,
    setupRequired: false
  },
  {
    id: '2',
    name: 'SMS Verification',
    description: 'Receive verification codes via text message',
    enabled: false,
    icon: Mail,
    setupRequired: true
  },
  {
    id: '3',
    name: 'Email Verification',
    description: 'Receive verification codes via email',
    enabled: false,
    icon: Mail,
    setupRequired: true
  },
  {
    id: '4',
    name: 'Hardware Key',
    description: 'Use a physical security key (YubiKey, etc.)',
    enabled: false,
    icon: Key,
    setupRequired: true
  }
]

const mockSecurityAlerts: SecurityAlert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Suspicious Login Attempt',
    description: 'Multiple failed login attempts detected from unknown location',
    timestamp: '2024-01-19T23:45:00Z',
    resolved: false,
    action: 'Review login attempts'
  },
  {
    id: '2',
    type: 'warning',
    title: 'Outdated Security Settings',
    description: 'Some security settings need to be updated for better protection',
    timestamp: '2024-01-18T10:30:00Z',
    resolved: true,
    action: 'Update settings'
  },
  {
    id: '3',
    type: 'info',
    title: 'New Security Feature Available',
    description: 'Advanced biometric authentication is now available for your account',
    timestamp: '2024-01-17T15:20:00Z',
    resolved: false,
    action: 'Enable feature'
  }
]

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(mockSecurityLogs)
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>(mockSecuritySettings)
  const [twoFactorMethods, setTwoFactorMethods] = useState<TwoFactorMethod[]>(mockTwoFactorMethods)
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>(mockSecurityAlerts)
  const [showPassword, setShowPassword] = useState(false)

  const handleToggleSetting = (settingId: string) => {
    setSecuritySettings(prev => prev.map(setting =>
      setting.id === settingId
        ? { ...setting, enabled: !setting.enabled, lastUpdated: new Date().toISOString() }
        : setting
    ))
  }

  const handleEnable2FA = (methodId: string) => {
    setTwoFactorMethods(prev => prev.map(method =>
      method.id === methodId
        ? { ...method, enabled: true, setupRequired: false }
        : method.id === '1' && methodId !== '1' // Disable authenticator app if enabling other method
        ? { ...method, enabled: false }
        : method
    ))
  }

  const handleDisable2FA = (methodId: string) => {
    setTwoFactorMethods(prev => prev.map(method =>
      method.id === methodId
        ? { ...method, enabled: false }
        : method
    ))
  }

  const handleResolveAlert = (alertId: string) => {
    setSecurityAlerts(prev => prev.map(alert =>
      alert.id === alertId
        ? { ...alert, resolved: true }
        : alert
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'failed': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500'
      case 'warning': return 'bg-yellow-500'
      case 'info': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
            Advanced Security
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive security features including 2FA, monitoring, and enhanced protection for your account
          </p>
        </div>

        {/* Security Score */}
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-800">Security Score</h3>
                <p className="text-green-600">Your account is well protected</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">92/100</div>
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        {securityAlerts.filter(alert => !alert.resolved).length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Security Alerts
            </h3>
            {securityAlerts.filter(alert => !alert.resolved).map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${alert.type === 'critical' ? 'border-red-500' : alert.type === 'warning' ? 'border-yellow-500' : 'border-blue-500'}`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <strong>{alert.title}</strong>
                    <p className="text-sm mt-1">{alert.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      {alert.action}
                    </Button>
                    <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                      Resolve
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="logs">Activity Log</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ResponsiveGrid cols={1} mdCols={2} lgCols={4} gap={4}>
              <ResponsiveCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">2FA Status</p>
                    <p className="text-lg font-bold text-green-500">Enabled</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </ResponsiveCard>
              
              <ResponsiveCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Sessions</p>
                    <p className="text-lg font-bold text-blue-500">3</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </ResponsiveCard>
              
              <ResponsiveCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Security Alerts</p>
                    <p className="text-lg font-bold text-yellow-500">1</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-yellow-500" />
                </div>
              </ResponsiveCard>
              
              <ResponsiveCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="text-lg font-bold text-purple-500">2h ago</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </ResponsiveCard>
            </ResponsiveGrid>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Activity</CardTitle>
                <CardDescription>Latest security-related events on your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(log.status)}`} />
                        <div>
                          <p className="font-medium">{log.type.replace('_', ' ').toUpperCase()}</p>
                          <p className="text-sm text-muted-foreground">{log.details}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <p>{formatTimeAgo(log.timestamp)}</p>
                        <p>{log.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Two-Factor Tab */}
          <TabsContent value="2fa" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account by requiring a second form of verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {twoFactorMethods.map((method) => {
                    const MethodIcon = method.icon
                    return (
                      <Card key={method.id} className={method.enabled ? 'border-green-200 bg-green-50' : ''}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <MethodIcon className="h-6 w-6 text-blue-500" />
                              <div>
                                <CardTitle className="text-lg">{method.name}</CardTitle>
                                <CardDescription>{method.description}</CardDescription>
                              </div>
                            </div>
                            {method.enabled && (
                              <Badge className="bg-green-500">Active</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {method.enabled ? (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                <span className="text-sm">Enabled and active</span>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleDisable2FA(method.id)}
                              >
                                Disable
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {method.setupRequired && (
                                <div className="flex items-center gap-2 text-yellow-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  <span className="text-sm">Setup required</span>
                                </div>
                              )}
                              <Button 
                                size="sm" 
                                onClick={() => handleEnable2FA(method.id)}
                              >
                                Set Up
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    We recommend using an authenticator app for the best security experience. 
                    SMS and email verification are less secure alternatives.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-bold">Security Settings</h2>
            
            <div className="space-y-4">
              {securitySettings.map((setting) => {
                const SettingIcon = setting.icon
                return (
                  <Card key={setting.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <SettingIcon className="h-6 w-6 text-blue-500" />
                          <div>
                            <h3 className="font-semibold">{setting.name}</h3>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                            {setting.lastUpdated && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last updated: {new Date(setting.lastUpdated).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {setting.type === 'toggle' ? (
                            <Button
                              variant={setting.enabled ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleToggleSetting(setting.id)}
                            >
                              {setting.enabled ? 'Enabled' : 'Disabled'}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password regularly to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Current Password</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter current password"
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">New Password</label>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Log Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Security Activity Log</h2>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className={`w-3 h-3 rounded-full mt-1 ${getStatusColor(log.status)}`} />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{log.type.replace('_', ' ').toUpperCase()}</h3>
                            <Badge variant="outline" className={log.status === 'success' ? 'border-green-500 text-green-700' : log.status === 'failed' ? 'border-red-500 text-red-700' : 'border-yellow-500 text-yellow-700'}>
                              {log.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{log.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Monitor className="h-3 w-3" />
                              <span>{log.device}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground mb-1">{log.ipAddress}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(log.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <h2 className="text-2xl font-bold">Security Monitoring</h2>
            
            <ResponsiveGrid cols={1} mdCols={2} gap={6}>
              {/* Real-time Monitoring */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Real-time Monitoring
                  </CardTitle>
                  <CardDescription>
                    Continuous monitoring of your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Login monitoring</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Suspicious activity detection</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Data breach monitoring</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">API rate limiting</span>
                      </div>
                      <Badge className="bg-yellow-500">Configuring</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Threat Detection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    Threat Detection
                  </CardTitle>
                  <CardDescription>
                    Advanced threat detection and prevention
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">0</p>
                      <p className="text-sm text-blue-600">Threats Blocked</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">100%</p>
                      <p className="text-sm text-green-600">Protection Rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Malware detection</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Phishing protection</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>DDoS protection</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>SQL injection protection</span>
                      <Badge className="bg-green-500">Enabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-500" />
                    Data Protection
                  </CardTitle>
                  <CardDescription>
                    Comprehensive data encryption and protection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        <span className="text-sm">End-to-end encryption</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Data at rest encryption</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-green-500" />
                        <span className="text-sm">GDPR compliance</span>
                      </div>
                      <Badge className="bg-green-500">Compliant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-orange-500" />
                    Network Security
                  </CardTitle>
                  <CardDescription>
                    Advanced network protection and monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-green-500" />
                        <span className="text-sm">SSL/TLS encryption</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Firewall protection</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Access control</span>
                      </div>
                      <Badge className="bg-green-500">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResponsiveGrid>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}