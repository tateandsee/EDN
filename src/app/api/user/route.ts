import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Mock user data - in a real app, this would come from a database
const mockUsers = [
  {
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
  },
  {
    id: '2',
    username: 'aiartist',
    email: 'aiartist@example.com',
    displayName: 'AI Artist',
    bio: 'Digital artist exploring the intersection of AI and creativity. Specializing in generative art and machine learning.',
    avatar: '/placeholder-avatar.jpg',
    coverImage: '/placeholder-cover.jpg',
    location: 'San Francisco, CA',
    website: 'https://aiartist.com',
    joinedDate: new Date('2023-03-20'),
    isVerified: false,
    isPremium: false,
    stats: {
      contentCount: 89,
      followers: 5670,
      following: 123,
      totalViews: 1240000,
      totalDownloads: 23400,
      averageRating: 4.6
    },
    socialLinks: {
      twitter: '@aiartist',
      instagram: '@aiartist',
      youtube: '@aiartist'
    },
    preferences: {
      nsfwContent: false,
      emailNotifications: true,
      pushNotifications: false,
      showOnlineStatus: true,
      allowMessages: true
    },
    achievements: [
      {
        id: '1',
        title: 'Content Creator',
        description: 'Created your first piece of content',
        icon: '🎨',
        unlockedAt: new Date('2023-03-20'),
        category: 'content'
      },
      {
        id: '2',
        title: 'Rising Star',
        description: 'Reached 1000 followers',
        icon: '⭐',
        unlockedAt: new Date('2023-06-15'),
        category: 'social'
      }
    ]
  }
]

// Helper function to find user by ID
const findUserById = (id: string) => mockUsers.find(user => user.id === id)

// Helper function to find user by username
const findUserByUsername = (username: string) => mockUsers.find(user => user.username === username)

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const username = searchParams.get('username')
    const action = searchParams.get('action')

    // Get current user profile
    if (!userId && !username && !action) {
      // Simulate current user - in real app, this would come from session
      const currentUser = mockUsers[0]
      
      if (!currentUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          ...currentUser,
          joinedDate: currentUser.joinedDate.toISOString(),
          subscription: currentUser.subscription ? {
            ...currentUser.subscription,
            expiresAt: currentUser.subscription.expiresAt.toISOString()
          } : undefined,
          achievements: currentUser.achievements.map(achievement => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt.toISOString()
          }))
        }
      })
    }

    // Get user by ID
    if (userId) {
      const user = findUserById(userId)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          ...user,
          joinedDate: user.joinedDate.toISOString(),
          subscription: user.subscription ? {
            ...user.subscription,
            expiresAt: user.subscription.expiresAt.toISOString()
          } : undefined,
          achievements: user.achievements.map(achievement => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt.toISOString()
          }))
        }
      })
    }

    // Get user by username
    if (username) {
      const user = findUserByUsername(username)
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({
        user: {
          ...user,
          joinedDate: user.joinedDate.toISOString(),
          subscription: user.subscription ? {
            ...user.subscription,
            expiresAt: user.subscription.expiresAt.toISOString()
          } : undefined,
          achievements: user.achievements.map(achievement => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt.toISOString()
          }))
        }
      })
    }

    // Handle different actions
    switch (action) {
      case 'followers':
        const targetUserId = searchParams.get('targetUserId')
        if (!targetUserId) {
          return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
        }
        
        // Mock followers data
        const mockFollowers = mockUsers.filter(u => u.id !== targetUserId).slice(0, 5)
        return NextResponse.json({
          followers: mockFollowers.map(user => ({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            isVerified: user.isVerified,
            stats: {
              followers: user.stats.followers,
              contentCount: user.stats.contentCount
            }
          }))
        })

      case 'following':
        const followingUserId = searchParams.get('targetUserId')
        if (!followingUserId) {
          return NextResponse.json({ error: 'Target user ID required' }, { status: 400 })
        }
        
        // Mock following data
        const mockFollowing = mockUsers.filter(u => u.id !== followingUserId).slice(0, 3)
        return NextResponse.json({
          following: mockFollowing.map(user => ({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            isVerified: user.isVerified,
            stats: {
              followers: user.stats.followers,
              contentCount: user.stats.contentCount
            }
          }))
        })

      case 'search':
        const searchQuery = searchParams.get('q') || ''
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        
        const searchResults = mockUsers.filter(user =>
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.bio.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        const startIndex = (page - 1) * limit
        const endIndex = startIndex + limit
        const paginatedResults = searchResults.slice(startIndex, endIndex)
        
        return NextResponse.json({
          users: paginatedResults.map(user => ({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
            bio: user.bio,
            isVerified: user.isVerified,
            isPremium: user.isPremium,
            stats: {
              followers: user.stats.followers,
              contentCount: user.stats.contentCount,
              averageRating: user.stats.averageRating
            }
          })),
          total: searchResults.length,
          page,
          limit,
          hasMore: endIndex < searchResults.length
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('User GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    // Simulate current user
    const currentUser = mockUsers[0]
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    switch (action) {
      case 'update_profile':
        const { displayName, bio, location, website, socialLinks } = data
        
        // Update user profile (in real app, this would update database)
        Object.assign(currentUser, {
          displayName: displayName || currentUser.displayName,
          bio: bio || currentUser.bio,
          location: location || currentUser.location,
          website: website || currentUser.website,
          socialLinks: socialLinks || currentUser.socialLinks
        })

        return NextResponse.json({
          message: 'Profile updated successfully',
          user: {
            ...currentUser,
            joinedDate: currentUser.joinedDate.toISOString(),
            subscription: currentUser.subscription ? {
              ...currentUser.subscription,
              expiresAt: currentUser.subscription.expiresAt.toISOString()
            } : undefined,
            achievements: currentUser.achievements.map(achievement => ({
              ...achievement,
              unlockedAt: achievement.unlockedAt.toISOString()
            }))
          }
        })

      case 'update_preferences':
        const { preferences } = data
        
        // Update user preferences
        Object.assign(currentUser.preferences, preferences)

        return NextResponse.json({
          message: 'Preferences updated successfully',
          preferences: currentUser.preferences
        })

      case 'change_password':
        const { currentPassword, newPassword } = data
        
        // Simulate password change (in real app, this would verify and update password)
        if (!currentPassword || !newPassword) {
          return NextResponse.json({ error: 'Current and new passwords required' }, { status: 400 })
        }

        return NextResponse.json({
          message: 'Password changed successfully'
        })

      case 'follow':
        const { targetUserId } = data
        
        // Simulate follow action
        const targetUser = findUserById(targetUserId)
        if (!targetUser) {
          return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
        }

        // Update follower counts (in real app, this would create follow relationship)
        currentUser.stats.following += 1
        targetUser.stats.followers += 1

        return NextResponse.json({
          message: 'User followed successfully',
          following: currentUser.stats.following
        })

      case 'unfollow':
        const { targetUserId: unfollowTargetId } = data
        
        // Simulate unfollow action
        const unfollowTarget = findUserById(unfollowTargetId)
        if (!unfollowTarget) {
          return NextResponse.json({ error: 'Target user not found' }, { status: 404 })
        }

        // Update follower counts
        currentUser.stats.following = Math.max(0, currentUser.stats.following - 1)
        unfollowTarget.stats.followers = Math.max(0, unfollowTarget.stats.followers - 1)

        return NextResponse.json({
          message: 'User unfollowed successfully',
          following: currentUser.stats.following
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('User PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simulate account deletion
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      message: 'Account deleted successfully'
    })
  } catch (error) {
    console.error('User DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}