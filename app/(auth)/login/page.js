'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { authAPI } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      
      console.log('Login response:', response) // Debug log
      
      // Ensure token is stored (backup in case API function didn't store it)
      if (response.data && response.data.token) {
        localStorage.setItem('anytongue_token', response.data.token)
        console.log('Token stored in login page:', response.data.token.substring(0, 20) + '...')
      } else {
        console.warn('No token in login response:', response)
      }
      
      // Store user data and authentication state - user is nested in data.data.user
      if (response.data && response.data.user) {
        // Transform the user data to match expected format
        const userData = {
          id: response.data.user._id,
          username: response.data.user.username,
          email: response.data.user.email,
          nativeLanguage: response.data.user.nativeLanguage,
          createdAt: response.data.user.createdAt,
          updatedAt: response.data.user.updatedAt
        }
        localStorage.setItem('anytongue_user', JSON.stringify(userData))
        console.log('User data stored:', userData)
      } else {
        console.warn('No user data in login response:', response)
        // Fallback: create basic user data
        const basicUser = {
          email: formData.email,
          id: Date.now(),
          username: formData.email.split('@')[0]
        }
        localStorage.setItem('anytongue_user', JSON.stringify(basicUser))
      }
      
      localStorage.setItem('anytongue_isLoggedIn', 'true')
      
      // Verify localStorage was set
      console.log('LocalStorage after login:', {
        user: localStorage.getItem('anytongue_user'),
        isLoggedIn: localStorage.getItem('anytongue_isLoggedIn'),
        token: localStorage.getItem('anytongue_token') ? 'Token present' : 'No token'
      })
      
      // Show success message
      setSuccessMessage('Login successful! Redirecting to home page...')
      
      // Show native alert
      alert('Login successful! Redirecting to home page...')
      
      // Use window.location for more reliable redirect
      window.location.href = '/'
      
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your AnyTongue account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">{successMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Log In'}
            </Button>
            {isLoading && (
              <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">Redirecting to home page...</p>
              </div>
            )}
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
