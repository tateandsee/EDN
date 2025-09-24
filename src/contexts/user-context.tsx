'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, Edit, Camera, Shield, Star, Download, Eye, Calendar, MapPin, Link, Mail, Phone, Globe, Award, TrendingUp } from 'lucide-react'

export interface UserProfile {
  id: string
  username: string
  email: string
  displayName: string
  bio: string
  avatar: string
  coverImage: string
  location: string
  website: string
  joinedDate: Date
  isVerified: boolean
  isPremium: boolean
  stats: {
    contentCount: number
    followers: number
    following: number
    totalViews: number
    totalDownloads: number
    averageRating: number
  }
  socialLinks: {
    twitter?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    onlyfans?: string
    fansly?: string
  }
  preferences: {
    nsfwContent: boolean
    emailNotifications: boolean
    pushNotifications: boolean
    showOnlineStatus: boolean
    allowMessages: boolean
  }
  subscription?: {
    plan: string
    expiresAt: Date
    autoRenew: boolean
  }
  achievements: Achievement[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: Date
  category: 'content' | 'social' | 'premium' | 'technical'
}

interface UserContextType {
  profile: UserProfile | null
  isLoading: boolean
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  uploadAvatar: (file: File) => Promise<string>
  uploadCoverImage: (file: File) => Promise<string>
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  isFollowing: (userId: string) => boolean
  getFollowers: (userId: string) => Promise<UserProfile[]>
  getFollowing: (userId: string) => Promise<UserProfile[]>
  getUserContent: (userId: string) => Promise<any[]>
  updatePreferences: (preferences: Partial<UserProfile['preferences']>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user profile on mount
  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user profile data
      const mockProfile: UserProfile = {
        id: '1',
        username: 'digitalcreatorpro',
        email: 'creator@example.com',
        displayName: 'Digital Creator Pro',
        bio: 'Professional AI content creator specializing in photorealistic portraits and cinematic videos. Passionate about pushing the boundaries of AI-generated art.',
        avatar: '/placeholder-avatar.jpg',
        coverImage: '/placeholder-cover.jpg',
        location: 'Los Angeles, CA',
        website: 'https://digitalcreatorpro.com',
        joinedDate: new Date('2023-01-15'),
        isVerified: true,
        isPremium: true,
        stats: {
          contentCount: 156,
          followers: 12450,
          following: 89,
          totalViews: 2890000,
          totalDownloads: 45600,
          averageRating: 4.8
        },
        socialLinks: {
          twitter: '@digitalcreatorpro',
          instagram: '@digitalcreatorpro',
          youtube: '@digitalcreatorpro',
          onlyfans: '@digitalcreatorpro'
        },
        preferences: {
          nsfwContent: true,
          emailNotifications: true,
          pushNotifications: true,
          showOnlineStatus: true,
          allowMessages: true
        },
        subscription: {
          plan: 'premium',
          expiresAt: new Date('2024-12-31'),
          autoRenew: true
        },
        achievements: [
          {
            id: '1',
            title: 'Content Creator',
            description: 'Created your first piece of content',
            icon: '🎨',
            unlockedAt: new Date('2023-01-15'),
            category: 'content'
          },
          {
            id: '2',
            title: 'Rising Star',
            description: 'Reached 1000 followers',
            icon: '⭐',
            unlockedAt: new Date('2023-03-20'),
            category: 'social'
          },
          {
            id: '3',
            title: 'Premium Member',
            description: 'Upgraded to premium subscription',
            icon: '💎',
            unlockedAt: new Date('2023-02-01'),
            category: 'premium'
          },
          {
            id: '4',
            title: 'Master Creator',
            description: 'Created 100+ pieces of content',
            icon: '🏆',
            unlockedAt: new Date('2023-08-15'),
            category: 'content'
          }
        ]
      }
      
      setProfile(mockProfile)
    } catch (error) {
      console.error('Error loading user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  const uploadAvatar = async (file: File) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return mock URL
      const avatarUrl = `/avatar-${Date.now()}.jpg`
      await updateProfile({ avatar: avatarUrl })
      
      return avatarUrl
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error
    }
  }

  const uploadCoverImage = async (file: File) => {
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Return mock URL
      const coverUrl = `/cover-${Date.now()}.jpg`
      await updateProfile({ coverImage: coverUrl })
      
      return coverUrl
    } catch (error) {
      console.error('Error uploading cover image:', error)
      throw error
    }
  }

  const followUser = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update follower count
      if (profile) {
        await updateProfile({
          stats: {
            ...profile.stats,
            following: profile.stats.following + 1
          }
        })
      }
    } catch (error) {
      console.error('Error following user:', error)
      throw error
    }
  }

  const unfollowUser = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Update follower count
      if (profile) {
        await updateProfile({
          stats: {
            ...profile.stats,
            following: Math.max(0, profile.stats.following - 1)
          }
        })
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
      throw error
    }
  }

  const isFollowing = (userId: string) => {
    // Mock implementation - in real app, this would check against following list
    return false
  }

  const getFollowers = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock followers
      return []
    } catch (error) {
      console.error('Error getting followers:', error)
      throw error
    }
  }

  const getFollowing = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock following
      return []
    } catch (error) {
      console.error('Error getting following:', error)
      throw error
    }
  }

  const getUserContent = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Return mock content
      return []
    } catch (error) {
      console.error('Error getting user content:', error)
      throw error
    }
  }

  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    if (!profile) return

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      await updateProfile({
        preferences: { ...profile.preferences, ...preferences }
      })
    } catch (error) {
      console.error('Error updating preferences:', error)
      throw error
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Password change logic would go here
    } catch (error) {
      console.error('Error changing password:', error)
      throw error
    }
  }

  const deleteAccount = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Account deletion logic would go here
      setProfile(null)
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }

  return (
    <UserContext.Provider value={{
      profile,
      isLoading,
      updateProfile,
      uploadAvatar,
      uploadCoverImage,
      followUser,
      unfollowUser,
      isFollowing,
      getFollowers,
      getFollowing,
      getUserContent,
      updatePreferences,
      changePassword,
      deleteAccount
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// User Profile Components
export function UserProfileCard({ profile, isOwnProfile = false }: { profile: UserProfile; isOwnProfile?: boolean }) {
  const { followUser, unfollowUser, isFollowing } = useUser()
  const [isFollowingState, setIsFollowing] = useState(false)

  const handleFollowToggle = async () => {
    try {
      if (isFollowingState) {
        await unfollowUser(profile.id)
      } else {
        await followUser(profile.id)
      }
      setIsFollowingState(!isFollowingState)
    } catch (error) {
      console.error('Error toggling follow:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <img 
          src={profile.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        {isOwnProfile && (
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex items-end -mt-12 mb-4">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="w-24 h-24 rounded-full border-4 border-white bg-white"
            />
            {isOwnProfile && (
              <button className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-full hover:bg-primary/90 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            )}
          </div>
          
          <div className="flex-1 ml-4 mb-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              {profile.isVerified && (
                <Shield className="h-5 w-5 text-blue-500" />
              )}
              {profile.isPremium && (
                <Star className="h-5 w-5 text-yellow-500 fill-current" />
              )}
            </div>
            <p className="text-gray-600">@{profile.username}</p>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isFollowingState
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  : 'bg-primary text-white hover:bg-primary/90'
              }`}
            >
              {isFollowingState ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-700 mb-4">{profile.bio}</p>

        {/* Location and Website */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.location}
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-1">
              <Link className="h-4 w-4" />
              <a href={profile.website} className="text-blue-600 hover:underline">
                {profile.website}
              </a>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Joined {profile.joinedDate.toLocaleDateString()}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold">{formatNumber(profile.stats.contentCount)}</div>
            <div className="text-sm text-gray-600">Content</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{formatNumber(profile.stats.followers)}</div>
            <div className="text-sm text-gray-600">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{formatNumber(profile.stats.following)}</div>
            <div className="text-sm text-gray-600">Following</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{formatNumber(profile.stats.totalViews)}</div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-2">
          {profile.socialLinks.twitter && (
            <a href={`https://twitter.com/${profile.socialLinks.twitter}`} className="text-blue-400 hover:text-blue-600">
              <span className="sr-only">Twitter</span>
              𝕏
            </a>
          )}
          {profile.socialLinks.instagram && (
            <a href={`https://instagram.com/${profile.socialLinks.instagram}`} className="text-pink-600 hover:text-pink-800">
              <span className="sr-only">Instagram</span>
              📷
            </a>
          )}
          {profile.socialLinks.youtube && (
            <a href={`https://youtube.com/${profile.socialLinks.youtube}`} className="text-red-600 hover:text-red-800">
              <span className="sr-only">YouTube</span>
              📺
            </a>
          )}
          {profile.socialLinks.onlyfans && (
            <a href={`https://onlyfans.com/${profile.socialLinks.onlyfans}`} className="text-blue-600 hover:text-blue-800">
              <span className="sr-only">OnlyFans</span>
              🔞
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export function UserStats({ profile }: { profile: UserProfile }) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold">{formatNumber(profile.stats.totalViews)}</div>
        <div className="text-sm text-gray-600">Total Views</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold">{formatNumber(profile.stats.totalDownloads)}</div>
        <div className="text-sm text-gray-600">Downloads</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold">{profile.stats.averageRating}</div>
        <div className="text-sm text-gray-600">Average Rating</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Award className="h-6 w-6 text-purple-600" />
          </div>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="text-2xl font-bold">{profile.achievements.length}</div>
        <div className="text-sm text-gray-600">Achievements</div>
      </div>
    </div>
  )
}