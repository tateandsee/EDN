'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  followers: number
  following: number
  posts: number
  isVerified: boolean
  isFollowing: boolean
  joinDate: string
  location?: string
  website?: string
}

interface Post {
  id: string
  author: User
  content: string
  images?: string[]
  video?: string
  likes: number
  comments: number
  shares: number
  timestamp: string
  isLiked: boolean
  isSaved: boolean
  tags: string[]
}

interface Group {
  id: string
  name: string
  description: string
  members: number
  isPrivate: boolean
  coverImage: string
  category: string
  isJoined: boolean
  admin: User
}

interface Forum {
  id: string
  title: string
  description: string
  category: string
  threads: number
  posts: number
  lastActivity: string
  isActive: boolean
}

interface SocialState {
  posts: Post[]
  users: User[]
  groups: Group[]
  forums: Forum[]
  loading: boolean
  error: string | null
  stats: {
    totalUsers: number
    totalPosts: number
    totalGroups: number
    totalForums: number
    totalFollowers: number
    activeGroups: number
  }
  trending: {
    trendingPosts: Post[]
    trendingUsers: User[]
    trendingGroups: Group[]
  }
}

type SocialAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'SET_FORUMS'; payload: Forum[] }
  | { type: 'SET_STATS'; payload: SocialState['stats'] }
  | { type: 'SET_TRENDING'; payload: SocialState['trending'] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'REMOVE_POST'; payload: string }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; updates: Partial<User> } }
  | { type: 'REMOVE_USER'; payload: string }
  | { type: 'ADD_GROUP'; payload: Group }
  | { type: 'UPDATE_GROUP'; payload: { id: string; updates: Partial<Group> } }
  | { type: 'REMOVE_GROUP'; payload: string }

const initialState: SocialState = {
  posts: [],
  users: [],
  groups: [],
  forums: [],
  loading: false,
  error: null,
  stats: {
    totalUsers: 0,
    totalPosts: 0,
    totalGroups: 0,
    totalForums: 0,
    totalFollowers: 0,
    activeGroups: 0
  },
  trending: {
    trendingPosts: [],
    trendingUsers: [],
    trendingGroups: []
  }
}

function socialReducer(state: SocialState, action: SocialAction): SocialState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }

    case 'SET_POSTS':
      return { ...state, posts: action.payload }

    case 'SET_USERS':
      return { ...state, users: action.payload }

    case 'SET_GROUPS':
      return { ...state, groups: action.payload }

    case 'SET_FORUMS':
      return { ...state, forums: action.payload }

    case 'SET_STATS':
      return { ...state, stats: action.payload }

    case 'SET_TRENDING':
      return { ...state, trending: action.payload }

    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] }

    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        )
      }

    case 'REMOVE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload)
      }

    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] }

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id
            ? { ...user, ...action.payload.updates }
            : user
        )
      }

    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      }

    case 'ADD_GROUP':
      return { ...state, groups: [...state.groups, action.payload] }

    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.id
            ? { ...group, ...action.payload.updates }
            : group
        )
      }

    case 'REMOVE_GROUP':
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload)
      }

    default:
      return state
  }
}

interface SocialContextType {
  state: SocialState
  fetchFeed: (limit?: number, offset?: number) => Promise<void>
  fetchUsers: (limit?: number, offset?: number) => Promise<void>
  fetchGroups: (limit?: number, offset?: number) => Promise<void>
  fetchForums: (limit?: number, offset?: number) => Promise<void>
  fetchStats: () => Promise<void>
  fetchTrending: () => Promise<void>
  createPost: (data: any) => Promise<void>
  createGroup: (data: any) => Promise<void>
  createForumThread: (data: any) => Promise<void>
  likePost: (postId: string) => Promise<void>
  unlikePost: (postId: string) => Promise<void>
  followUser: (userId: string) => Promise<void>
  unfollowUser: (userId: string) => Promise<void>
  joinGroup: (groupId: string) => Promise<void>
  leaveGroup: (groupId: string) => Promise<void>
  savePost: (postId: string) => Promise<void>
  unsavePost: (postId: string) => Promise<void>
  commentPost: (postId: string, content: string) => Promise<void>
  deletePost: (postId: string) => Promise<void>
  deleteGroup: (groupId: string) => Promise<void>
  updatePost: (postId: string, updates: Partial<Post>) => Promise<void>
  updateGroup: (groupId: string, updates: Partial<Group>) => Promise<void>
  updateUserProfile: (userId: string, updates: Partial<User>) => Promise<void>
}

const SocialContext = createContext<SocialContextType | undefined>(undefined)

export function SocialProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(socialReducer, initialState)

  const fetchFeed = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=feed&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch feed')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_POSTS', payload: data.posts })
      } else {
        dispatch({ type: 'SET_POSTS', payload: [...state.posts, ...data.posts] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchUsers = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=users&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_USERS', payload: data.users })
      } else {
        dispatch({ type: 'SET_USERS', payload: [...state.users, ...data.users] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchGroups = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=groups&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch groups')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_GROUPS', payload: data.groups })
      } else {
        dispatch({ type: 'SET_GROUPS', payload: [...state.groups, ...data.groups] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchForums = async (limit = 20, offset = 0) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=forums&limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error('Failed to fetch forums')
      
      const data = await response.json()
      if (offset === 0) {
        dispatch({ type: 'SET_FORUMS', payload: data.forums })
      } else {
        dispatch({ type: 'SET_FORUMS', payload: [...state.forums, ...data.forums] })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchStats = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social?type=stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      dispatch({ type: 'SET_STATS', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const fetchTrending = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social?type=trending')
      if (!response.ok) throw new Error('Failed to fetch trending')
      
      const data = await response.json()
      dispatch({ type: 'SET_TRENDING', payload: data })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createPost = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_post', data })
      })
      
      if (!response.ok) throw new Error('Failed to create post')
      
      const result = await response.json()
      dispatch({ type: 'ADD_POST', payload: result.post })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createGroup = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_group', data })
      })
      
      if (!response.ok) throw new Error('Failed to create group')
      
      const result = await response.json()
      dispatch({ type: 'ADD_GROUP', payload: result.group })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createForumThread = async (data: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_forum_thread', data })
      })
      
      if (!response.ok) throw new Error('Failed to create forum thread')
      
      const result = await response.json()
      // Handle forum thread creation response
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const likePost = async (postId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like_post', data: { postId } })
      })
      
      if (!response.ok) throw new Error('Failed to like post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates: { isLiked: true, likes: (state.posts.find(p => p.id === postId)?.likes || 0) + 1 } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const unlikePost = async (postId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlike_post', data: { postId } })
      })
      
      if (!response.ok) throw new Error('Failed to unlike post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates: { isLiked: false, likes: Math.max(0, (state.posts.find(p => p.id === postId)?.likes || 0) - 1) } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const followUser = async (userId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'follow_user', data: { userId } })
      })
      
      if (!response.ok) throw new Error('Failed to follow user')
      
      dispatch({ type: 'UPDATE_USER', payload: { id: userId, updates: { isFollowing: true, followers: (state.users.find(u => u.id === userId)?.followers || 0) + 1 } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const unfollowUser = async (userId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unfollow_user', data: { userId } })
      })
      
      if (!response.ok) throw new Error('Failed to unfollow user')
      
      dispatch({ type: 'UPDATE_USER', payload: { id: userId, updates: { isFollowing: false, followers: Math.max(0, (state.users.find(u => u.id === userId)?.followers || 0) - 1) } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const joinGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join_group', data: { groupId } })
      })
      
      if (!response.ok) throw new Error('Failed to join group')
      
      dispatch({ type: 'UPDATE_GROUP', payload: { id: groupId, updates: { isJoined: true, members: (state.groups.find(g => g.id === groupId)?.members || 0) + 1 } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const leaveGroup = async (groupId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'leave_group', data: { groupId } })
      })
      
      if (!response.ok) throw new Error('Failed to leave group')
      
      dispatch({ type: 'UPDATE_GROUP', payload: { id: groupId, updates: { isJoined: false, members: Math.max(0, (state.groups.find(g => g.id === groupId)?.members || 0) - 1) } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const savePost = async (postId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_post', data: { postId } })
      })
      
      if (!response.ok) throw new Error('Failed to save post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates: { isSaved: true } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const unsavePost = async (postId: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unsave_post', data: { postId } })
      })
      
      if (!response.ok) throw new Error('Failed to unsave post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates: { isSaved: false } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const commentPost = async (postId: string, content: string) => {
    try {
      const response = await fetch('/api/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'comment_post', data: { commentPostId: postId, commentContent: content } })
      })
      
      if (!response.ok) throw new Error('Failed to comment on post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates: { comments: (state.posts.find(p => p.id === postId)?.comments || 0) + 1 } } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    }
  }

  const deletePost = async (postId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=post&id=${postId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete post')
      
      dispatch({ type: 'REMOVE_POST', payload: postId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const deleteGroup = async (groupId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch(`/api/social?type=group&id=${groupId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete group')
      
      dispatch({ type: 'REMOVE_GROUP', payload: groupId })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'post', id: postId, updates })
      })
      
      if (!response.ok) throw new Error('Failed to update post')
      
      dispatch({ type: 'UPDATE_POST', payload: { id: postId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateGroup = async (groupId: string, updates: Partial<Group>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'group', id: groupId, updates })
      })
      
      if (!response.ok) throw new Error('Failed to update group')
      
      dispatch({ type: 'UPDATE_GROUP', payload: { id: groupId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const updateUserProfile = async (userId: string, updates: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await fetch('/api/social', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'user_profile', id: userId, updates })
      })
      
      if (!response.ok) throw new Error('Failed to update user profile')
      
      dispatch({ type: 'UPDATE_USER', payload: { id: userId, updates } })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  useEffect(() => {
    // Initial data fetch
    fetchStats()
    fetchTrending()
  }, [])

  const value: SocialContextType = {
    state,
    fetchFeed,
    fetchUsers,
    fetchGroups,
    fetchForums,
    fetchStats,
    fetchTrending,
    createPost,
    createGroup,
    createForumThread,
    likePost,
    unlikePost,
    followUser,
    unfollowUser,
    joinGroup,
    leaveGroup,
    savePost,
    unsavePost,
    commentPost,
    deletePost,
    deleteGroup,
    updatePost,
    updateGroup,
    updateUserProfile
  }

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  )
}

export function useSocial() {
  const context = useContext(SocialContext)
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider')
  }
  return context
}