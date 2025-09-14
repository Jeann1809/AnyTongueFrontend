'use client'

import { useState } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, AlertTriangle } from 'lucide-react'

export default function DeleteChatButton({ chatId, chatName }) {
  const { deleteChat } = useChatContext()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDeleteChat = async () => {
    setIsLoading(true)
    setError('')

    try {
      await deleteChat(chatId)
      setIsOpen(false)
    } catch (err) {
      setError(err.message || 'Failed to delete chat')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 hover-lift"
        title="Delete chat"
      >
        <Trash2 className="h-5 w-5" />
      </Button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-red-200/50 dark:border-red-800/50 shadow-modern-lg animate-bounce-in">
            <CardHeader className="p-6">
              <CardTitle className="flex items-center text-red-600 dark:text-red-400 text-xl font-bold">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                Delete Chat
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Are you sure you want to delete "{chatName}"? This action cannot be undone and will delete all messages in this chat.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteChat}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 hover-lift"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </div>
                  ) : 'Delete Chat'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
