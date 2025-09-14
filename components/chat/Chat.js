'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { useMessages } from '@/hooks/useMessages'
import { useSettings } from '@/lib/settingsContext'
import messageService from '@/services/messageService'
import MessageBubble from './MessageBubble'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'

export default function Chat() {
  const { selectedChat, setSelectedChat, user } = useChatContext()
  const { getSetting } = useSettings()
  const [messageText, setMessageText] = useState('')
  const messagesContainerRef = useRef(null)
  
  const {
    messages,
    loading,
    error,
    hasMore,
    sending,
    messagesEndRef,
    loadMoreMessages,
    sendMessage,
    scrollToBottom,
    setError
  } = useMessages(selectedChat?.id)

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageText.trim() || sending) return

    await sendMessage(messageText)
    setMessageText('')
  }

  const handleKeyPress = (e) => {
    const enterToSend = getSetting('chatPrefs', 'enterToSend')
    
    if (e.key === 'Enter') {
      if (enterToSend) {
        e.preventDefault()
        handleSendMessage(e)
      }
      // If enterToSend is false, let the default behavior happen (new line)
    }
  }

  const handleLoadMore = () => {
    loadMoreMessages()
  }


  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center relative" style={{
        backgroundImage: 'url(/backgroundchat.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="text-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-none rounded-2xl p-8 shadow-lg relative z-10">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Select a chat to start messaging</h3>
          <p className="text-gray-500 dark:text-gray-400">Choose a conversation from the sidebar to begin chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative" style={{
      backgroundImage: 'url(/backgroundchat.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/5 dark:bg-black/10 z-0"></div>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-white/60 dark:bg-gray-800/60 backdrop-blur-none relative z-10">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSelectedChat(null)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{selectedChat.name}</h1>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border-b border-destructive/20">
          <p className="text-sm text-destructive text-center">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/20 dark:bg-gray-800/20 backdrop-blur-none relative z-10"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loading}
                >
                  Load More Messages
                </Button>
              </div>
            )}

            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                />
              ))
            )}
            
            {/* Scroll anchor for auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-border p-4 bg-white/40 dark:bg-gray-800/40 backdrop-blur-none relative z-10">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageText.trim() || sending}
          >
            {sending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
