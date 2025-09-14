'use client'

import { useState, useEffect } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { userAPI } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User, Globe, Save, Loader2 } from 'lucide-react'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'hi', label: 'Hindi' }
]

export default function ProfilePage() {
  const { user, setUser } = useChatContext()
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    nativeLanguage: 'en'
  })
  const [originalData, setOriginalData] = useState({
    username: '',
    email: '',
    nativeLanguage: 'en'
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await userAPI.getProfile()
        if (response.success) {
          const userData = response.data
          setProfileData({
            username: userData.username,
            email: userData.email,
            nativeLanguage: userData.nativeLanguage
          })
          setOriginalData({
            username: userData.username,
            email: userData.email,
            nativeLanguage: userData.nativeLanguage
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user?.id])

  const handleSave = async () => {
    if (!user?.id) return
    
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      const updateData = {}
      if (profileData.username !== originalData.username) {
        updateData.username = profileData.username
      }
      if (profileData.nativeLanguage !== originalData.nativeLanguage) {
        updateData.nativeLanguage = profileData.nativeLanguage
      }
      
      if (Object.keys(updateData).length === 0) {
        setError('No changes to save')
        setIsSaving(false)
        return
      }
      
          const response = await userAPI.updateProfile(updateData)
      if (response.success) {
        const updatedUser = response.data
        setOriginalData({
          username: updatedUser.username,
          email: updatedUser.email,
          nativeLanguage: updatedUser.nativeLanguage
        })
        
        // Update the user context with new data
        setUser(prev => ({
          ...prev,
          username: updatedUser.username,
          nativeLanguage: updatedUser.nativeLanguage
        }))
        
        setSuccessMessage('Profile updated successfully!')
        setIsEditing(false)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleLanguageChange = (value) => {
    setProfileData(prev => ({
      ...prev,
      nativeLanguage: value
    }))
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm">{successMessage}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Your account details and display information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={profileData.email}
                disabled={true}
                placeholder="Your email address"
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Language Preferences
            </CardTitle>
            <CardDescription>
              Set your native language for better translation and communication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="nativeLanguage" className="text-sm font-medium">
                Native Language
              </label>
              <Select 
                value={profileData.nativeLanguage} 
                onValueChange={handleLanguageChange}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your native language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}