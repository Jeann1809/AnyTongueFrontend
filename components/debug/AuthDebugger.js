'use client'

import { useState } from 'react'
import { isAuthenticated, getCurrentToken, userAPI, chatAPI } from '@/lib/api'
import { useChatContext } from '@/app/(main)/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthDebugger() {
  const { user } = useChatContext()
  const [debugInfo, setDebugInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuthStatus = () => {
    const token = getCurrentToken()
    const authStatus = isAuthenticated()
    
    setDebugInfo({
      token: token ? `${token.substring(0, 20)}...` : 'No token',
      isAuthenticated: authStatus,
      user: user,
      localStorage: {
        anytongue_user: localStorage.getItem('anytongue_user'),
        anytongue_isLoggedIn: localStorage.getItem('anytongue_isLoggedIn'),
        anytongue_token: token ? 'Present' : 'Missing'
      }
    })
  }

  const testUserProfile = async () => {
    if (!user?.id) {
      alert('No user ID available')
      return
    }

    setIsLoading(true)
    try {
      const response = await userAPI.getUserProfile(user.id)
      alert(`User profile loaded successfully:\n${JSON.stringify(response, null, 2)}`)
    } catch (error) {
      alert(`Error loading user profile:\n${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testUserChats = async () => {
    if (!user?.id) {
      alert('No user ID available')
      return
    }

    setIsLoading(true)
    try {
      const response = await chatAPI.getUserChats(user.id)
      alert(`User chats loaded successfully:\n${JSON.stringify(response, null, 2)}`)
    } catch (error) {
      alert(`Error loading user chats:\n${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearAllAuth = () => {
    localStorage.removeItem('anytongue_token')
    localStorage.removeItem('anytongue_user')
    localStorage.removeItem('anytongue_isLoggedIn')
    alert('All authentication data cleared. Please login again.')
    window.location.href = '/login'
  }

  const testTokenManually = () => {
    const token = getCurrentToken()
    if (token) {
      alert(`Token found: ${token.substring(0, 30)}...`)
    } else {
      alert('No token found in localStorage')
    }
  }

  const debugMessages = () => {
    const { messages, selectedChat } = useChatContext()
    console.log('Current messages in context:', messages)
    console.log('Selected chat:', selectedChat)
    if (selectedChat) {
      console.log(`Messages for chat ${selectedChat.id}:`, messages[selectedChat.id] || [])
    }
    alert('Check console for message debug info')
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Authentication Debugger</CardTitle>
        <CardDescription>
          Test Bearer token authentication with protected endpoints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={checkAuthStatus} className="w-full">
          Check Auth Status
        </Button>
        
        <Button 
          onClick={testUserProfile} 
          disabled={isLoading || !user?.id}
          className="w-full"
        >
          Test User Profile API
        </Button>
        
        <Button 
          onClick={testUserChats} 
          disabled={isLoading || !user?.id}
          className="w-full"
        >
          Test User Chats API
        </Button>

        <Button 
          onClick={testTokenManually}
          className="w-full"
          variant="outline"
        >
          Test Token Manually
        </Button>

        <Button 
          onClick={clearAllAuth}
          className="w-full"
          variant="destructive"
        >
          Clear All Auth Data
        </Button>

        <Button 
          onClick={debugMessages}
          className="w-full"
          variant="secondary"
        >
          Debug Messages
        </Button>

        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">Debug Info:</h4>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
