'use client'

import { useState } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

export default function CreateChatButton() {
  const { createChatWithUser, user } = useChatContext()
  const [isOpen, setIsOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateChat = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await createChatWithUser(username.trim())
      setUsername('')
      setIsOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to create chat')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        size="icon" 
        variant="outline" 
        className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 hover-lift"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-5 w-5 text-slate-600 dark:text-slate-400" />
      </Button>

      {/* Create Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-full max-w-md mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-700/50 shadow-modern-lg animate-bounce-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 p-6">
              <div>
                <CardTitle className="flex items-center text-xl font-bold">
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center mr-3">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  Create New Chat
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  Start a conversation with another user
                </CardDescription>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleCreateChat} className="space-y-6">
                <div className="space-y-3">
                  <label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Username
                  </label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter the other user's username"
                    disabled={isLoading}
                    className="input-modern"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the username of the person you want to chat with
                  </p>
                </div>
                
                <div className="flex space-x-3">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !username.trim()}
                    className="flex-1 btn-modern"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating...</span>
                      </div>
                    ) : 'Create Chat'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
