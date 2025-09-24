/**
 * Enhanced Authentication Service
 * Complete Supabase authentication with email verification, social logins, and security features
 */

import { createClient } from '@/lib/supabase-client'
import { db } from '@/lib/db'
import { getSupabaseConfig, getAuthConfig, isDevelopment } from '@/lib/config'

export interface AuthUser {
  id: string
  email: string
  name?: string
  avatar?: string
  emailVerified: boolean
  role: string
  isPaidMember: boolean
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResult {
  success: boolean
  user?: AuthUser
  error?: string
  message?: string
  requiresVerification?: boolean
}

export interface SocialProvider {
  id: string
  name: string
  icon: string
  enabled: boolean
}

export interface SecuritySettings {
  passwordMinLength: number
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
  maxLoginAttempts: number
  lockoutDuration: number // in minutes
  sessionTimeout: number // in hours
  enable2FA: boolean
}

class EnhancedAuthService {
  private supabase = createClient()
  private securitySettings: SecuritySettings

  constructor() {
    this.securitySettings = {
      passwordMinLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 24,
      enable2FA: false
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResult> {
    try {
      // Validate password strength
      const passwordValidation = this.validatePassword(password)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: 'Password does not meet requirements',
          message: passwordValidation.message
        }
      }

      // Check if user already exists
      const existingUser = await db.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return {
          success: false,
          error: 'User already exists',
          message: 'An account with this email already exists'
        }
      }

      // Create Supabase auth user
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0]
          },
          emailRedirectTo: `${this.getRedirectUrl()}/auth/callback`
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'Failed to create account'
        }
      }

      // Create user in database
      if (data.user) {
        await db.user.create({
          data: {
            id: data.user.id,
            email: data.user.email!,
            name: name || data.user.user_metadata?.name || email.split('@')[0],
            emailVerified: false,
            onboardingCompleted: false
          }
        })

        return {
          success: true,
          message: 'Account created successfully. Please check your email for verification.',
          requiresVerification: true
        }
      }

      return {
        success: false,
        error: 'Unknown error occurred',
        message: 'Failed to create account'
      }

    } catch (error) {
      console.error('Sign up error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      // Check if user exists and is not locked out
      const user = await db.user.findUnique({
        where: { email }
      })

      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password'
        }
      }

      // Check if account is locked
      if (this.isAccountLocked(user)) {
        return {
          success: false,
          error: 'Account locked',
          message: 'Account is temporarily locked due to too many failed attempts'
        }
      }

      // Sign in with Supabase
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Increment failed login attempts
        await this.incrementFailedAttempts(user.id)
        return {
          success: false,
          error: error.message,
          message: 'Invalid email or password'
        }
      }

      // Reset failed attempts on successful login
      await this.resetFailedAttempts(user.id)

      // Update user data
      await db.user.update({
        where: { id: user.id },
        data: {
          emailVerified: data.user?.email_confirmed_at !== null,
          lastLoginAt: new Date()
        }
      })

      return {
        success: true,
        user: this.mapAuthUser(user),
        message: 'Signed in successfully'
      }

    } catch (error) {
      console.error('Sign in error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Sign in with social provider
   */
  async signInWithSocial(provider: string): Promise<string> {
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${this.getRedirectUrl()}/auth/callback`
      }
    })

    if (error) {
      throw new Error(`Failed to sign in with ${provider}: ${error.message}`)
    }

    return data.url
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut()
    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`)
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()
      
      if (error || !user) {
        return null
      }

      // Get user from database
      const dbUser = await db.user.findUnique({
        where: { id: user.id }
      })

      if (!dbUser) {
        return null
      }

      return this.mapAuthUser(dbUser)

    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${this.getRedirectUrl()}/auth/callback`
        }
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'Failed to resend verification email'
        }
      }

      return {
        success: true,
        message: 'Verification email resent successfully'
      }

    } catch (error) {
      console.error('Resend verification error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AuthResult> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${this.getRedirectUrl()}/auth/reset-password`
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'Failed to send reset password email'
        }
      }

      return {
        success: true,
        message: 'Reset password email sent successfully'
      }

    } catch (error) {
      console.error('Reset password error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      // Validate password strength
      const passwordValidation = this.validatePassword(newPassword)
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: 'Password does not meet requirements',
          message: passwordValidation.message
        }
      }

      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          success: false,
          error: error.message,
          message: 'Failed to update password'
        }
      }

      return {
        success: true,
        message: 'Password updated successfully'
      }

    } catch (error) {
      console.error('Update password error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: {
    name?: string
    avatar?: string
    bio?: string
  }): Promise<AuthResult> {
    try {
      const updateData: any = {}
      
      if (updates.name) updateData.name = updates.name
      if (updates.avatar) updateData.avatar = updates.avatar
      if (updates.bio !== undefined) updateData.bio = updates.bio

      await db.user.update({
        where: { id: userId },
        data: updateData
      })

      // Update Supabase user metadata if name is updated
      if (updates.name) {
        await this.supabase.auth.updateUser({
          data: { name: updates.name }
        })
      }

      const updatedUser = await db.user.findUnique({
        where: { id: userId }
      })

      return {
        success: true,
        user: updatedUser ? this.mapAuthUser(updatedUser) : undefined,
        message: 'Profile updated successfully'
      }

    } catch (error) {
      console.error('Update profile error:', error)
      return {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      }
    }
  }

  /**
   * Get available social providers
   */
  getSocialProviders(): SocialProvider[] {
    const enabledProviders = getAuthConfig().providers
    const allProviders: SocialProvider[] = [
      { id: 'google', name: 'Google', icon: 'google', enabled: enabledProviders.includes('google') },
      { id: 'github', name: 'GitHub', icon: 'github', enabled: enabledProviders.includes('github') },
      { id: 'twitter', name: 'Twitter', icon: 'twitter', enabled: enabledProviders.includes('twitter') },
      { id: 'facebook', name: 'Facebook', icon: 'facebook', enabled: enabledProviders.includes('facebook') },
      { id: 'apple', name: 'Apple', icon: 'apple', enabled: enabledProviders.includes('apple') }
    ]

    return allProviders.filter(provider => provider.enabled)
  }

  /**
   * Validate password strength
   */
  private validatePassword(password: string): { isValid: boolean; message: string } {
    const errors: string[] = []

    if (password.length < this.securitySettings.passwordMinLength) {
      errors.push(`Password must be at least ${this.securitySettings.passwordMinLength} characters long`)
    }

    if (this.securitySettings.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (this.securitySettings.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (this.securitySettings.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (this.securitySettings.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    return {
      isValid: errors.length === 0,
      message: errors.join('. ')
    }
  }

  /**
   * Check if account is locked
   */
  private isAccountLocked(user: any): boolean {
    if (!user.failedLoginAttempts || !user.lastFailedLoginAt) {
      return false
    }

    if (user.failedLoginAttempts >= this.securitySettings.maxLoginAttempts) {
      const lockoutTime = new Date(user.lastFailedLoginAt)
      lockoutTime.setMinutes(lockoutTime.getMinutes() + this.securitySettings.lockoutDuration)
      
      return new Date() < lockoutTime
    }

    return false
  }

  /**
   * Increment failed login attempts
   */
  private async incrementFailedAttempts(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: {
          increment: 1
        },
        lastFailedLoginAt: new Date()
      }
    })
  }

  /**
   * Reset failed login attempts
   */
  private async resetFailedAttempts(userId: string): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: {
        failedLoginAttempts: 0,
        lastFailedLoginAt: null
      }
    })
  }

  /**
   * Map database user to auth user
   */
  private mapAuthUser(dbUser: any): AuthUser {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      avatar: dbUser.avatar,
      emailVerified: dbUser.emailVerified,
      role: dbUser.role,
      isPaidMember: dbUser.isPaidMember,
      onboardingCompleted: dbUser.onboardingCompleted,
      createdAt: dbUser.createdAt,
      updatedAt: dbUser.updatedAt
    }
  }

  /**
   * Get redirect URL based on environment
   */
  private getRedirectUrl(): string {
    if (isDevelopment()) {
      return 'http://localhost:3000'
    }
    return process.env.NEXT_PUBLIC_BASE_URL || 'https://your-domain.com'
  }
}

// Export singleton instance
export const enhancedAuth = new EnhancedAuthService()

// Export types
export type { AuthUser, AuthResult, SocialProvider, SecuritySettings }