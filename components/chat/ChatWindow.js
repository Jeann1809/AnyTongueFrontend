'use client'

import { useRef, useCallback } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { useMessages } from '@/hooks/useMessages'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ChatWindow() {
  const { selectedChat } = useChatContext()
  
  if (!selectedChat) return null

  // Use the useMessages hook for all message handling
  const {
    messages,
    loading,
    error,
    hasMore,
    sending,
    messagesEndRef,
    loadMoreMessages,
    sendMessage,
    scrollToBottom
  } = useMessages(selectedChat.id)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-lg font-semibold">{selectedChat.name}</h1>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-red-500">
              <p>Error loading messages</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  onClick={loadMoreMessages}
                  className="text-sm"
                >
                  Load More Messages
                </Button>
              </div>
            )}
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <MessageInput sendMessage={sendMessage} isSending={sending} />
      </div>
    </div>
  )
}