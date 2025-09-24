'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@/contexts/user-context'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Edit, 
  Camera, 
  Shield, 
  Star, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  Link, 
  Mail, 
  Phone, 
  Globe, 
  Award, 
  TrendingUp,
  Settings,
  User,
  Bell,
  Lock,
  Trash2,
  Save,
  X
} from 'lucide-react'
import { ResponsiveContainer, ResponsiveText } from '@/components/ui/responsive'
import { UserProfileCard, UserStats } from '@/contexts/user-context'

export default function ProfilePage() {
  const { profile, isLoading, updateProfile, updatePreferences, changePassword, deleteAccount } = useUser()
  const { addNotification } = useNotifications()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    instagram: '',
    youtube: '',
    onlyfans: ''
  })
  const [preferences, setPreferences] = useState({
    nsfwContent: false,
    emailNotifications: false,
    pushNotifications: false,
    showOnlineStatus: false,
    allowMessages: false
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (profile) {
      setEditForm({
        displayName: profile.displayName,
        bio: profile.bio,
        location: profile.location,
        website: profile.website,
        twitter: profile.socialLinks.twitter || '',
        instagram: profile.socialLinks.instagram || '',
        youtube: profile.socialLinks.youtube || '',
        onlyfans: profile.socialLinks.onlyfans || ''
      })
      setPreferences(profile.preferences)
    }
  }, [profile])

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        displayName: editForm.displayName,
        bio: editForm.bio,
        location: editForm.location,
        website: editForm.website,
        socialLinks: {
          twitter: editForm.twitter || undefined,
          instagram: editForm.instagram || undefined,
          youtube: editForm.youtube || undefined,
          onlyfans: editForm.onlyfans || undefined
        }
      })
      
      setIsEditing(false)
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully.'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.'
      })
    }
  }

  const handleSavePreferences = async () => {
    try {
      await updatePreferences(preferences)
      addNotification({
        type: 'success',
        title: 'Preferences Updated',
        message: 'Your preferences have been saved successfully.'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update preferences. Please try again.'
      })
    }
  }

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      addNotification({
        type: 'error',
        title: 'Password Mismatch',
        message: 'New password and confirmation do not match.'
      })
      return
    }

    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      addNotification({
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been updated successfully.'
      })
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Password Change Failed',
        message: 'Failed to change password. Please check your current password.'
      })
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await deleteAccount()
        addNotification({
          type: 'info',
          title: 'Account Deleted',
          message: 'Your account has been deleted successfully.'
        })
        // Redirect to home page
        window.location.href = '/'
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Deletion Failed',
          message: 'Failed to delete account. Please try again.'
        })
      }
    }
  }

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </ResponsiveContainer>
    )
  }

  if (!profile) {
    return (
      <ResponsiveContainer>
        <div className="text-center py-12">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <ResponsiveText variant="heading" className="text-muted-foreground mb-2">
            Profile Not Found
          </ResponsiveText>
          <ResponsiveText variant="body" className="text-muted-foreground">
            Unable to load user profile.
          </ResponsiveText>
        </div>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account and settings</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isEditing ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location}
                      onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={editForm.website}
                      onChange={(e) => setEditForm(prev => ({ ...prev, website: e.target.value }))}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={editForm.twitter}
                        onChange={(e) => setEditForm(prev => ({ ...prev, twitter: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={editForm.instagram}
                        onChange={(e) => setEditForm(prev => ({ ...prev, instagram: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        value={editForm.youtube}
                        onChange={(e) => setEditForm(prev => ({ ...prev, youtube: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="onlyfans">OnlyFans</Label>
                      <Input
                        id="onlyfans"
                        value={editForm.onlyfans}
                        onChange={(e) => setEditForm(prev => ({ ...prev, onlyfans: e.target.value }))}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <UserProfileCard profile={profile} isOwnProfile={true} />
            )}

            {/* Stats */}
            <UserStats profile={profile} />

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your accomplishments and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div key={achievement.id} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-sm">{achievement.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {achievement.unlockedAt.toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Content</CardTitle>
                <CardDescription>Manage your created content and media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📁</div>
                  <ResponsiveText variant="heading" className="mb-2">
                    Content Management
                  </ResponsiveText>
                  <ResponsiveText variant="body" className="text-muted-foreground mb-4">
                    You have {profile.stats.contentCount} pieces of content
                  </ResponsiveText>
                  <Button>
                    View All Content
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Preferences
                </CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="nsfwContent">NSFW Content</Label>
                    <p className="text-sm text-muted-foreground">Show adult content in your feed</p>
                  </div>
                  <Switch
                    id="nsfwContent"
                    checked={preferences.nsfwContent}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, nsfwContent: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive email updates</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showOnlineStatus">Online Status</Label>
                    <p className="text-sm text-muted-foreground">Show when you're online</p>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={preferences.showOnlineStatus}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowMessages">Allow Messages</Label>
                    <p className="text-sm text-muted-foreground">Let other users send you messages</p>
                  </div>
                  <Switch
                    id="allowMessages"
                    checked={preferences.allowMessages}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, allowMessages: checked }))}
                  />
                </div>

                <Button onClick={handleSavePreferences} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password
                </CardTitle>
                <CardDescription>Change your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                </div>
                
                <Button onClick={handleChangePassword} className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </CardTitle>
                <CardDescription>Permanently delete your account and all data</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  This action cannot be undone. All your content, data, and settings will be permanently deleted.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ResponsiveContainer>
  )
}