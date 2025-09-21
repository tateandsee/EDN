'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  Sparkles, 
  Code, 
  Server, 
  Database, 
  Cloud, 
  Key, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Download, 
  Copy, 
  CheckCircle, 
  ExternalLink, 
  FileText, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  BookOpen,
  Github,
  Terminal,
  Plug,
  Lock,
  Unlock,
  AlertCircle,
  Info
} from 'lucide-react'

export default function APIPage() {
  const [apiKey, setApiKey] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isNSFW, setIsNSFW] = useState(false)
  
  const sfwColors = {
    primary: '#FF6B35', // vibrant coral orange
    secondary: '#4ECDC4', // bright turquoise
    accent: '#FFE66D', // golden yellow
    bg: 'from-orange-200 via-cyan-200 to-yellow-200',
    particle: '#FF6B35',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(0, 0, 0, 0.1)',
    textPrimary: '#1A202C', // dark gray
    textSecondary: '#2D3748', // medium gray
    textLight: '#4A5568', // light gray
    textOnWhite: '#2D3748' // text on white backgrounds
  }

  const nsfwColors = {
    primary: '#FF1493', // deep hot pink
    secondary: '#00CED1', // dark turquoise
    accent: '#FF1744', // vibrant red
    bg: 'from-pink-900 via-purple-900 to-red-900',
    particle: '#FF69B4',
    cardBg: 'rgba(30, 0, 30, 0.85)',
    cardBorder: 'rgba(255, 20, 147, 0.5)',
    textPrimary: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textLight: '#B0B0B0',
    textOnWhite: '#FFFFFF'
  }

  const colors = isNSFW ? nsfwColors : sfwColors

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/v1/content/create',
      description: 'Create new AI-generated content',
      parameters: ['prompt', 'style', 'resolution', 'format'],
      response: 'Content creation job ID'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/content/{id}',
      description: 'Retrieve content creation status',
      parameters: ['id'],
      response: 'Content status and download URL'
    },
    {
      method: 'POST',
      endpoint: '/api/v1/distribute',
      description: 'Distribute content to platforms',
      parameters: ['content_id', 'platforms', 'schedule'],
      response: 'Distribution job ID'
    },
    {
      method: 'GET',
      endpoint: '/api/v1/analytics',
      description: 'Get performance analytics',
      parameters: ['date_range', 'platforms', 'metrics'],
      response: 'Analytics data object'
    }
  ]

  const authentication = {
    types: [
      {
        type: 'API Key',
        description: 'Simple key-based authentication',
        icon: Key,
        security: 'High'
      },
      {
        type: 'OAuth 2.0',
        description: 'Industry-standard authentication',
        icon: Shield,
        security: 'Very High'
      },
      {
        type: 'JWT Tokens',
        description: 'Token-based authentication',
        icon: Lock,
        security: 'High'
      }
    ]
  }

  const rateLimits = [
    { tier: 'Free', requests: '100/day', concurrent: '5' },
    { tier: 'Pro', requests: '10,000/day', concurrent: '50' },
    { tier: 'Enterprise', requests: 'Unlimited', concurrent: 'Unlimited' }
  ]

  const handleGenerateAPIKey = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const newKey = 'edn_' + Math.random().toString(36).substr(2, 32)
      setApiKey(newKey)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bg}`}>
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
              API Reference
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-md leading-relaxed">
              Integrate EDN's powerful AI content creation capabilities into your applications
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-3 text-lg shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                Get API Key
                <Key className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold backdrop-blur-sm">
                View Documentation
                <BookOpen className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* API Key Management */}
          <Card className="backdrop-blur-sm border-2 mb-12" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: colors.primary }}>
                <Key className="h-6 w-6" />
                API Key Management
              </CardTitle>
              <CardDescription style={{ color: colors.textSecondary }}>
                Generate and manage your API keys for accessing EDN services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <Button 
                  onClick={handleGenerateAPIKey}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate API Key
                    </>
                  )}
                </Button>
              </div>
              
              {apiKey && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm" style={{ color: colors.textSecondary }}>
                      Keep your API key secure and never share it publicly
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={apiKey}
                      readOnly
                      className="flex-1 font-mono text-sm"
                      style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder, color: colors.textPrimary }}
                    />
                    <Button
                      onClick={handleCopyKey}
                      variant="outline"
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6">
                <Server className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>RESTful API</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Clean, intuitive REST endpoints for easy integration
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6">
                <Zap className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Lightning Fast</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Sub-second response times for all API calls
                </p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
              <CardContent className="p-6">
                <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>Enterprise Grade</h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Bank-level security and reliability guaranteed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* API Documentation Tabs */}
          <Tabs defaultValue="endpoints" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12">
              <TabsTrigger value="endpoints" className="text-lg py-3">Endpoints</TabsTrigger>
              <TabsTrigger value="authentication" className="text-lg py-3">Authentication</TabsTrigger>
              <TabsTrigger value="rate-limits" className="text-lg py-3">Rate Limits</TabsTrigger>
              <TabsTrigger value="sdks" className="text-lg py-3">SDKs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="endpoints" className="mt-8">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>API Endpoints</CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Complete list of available API endpoints and their usage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, index) => (
                      <div key={index} className="border rounded-lg p-4" style={{ borderColor: colors.cardBorder }}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className={`${endpoint.method === 'POST' ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm font-mono" style={{ color: colors.primary }}>
                              {endpoint.endpoint}
                            </code>
                          </div>
                          <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                            Try it
                            <Play className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {endpoint.description}
                        </p>
                        <div className="flex gap-4 text-xs">
                          <span style={{ color: colors.textLight }}>
                            <strong>Parameters:</strong> {endpoint.parameters.join(', ')}
                          </span>
                          <span style={{ color: colors.textLight }}>
                            <strong>Response:</strong> {endpoint.response}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication" className="mt-8">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>Authentication Methods</CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Choose the authentication method that works best for your application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {authentication.types.map((auth, index) => (
                      <Card key={index} className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                        <CardHeader className="text-center">
                          <auth.icon className="h-12 w-12 mx-auto mb-4" style={{ color: colors.primary }} />
                          <CardTitle className="text-lg" style={{ color: colors.primary }}>{auth.type}</CardTitle>
                          <CardDescription style={{ color: colors.textSecondary }}>{auth.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center">
                          <Badge className={`${auth.security === 'Very High' ? 'bg-green-500' : auth.security === 'High' ? 'bg-yellow-500' : 'bg-orange-500'} text-white mb-4`}>
                            {auth.security} Security
                          </Badge>
                          <Button variant="outline" size="sm" className="w-full" style={{ borderColor: colors.primary, color: colors.primary }}>
                            Learn More
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rate-limits" className="mt-8">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>Rate Limits</CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    API rate limits based on your subscription tier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left p-4" style={{ color: colors.primary }}>Tier</th>
                          <th className="text-left p-4" style={{ color: colors.primary }}>Requests</th>
                          <th className="text-left p-4" style={{ color: colors.primary }}>Concurrent</th>
                          <th className="text-left p-4" style={{ color: colors.primary }}>Features</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rateLimits.map((limit, index) => (
                          <tr key={index} className="border-t" style={{ borderColor: colors.cardBorder }}>
                            <td className="p-4">
                              <Badge className={`${limit.tier === 'Enterprise' ? 'bg-purple-500' : limit.tier === 'Pro' ? 'bg-blue-500' : 'bg-gray-500'} text-white`}>
                                {limit.tier}
                              </Badge>
                            </td>
                            <td className="p-4" style={{ color: colors.textPrimary }}>{limit.requests}</td>
                            <td className="p-4" style={{ color: colors.textPrimary }}>{limit.concurrent}</td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {limit.tier === 'Enterprise' && (
                                  <>
                                    <Badge className="bg-green-500 text-white text-xs">Priority Support</Badge>
                                    <Badge className="bg-blue-500 text-white text-xs">Custom Features</Badge>
                                  </>
                                )}
                                {limit.tier === 'Pro' && (
                                  <Badge className="bg-yellow-500 text-white text-xs">Analytics</Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sdks" className="mt-8">
              <Card className="backdrop-blur-sm border-2" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                <CardHeader>
                  <CardTitle style={{ color: colors.primary }}>SDKs & Libraries</CardTitle>
                  <CardDescription style={{ color: colors.textSecondary }}>
                    Official SDKs for popular programming languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'JavaScript', icon: 'JS', color: 'bg-yellow-400' },
                      { name: 'Python', icon: 'PY', color: 'bg-blue-500' },
                      { name: 'Node.js', icon: 'Node', color: 'bg-green-500' },
                      { name: 'cURL', icon: 'CLI', color: 'bg-gray-600' }
                    ].map((sdk, index) => (
                      <Card key={index} className="backdrop-blur-sm border-2 text-center" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
                        <CardContent className="p-6">
                          <div className={`w-16 h-16 rounded-full ${sdk.color} flex items-center justify-center mx-auto mb-4`}>
                            <span className="text-white font-bold">{sdk.icon}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2" style={{ color: colors.primary }}>{sdk.name}</h3>
                          <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                            Official SDK with full documentation
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                              <Github className="h-3 w-3 mr-1" />
                              GitHub
                            </Button>
                            <Button variant="outline" size="sm" style={{ borderColor: colors.primary, color: colors.primary }}>
                              <BookOpen className="h-3 w-3 mr-1" />
                              Docs
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Start Example */}
          <Card className="backdrop-blur-sm border-2 mt-12" style={{ backgroundColor: colors.cardBg, borderColor: colors.cardBorder }}>
            <CardHeader>
              <CardTitle style={{ color: colors.primary }}>Quick Start Example</CardTitle>
              <CardDescription style={{ color: colors.textSecondary }}>
                Get started with the EDN API in just a few lines of code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">
{`const response = await fetch('https://api.edn.ai/v1/content/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: 'Beautiful sunset over ocean',
    style: 'photorealistic',
    resolution: '4K',
    format: 'jpg'
  })
});

const result = await response.json();
console.log('Job ID:', result.job_id);`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}