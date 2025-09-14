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
      
      // Ensure token is stored (backup in case API function didn't store it)
      if (response.data && response.data.token) {
        localStorage.setItem('anytongue_token', response.data.token)
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
      } else {
        // Fallback: create basic user data
        const basicUser = {
          email: formData.email,
          id: Date.now(),
          username: formData.email.split('@')[0]
        }
        localStorage.setItem('anytongue_user', JSON.stringify(basicUser))
      }
      
      localStorage.setItem('anytongue_isLoggedIn', 'true')
      
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-modern-lg animate-bounce-in">
        <CardHeader className="space-y-4 p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-modern">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">Welcome Back</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
              Sign in to your AnyTongue account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-slide-up">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl animate-slide-up">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">{successMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                className="input-modern"
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
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
                className="input-modern"
              />
            </div>
            <Button type="submit" className="w-full btn-modern" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : 'Log In'}
            </Button>
            {isLoading && (
              <div className="mt-4 text-center animate-fade-in">
                <p className="text-sm text-slate-600 dark:text-slate-400">Redirecting to home page...</p>
              </div>
            )}
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
