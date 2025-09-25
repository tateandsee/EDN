import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth'

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Alex Creator',
    username: '@alexcreator',
    avatar: '/avatars/alex.jpg',
    bio: 'Digital artist and AI enthusiast. Creating stunning content with cutting-edge technology.',
    followers: 15420,
    following: 342,
    posts: 89,
    isVerified: true,
    isFollowing: false,
    joinDate: '2023-06-15',
    location: 'Los Angeles, CA',
    website: 'https://alexcreator.com'
  },
  {
    id: '2',
    name: 'Sarah AI',
    username: '@sarahai',
    avatar: '/avatars/sarah.jpg',
    bio: 'Machine learning engineer and content creator. Passionate about AI art and generative models.',
    followers: 8750,
    following: 567,
    posts: 124,
    isVerified: true,
    isFollowing: true,
    joinDate: '2023-03-20',
    location: 'San Francisco, CA'
  }
]

// Mock posts data
const mockPosts = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Just finished training my new custom AI model! The results are incredible - 95% accuracy on face cloning with real-time processing. Who wants to see a demo? 🚀 #AI #MachineLearning #FaceCloning',
    images: ['/posts/ai-demo-1.jpg', '/posts/ai-demo-2.jpg'],
    likes: 342,
    comments: 28,
    shares: 15,
    timestamp: '2 hours ago',
    isLiked: false,
    isSaved: false,
    tags: ['AI', 'MachineLearning', 'FaceCloning']
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'Excited to share my latest project: a voice synthesis model that can generate emotional speech in 5 languages! The quality is amazing. Check out the sample video below. 🎤 #VoiceAI #Multilingual #DeepLearning',
    video: '/posts/voice-demo.mp4',
    likes: 567,
    comments: 42,
    shares: 23,
    timestamp: '5 hours ago',
    isLiked: true,
    isSaved: true,
    tags: ['VoiceAI', 'Multilingual', 'DeepLearning']
  }
]

// Mock groups data
const mockGroups = [
  {
    id: '1',
    name: 'AI Artists Collective',
    description: 'A community for artists using AI tools to create stunning digital art and push creative boundaries.',
    members: 15420,
    isPrivate: false,
    coverImage: '/groups/ai-artists.jpg',
    category: 'Art & Design',
    isJoined: true,
    admin: mockUsers[0]
  },
  {
    id: '2',
    name: 'Machine Learning Engineers',
    description: 'Professional network for ML engineers working on cutting-edge AI models and applications.',
    members: 8750,
    isPrivate: true,
    coverImage: '/groups/ml-engineers.jpg',
    category: 'Technology',
    isJoined: false,
    admin: mockUsers[1]
  }
]

// Mock forums data
const mockForums = [
  {
    id: '1',
    title: 'AI Model Training',
    description: 'Discuss techniques, share experiences, and get help with training custom AI models.',
    category: 'Technical',
    threads: 342,
    posts: 1542,
    lastActivity: '5 minutes ago',
    isActive: true
  },
  {
    id: '2',
    title: 'Content Creation Tips',
    description: 'Share your best practices and learn new techniques for creating engaging content.',
    category: 'General',
    threads: 567,
    posts: 2341,
    lastActivity: '1 hour ago',
    isActive: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    switch (type) {
      case 'feed':
        const feedPosts = mockPosts.slice(offset, offset + limit)
        return NextResponse.json({
          posts: feedPosts,
          total: mockPosts.length,
          hasMore: offset + limit < mockPosts.length
        })

      case 'users':
        const users = mockUsers.slice(offset, offset + limit)
        return NextResponse.json({
          users,
          total: mockUsers.length,
          hasMore: offset + limit < mockUsers.length
        })

      case 'groups':
        const groups = mockGroups.slice(offset, offset + limit)
        return NextResponse.json({
          groups,
          total: mockGroups.length,
          hasMore: offset + limit < mockGroups.length
        })

      case 'forums':
        const forums = mockForums.slice(offset, offset + limit)
        return NextResponse.json({
          forums,
          total: mockForums.length,
          hasMore: offset + limit < mockForums.length
        })

      case 'stats':
        return NextResponse.json({
          totalUsers: mockUsers.length,
          totalPosts: mockPosts.length,
          totalGroups: mockGroups.length,
          totalForums: mockForums.length,
          totalFollowers: mockUsers.reduce((acc, user) => acc + user.followers, 0),
          activeGroups: mockGroups.filter(g => g.isJoined).length
        })

      case 'trending':
        return NextResponse.json({
          trendingPosts: mockPosts.slice(0, 5),
          trendingUsers: mockUsers.slice(0, 5),
          trendingGroups: mockGroups.slice(0, 3)
        })

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

  } catch (error) {
    console.error('Social GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'create_post':
        const { content, images, video, tags } = data
        
        if (!content?.trim()) {
          return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        // Simulate post creation
        await new Promise(resolve => setTimeout(resolve, 500))

        const newPost = {
          id: `post_${Date.now()}`,
          author: mockUsers[0], // Current user
          content,
          images: images || [],
          video: video || null,
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: 'Just now',
          isLiked: false,
          isSaved: false,
          tags: tags || []
        }

        return NextResponse.json({
          message: 'Post created successfully',
          post: newPost
        }, { status: 201 })

      case 'create_group':
        const { name, description, isPrivate, category } = data
        
        if (!name || !description || !category) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Simulate group creation
        await new Promise(resolve => setTimeout(resolve, 1000))

        const newGroup = {
          id: `group_${Date.now()}`,
          name,
          description,
          members: 1,
          isPrivate,
          coverImage: '/groups/default.jpg',
          category,
          isJoined: true,
          admin: mockUsers[0]
        }

        return NextResponse.json({
          message: 'Group created successfully',
          group: newGroup
        }, { status: 201 })

      case 'create_forum_thread':
        const { forumId, title, content: threadContent } = data
        
        if (!forumId || !title || !threadContent) {
          return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        // Simulate thread creation
        await new Promise(resolve => setTimeout(resolve, 800))

        return NextResponse.json({
          message: 'Thread created successfully',
          threadId: `thread_${Date.now()}`,
          forumId
        }, { status: 201 })

      case 'like_post':
        const { postId } = data
        
        if (!postId) {
          return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        // Simulate like action
        await new Promise(resolve => setTimeout(resolve, 200))

        return NextResponse.json({
          message: 'Post liked successfully',
          postId,
          liked: true
        })

      case 'unlike_post':
        const { unlikePostId } = data
        
        if (!unlikePostId) {
          return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        // Simulate unlike action
        await new Promise(resolve => setTimeout(resolve, 200))

        return NextResponse.json({
          message: 'Post unliked successfully',
          postId: unlikePostId,
          liked: false
        })

      case 'follow_user':
        const { userId } = data
        
        if (!userId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Simulate follow action
        await new Promise(resolve => setTimeout(resolve, 300))

        return NextResponse.json({
          message: 'User followed successfully',
          userId,
          following: true
        })

      case 'unfollow_user':
        const { unfollowUserId } = data
        
        if (!unfollowUserId) {
          return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
        }

        // Simulate unfollow action
        await new Promise(resolve => setTimeout(resolve, 300))

        return NextResponse.json({
          message: 'User unfollowed successfully',
          userId: unfollowUserId,
          following: false
        })

      case 'join_group':
        const { groupId } = data
        
        if (!groupId) {
          return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
        }

        // Simulate join action
        await new Promise(resolve => setTimeout(resolve, 400))

        return NextResponse.json({
          message: 'Group joined successfully',
          groupId,
          joined: true
        })

      case 'leave_group':
        const { leaveGroupId } = data
        
        if (!leaveGroupId) {
          return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
        }

        // Simulate leave action
        await new Promise(resolve => setTimeout(resolve, 400))

        return NextResponse.json({
          message: 'Group left successfully',
          groupId: leaveGroupId,
          joined: false
        })

      case 'save_post':
        const { savePostId } = data
        
        if (!savePostId) {
          return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        // Simulate save action
        await new Promise(resolve => setTimeout(resolve, 200))

        return NextResponse.json({
          message: 'Post saved successfully',
          postId: savePostId,
          saved: true
        })

      case 'unsave_post':
        const { unsavePostId } = data
        
        if (!unsavePostId) {
          return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        // Simulate unsave action
        await new Promise(resolve => setTimeout(resolve, 200))

        return NextResponse.json({
          message: 'Post unsaved successfully',
          postId: unsavePostId,
          saved: false
        })

      case 'comment_post':
        const { commentPostId, commentContent } = data
        
        if (!commentPostId || !commentContent?.trim()) {
          return NextResponse.json({ error: 'Post ID and content are required' }, { status: 400 })
        }

        // Simulate comment creation
        await new Promise(resolve => setTimeout(resolve, 600))

        return NextResponse.json({
          message: 'Comment added successfully',
          postId: commentPostId,
          commentId: `comment_${Date.now()}`,
          content: commentContent
        }, { status: 201 })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Social POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, id, updates } = body

    if (!type || !id || !updates) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Simulate update operation
    await new Promise(resolve => setTimeout(resolve, 500))

    switch (type) {
      case 'post':
        return NextResponse.json({
          message: 'Post updated successfully',
          postId: id,
          updates
        })

      case 'group':
        return NextResponse.json({
          message: 'Group updated successfully',
          groupId: id,
          updates
        })

      case 'user_profile':
        return NextResponse.json({
          message: 'Profile updated successfully',
          userId: id,
          updates
        })

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Social PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await authService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Simulate deletion
    await new Promise(resolve => setTimeout(resolve, 500))

    switch (type) {
      case 'post':
        return NextResponse.json({ message: 'Post deleted successfully' })
      
      case 'group':
        return NextResponse.json({ message: 'Group deleted successfully' })
      
      case 'comment':
        return NextResponse.json({ message: 'Comment deleted successfully' })
      
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Social DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}