'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { enhancedOnboarding } from '@/lib/enhanced-onboarding'
import { enhancedAuth } from '@/lib/enhanced-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Loader2, 
  CheckCircle, 
  Circle, 
  Star, 
  Trophy, 
  Target, 
  Settings, 
  User,
  Sparkles,
  Link,
  Shield,
  Diamond,
  Users,
  ArrowRight,
  ArrowLeft,
  SkipForward,
  Clock
} from 'lucide-react'

interface OnboardingStep {
  id: string
  name: string
  description: string
  order: number
  pointsReward: number
  isRequired: boolean
  isCompleted: boolean
  category: 'account' | 'profile' | 'preferences' | 'tutorial' | 'verification'
  icon: string
  estimatedTime: number
}

interface OnboardingProgress {
  userId: string
  completedSteps: string[]
  currentStep: string
  totalSteps: number
  completedStepsCount: number
  progressPercentage: number
  pointsEarned: number
  totalPossiblePoints: number
  startedAt: string
  lastActivityAt: string
  estimatedCompletionTime?: string
}

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [steps, setSteps] = useState<OnboardingStep[]>([])
  const [progress, setProgress] = useState<OnboardingProgress | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  
  // Form states
  const [profileData, setProfileData] = useState({
    name: '',
    bio: '',
    location: '',
    website: ''
  })
  
  const [preferences, setPreferences] = useState({
    experienceLevel: '',
    primaryUseCase: '',
    contentFrequency: '',
    budgetRange: '',
    nsfwPreference: 'sfw' as 'sfw' | 'nsfw' | 'both',
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false
  })

  const router = useRouter()

  useEffect(() => {
    loadOnboardingData()
  }, [])

  const loadOnboardingData = async () => {
    try {
      setLoading(true)
      
      // Get current user (you would get this from auth context)
      const user = await enhancedAuth.getCurrentUser()
      if (!user) {
        router.push('/auth/enhanced-signin')
        return
      }

      // Load onboarding steps and progress
      const onboardingSteps = await enhancedOnboarding.getOnboardingSteps(user.id)
      const onboardingProgress = await enhancedOnboarding.getOnboardingProgress(user.id)
      
      setSteps(onboardingSteps)
      setProgress(onboardingProgress)
      
      // Find current step index
      const currentIndex = onboardingSteps.findIndex(step => step.id === onboardingProgress.currentStep)
      setCurrentStepIndex(Math.max(0, currentIndex))
      
      // Check if onboarding is completed
      if (user.onboardingCompleted) {
        router.push('/dashboard')
      }
      
    } catch (err) {
      setError('Failed to load onboarding data')
    } finally {
      setLoading(false)
    }
  }

  const completeCurrentStep = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const user = await enhancedAuth.getCurrentUser()
      if (!user) return
      
      const currentStep = steps[currentStepIndex]
      if (!currentStep) return
      
      let additionalData: any = {}
      
      // Prepare step-specific data
      switch (currentStep.id) {
        case 'profile_setup':
          additionalData = profileData
          break
        case 'preferences':
          additionalData = preferences
          break
        case 'first_creation':
          // This would be handled by the content creation flow
          additionalData = { title: 'First Creation', type: 'IMAGE' }
          break
      }
      
      const success = await enhancedOnboarding.completeStep(user.id, currentStep.id, additionalData)
      
      if (success) {
        setSuccess(`Step "${currentStep.name}" completed successfully!`)
        
        // Move to next step or complete onboarding
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1)
        } else {
          // Onboarding completed
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
        
        // Reload progress
        setTimeout(() => {
          loadOnboardingData()
        }, 1000)
        
      } else {
        setError('Failed to complete step')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const skipCurrentStep = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const user = await enhancedAuth.getCurrentUser()
      if (!user) return
      
      const currentStep = steps[currentStepIndex]
      if (!currentStep) return
      
      const success = await enhancedOnboarding.skipStep(user.id, currentStep.id)
      
      if (success) {
        setShowSkipConfirm(false)
        setSuccess(`Step "${currentStep.name}" skipped`)
        
        // Move to next step
        if (currentStepIndex < steps.length - 1) {
          setCurrentStepIndex(currentStepIndex + 1)
        } else {
          // Onboarding completed
          setTimeout(() => {
            router.push('/dashboard')
          }, 2000)
        }
        
        // Reload progress
        setTimeout(() => {
          loadOnboardingData()
        }, 1000)
        
      } else {
        setError('Cannot skip this required step')
      }
      
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index)
    }
  }

  const renderStepContent = (step: OnboardingStep) => {
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">{step.icon}</div>
            <h2 className="text-2xl font-bold">Welcome to EDN!</h2>
            <p className="text-gray-600">
              Get ready to explore the future of AI-powered content creation. This quick onboarding will help you get set up and familiar with all the amazing features EDN has to offer.
            </p>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-purple-50 rounded-lg">
                <Trophy className="w-8 h-8 text-purple-600 mb-2" />
                <h3 className="font-semibold">Earn Points</h3>
                <p className="text-sm text-gray-600">Complete steps to earn rewards and unlock features</p>
              </div>
              <div className="p-4 bg-pink-50 rounded-lg">
                <Sparkles className="w-8 h-8 text-pink-600 mb-2" />
                <h3 className="font-semibold">Create Amazing Content</h3>
                <p className="text-sm text-gray-600">Generate stunning AI-powered content in minutes</p>
              </div>
            </div>
          </div>
        )
      
      case 'profile_setup':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{step.icon}</div>
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              <p className="text-gray-600">Tell us a bit about yourself</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                  placeholder="City, Country"
                />
              </div>
              
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )
      
      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{step.icon}</div>
              <h2 className="text-2xl font-bold">Set Your Preferences</h2>
              <p className="text-gray-600">Customize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label>Experience Level</Label>
                <Select value={preferences.experienceLevel} onValueChange={(value) => setPreferences({...preferences, experienceLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Primary Use Case</Label>
                <Select value={preferences.primaryUseCase} onValueChange={(value) => setPreferences({...preferences, primaryUseCase: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="What will you use EDN for?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="content_creation">Content Creation</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal Use</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Content Frequency</Label>
                <Select value={preferences.contentFrequency} onValueChange={(value) => setPreferences({...preferences, contentFrequency: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often will you create content?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="occasionally">Occasionally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Budget Range</Label>
                <Select value={preferences.budgetRange} onValueChange={(value) => setPreferences({...preferences, budgetRange: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's your budget range?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="low">Low ($1-25/month)</SelectItem>
                    <SelectItem value="medium">Medium ($25-100/month)</SelectItem>
                    <SelectItem value="high">High ($100+/month)</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Content Preference</Label>
                <Select value={preferences.nsfwPreference} onValueChange={(value) => setPreferences({...preferences, nsfwPreference: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="What type of content do you prefer?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sfw">SFW Only</SelectItem>
                    <SelectItem value="nsfw">NSFW Only</SelectItem>
                    <SelectItem value="both">Both SFW & NSFW</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, emailNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Push Notifications</Label>
                  <Switch
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences({...preferences, pushNotifications: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label>Marketing Emails</Label>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => setPreferences({...preferences, marketingEmails: checked})}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'content_tutorial':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{step.icon}</div>
              <h2 className="text-2xl font-bold">Content Creation Tutorial</h2>
              <p className="text-gray-600">Learn how to create amazing AI content</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎨 AI Image Generation</h3>
                <p className="text-sm text-gray-600">Create stunning images with advanced AI models. Simply describe what you want to create, and our AI will bring it to life.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-2">🎥 Video Generation</h3>
                <p className="text-sm text-gray-600">Generate high-quality videos from text descriptions. Perfect for social media content and marketing materials.</p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold mb-2">✨ Content Enhancement</h3>
                <p className="text-sm text-gray-600">Enhance your existing content with AI-powered upscaling, style transfer, and quality improvements.</p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Quick Start Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be descriptive in your prompts for better results</li>
                  <li>• Experiment with different styles and models</li>
                  <li>• Use negative prompts to exclude unwanted elements</li>
                  <li>• Save your favorite prompts for quick access</li>
                </ul>
              </div>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="text-center space-y-4">
            <div className="text-4xl">{step.icon}</div>
            <h2 className="text-2xl font-bold">{step.name}</h2>
            <p className="text-gray-600">{step.description}</p>
            <p className="text-sm text-gray-500">This step will be implemented soon...</p>
          </div>
        )
    }
  }

  const currentStep = steps[currentStepIndex]
  
  if (loading && !steps.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to EDN</h1>
          <p className="text-gray-600">Let's get you set up with a personalized experience</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-400 bg-green-400/10">
            <AlertDescription className="text-green-400">{success}</AlertDescription>
          </Alert>
        )}

        {/* Progress Overview */}
        {progress && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Progress</span>
                <Badge className="bg-purple-500">
                  <Star className="w-3 h-3 mr-1" />
                  {progress.pointsEarned} points
                </Badge>
              </CardTitle>
              <CardDescription>
                {progress.completedStepsCount} of {progress.totalSteps} steps completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={progress.progressPercentage} className="h-2" />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progress.progressPercentage}% Complete</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {progress.estimatedCompletionTime}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Navigation */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Onboarding Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentStepIndex
                      ? 'bg-purple-100 border-purple-500 border-2'
                      : step.isCompleted
                      ? 'bg-green-50 hover:bg-green-100'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {step.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{step.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {step.estimatedTime}m
                      </div>
                    </div>
                    {step.pointsReward > 0 && (
                      <div className="flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          +{step.pointsReward}
                        </Badge>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Current Step Content */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{currentStep?.icon}</span>
                  <div>
                    <div className="text-lg font-semibold">{currentStep?.name}</div>
                    <div className="text-sm text-gray-600">{currentStep?.description}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {currentStep?.estimatedTime}m
                  </Badge>
                  {currentStep?.pointsReward > 0 && (
                    <Badge className="bg-yellow-500">
                      <Star className="w-3 h-3 mr-1" />
                      {currentStep?.pointsReward}
                    </Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="min-h-[400px]">
              {currentStep && renderStepContent(currentStep)}
            </CardContent>
            
            <div className="p-6 border-t bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => goToStep(currentStepIndex - 1)}
                    disabled={currentStepIndex === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  
                  {!currentStep?.isRequired && (
                    <Button
                      variant="outline"
                      onClick={() => setShowSkipConfirm(true)}
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Skip
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={completeCurrentStep}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentStepIndex === steps.length - 1 ? 'Complete Onboarding' : 'Continue'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Skip Confirmation Dialog */}
      {showSkipConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Skip Step?</CardTitle>
              <CardDescription>
                Are you sure you want to skip "{currentStep?.name}"? You can always come back to it later.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 justify-end">
                <Button variant="outline" onClick={() => setShowSkipConfirm(false)}>
                  Cancel
                </Button>
                <Button onClick={skipCurrentStep} disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Skip Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}