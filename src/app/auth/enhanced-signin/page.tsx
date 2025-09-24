'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { enhancedAuth } from '@/lib/enhanced-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Mail, Lock, Eye, EyeOff, User, Shield, CheckCircle } from 'lucide-react'

export default function EnhancedSignIn() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; message: string } | null>(null)
  
  // Sign in form
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')
  
  // Sign up form
  const [signUpEmail, setSignUpEmail] = useState('')
  const [signUpPassword, setSignUpPassword] = useState('')
  const [signUpName, setSignUpName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // Reset password form
  const [resetEmail, setResetEmail] = useState('')
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await enhancedAuth.signInWithEmail(signInEmail, signInPassword)
      
      if (result.success) {
        setSuccess(result.message || 'Signed in successfully')
        setTimeout(() => {
          router.push(redirectTo)
        }, 1000)
      } else {
        setError(result.error || 'Sign in failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      if (signUpPassword !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      const result = await enhancedAuth.signUpWithEmail(signUpEmail, signUpPassword, signUpName)
      
      if (result.success) {
        setSuccess(result.message || 'Account created successfully')
        // Clear form
        setSignUpEmail('')
        setSignUpPassword('')
        setSignUpName('')
        setConfirmPassword('')
      } else {
        setError(result.error || 'Sign up failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await enhancedAuth.resetPassword(resetEmail)
      
      if (result.success) {
        setSuccess(result.message || 'Reset email sent successfully')
        setResetEmail('')
      } else {
        setError(result.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignIn = async (provider: string) => {
    try {
      setLoading(true)
      const url = await enhancedAuth.signInWithSocial(provider)
      window.location.href = url
    } catch (err) {
      setError(`Failed to sign in with ${provider}`)
      setLoading(false)
    }
  }

  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength(null)
      return
    }

    let score = 0
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }

    score = Object.values(checks).filter(Boolean).length

    let message = ''
    if (score < 2) message = 'Weak password'
    else if (score < 4) message = 'Moderate password'
    else message = 'Strong password'

    setPasswordStrength({ score, message })
  }

  const socialProviders = enhancedAuth.getSocialProviders()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome to EDN
            </CardTitle>
            <CardDescription className="text-white/70">
              Your gateway to AI-powered content creation
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="signin" className="text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-white">Sign Up</TabsTrigger>
                <TabsTrigger value="reset" className="text-white">Reset</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-400 bg-green-400/10">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="signin-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-transparent px-2 text-white/50">Or continue with</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {socialProviders.map((provider) => (
                    <Button
                      key={provider.id}
                      variant="outline"
                      className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => handleSocialSignIn(provider.id)}
                      disabled={loading}
                    >
                      <span className="mr-2">{provider.icon}</span>
                      Continue with {provider.name}
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-400 bg-green-400/10">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="signup-name"
                        type="text"
                        value={signUpName}
                        onChange={(e) => setSignUpName(e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signUpEmail}
                        onChange={(e) => setSignUpEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signUpPassword}
                        onChange={(e) => {
                          setSignUpPassword(e.target.value)
                          checkPasswordStrength(e.target.value)
                        }}
                        placeholder="Create a password"
                        className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordStrength && (
                      <div className="flex items-center space-x-2 text-xs">
                        <div className={`w-16 h-2 rounded-full ${
                          passwordStrength.score < 2 ? 'bg-red-400' :
                          passwordStrength.score < 4 ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <span className="text-white/70">{passwordStrength.message}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                      {confirmPassword && signUpPassword === confirmPassword && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 h-4 w-4" />
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="reset" className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-400 bg-green-400/10">
                    <AlertDescription className="text-green-400">{success}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-white">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Email
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}