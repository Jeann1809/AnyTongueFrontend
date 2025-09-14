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
  const [otherUserId, setOtherUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateChat = async (e) => {
    e.preventDefault()
    
    if (!otherUserId.trim()) {
      setError('Please enter a user ID')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await createChatWithUser(otherUserId.trim())
      setOtherUserId('')
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
        className="h-8 w-8 shadow-md hover:shadow-lg transition-shadow duration-200"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>

      {/* Create Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Create New Chat</CardTitle>
                <CardDescription>
                  Start a conversation with another user
                </CardDescription>
              </div>
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={() => setIsOpen(false)}
                className="shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleCreateChat} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="userId" className="text-sm font-medium">
                    Other User ID
                  </label>
                  <Input
                    id="userId"
                    value={otherUserId}
                    onChange={(e) => setOtherUserId(e.target.value)}
                    placeholder="Enter the other user's ID"
                    disabled={isLoading}
                    className="shadow-md focus:shadow-lg transition-shadow duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    You'll need the other user's ID to start a chat
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !otherUserId.trim()}
                    className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    {isLoading ? 'Creating...' : 'Create Chat'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsOpen(false)}
                    disabled={isLoading}
                    className="shadow-md hover:shadow-lg transition-shadow duration-200"
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
