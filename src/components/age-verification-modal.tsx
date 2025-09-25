'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNSFW } from '@/contexts/nsfw-context'
import { useAuth } from '@/contexts/auth-context'
import { Shield, AlertTriangle, Calendar, Eye, Lock } from 'lucide-react'

export default function AgeVerificationModal() {
  const { isAgeVerified, setAgeVerified, showAgeVerification, setShowAgeVerification, setIsNSFW } = useNSFW()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVerify = async () => {
    setIsProcessing(true)
    // Simulate verification process
    setTimeout(() => {
      setAgeVerified(true)
      setShowAgeVerification(false)
      setIsProcessing(false)
    }, 1000)
  }

  const handleCancel = () => {
    setShowAgeVerification(false)
    setIsNSFW(false)
  }

  if (!showAgeVerification) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        {/* Background blur effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-purple-900/20 rounded-2xl backdrop-blur-sm"></div>
        
        <Card className="relative bg-black/90 border-pink-500/30 text-white overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-pink-600/20 rounded-full">
                <Shield className="h-8 w-8 text-pink-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-pink-400">
              Age Verification Required
            </CardTitle>
            <CardDescription className="text-pink-200">
              You must be 18+ to access NSFW content
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Warning Section */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-400 mb-1">Adult Content Warning</h3>
                  <p className="text-sm text-red-200">
                    This section contains explicit adult content including nude and semi-nude models. 
                    By proceeding, you confirm you are at least 18 years old.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Guidelines */}
            <div className="space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Eye className="h-4 w-4 text-pink-400" />
                Content Guidelines
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Women aged 18-40 years</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Nude and semi-nude content</span>
                </div>
                <div className="flex items-center gap-2 text-green-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Sexy and erotic scenarios</span>
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>No animals or children</span>
                </div>
                <div className="flex items-center gap-2 text-red-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span>No men or pain/death content</span>
                </div>
              </div>
            </div>

            {/* Authentication Notice */}
            {!user && (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-400 mb-1">Sign In Required</h3>
                    <p className="text-sm text-blue-200">
                      You must be signed in to access NSFW content. 
                      Please sign in first, then return to verify your age.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {user ? (
                <Button 
                  onClick={handleVerify}
                  disabled={isProcessing}
                  className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      I am 18+ years old
                    </div>
                  )}
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    window.location.href = '/auth/signin'
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                >
                  Sign In First
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={handleCancel}
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Cancel
              </Button>
            </div>

            {/* Legal Notice */}
            <div className="text-xs text-gray-400 text-center">
              <p>
                By proceeding, you confirm that you are at least 18 years old and 
                agree to our Terms of Service and Content Policy.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}