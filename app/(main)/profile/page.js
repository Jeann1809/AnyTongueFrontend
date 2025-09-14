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
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-48 sm:h-64">
          <div className="text-center animate-fade-in">
            <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 mb-4 sm:mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-modern">
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-500" />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <div className="mx-auto h-16 w-16 sm:h-20 sm:w-20 mb-4 sm:mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-modern">
            <User className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
          </div>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-2 sm:mb-3">Profile</h1>
        <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">Manage your account information and preferences</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-slide-up">
          <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-slide-up">
          <p className="text-green-600 dark:text-green-400 text-sm font-medium">{successMessage}</p>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6">
        {/* Basic Information */}
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-modern-lg animate-slide-up">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-lg sm:text-xl font-bold">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl gradient-primary flex items-center justify-center mr-2 sm:mr-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              Basic Information
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Your account details and display information
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Username
              </label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your username"
                className="input-modern h-10 sm:h-auto text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Email
              </label>
              <Input
                id="email"
                name="email"
                value={profileData.email}
                disabled={true}
                placeholder="Your email address"
                className="input-modern bg-slate-50 dark:bg-slate-800/50 h-10 sm:h-auto text-sm sm:text-base"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email cannot be changed. Contact support if you need to update your email.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Language Preferences */}
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-modern-lg animate-slide-up" style={{ animationDelay: '100ms' }}>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center text-lg sm:text-xl font-bold">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl gradient-secondary flex items-center justify-center mr-2 sm:mr-3">
                <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              Language Preferences
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Set your native language for better translation and communication
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="space-y-2 sm:space-y-3">
              <label htmlFor="nativeLanguage" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Native Language
              </label>
              <Select 
                value={profileData.nativeLanguage} 
                onValueChange={handleLanguageChange}
                disabled={!isEditing}
              >
                <SelectTrigger className="input-modern h-10 sm:h-auto text-sm sm:text-base">
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
        <div className="flex flex-col sm:flex-row justify-end gap-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={isSaving}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-10 sm:h-auto text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full sm:w-auto btn-modern h-10 sm:h-auto text-sm sm:text-base"
              >
                {isSaving ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </div>
                )}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full sm:w-auto btn-modern h-10 sm:h-auto text-sm sm:text-base"
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}