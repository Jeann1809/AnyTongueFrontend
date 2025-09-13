'use client'

import { useState, useEffect } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chatAPI } from '@/lib/api'

export default function ChatWindow() {
  const { selectedChat, messages, setSelectedChat, user, setChatMessages } = useChatContext()
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  
  if (!selectedChat) return null

  const chatMessages = messages[selectedChat.id] || []

  // Load messages when chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedChat.id) return
      
      setIsLoadingMessages(true)
      try {
        console.log('Loading messages for chat:', selectedChat.id)
        const response = await chatAPI.getMessages(selectedChat.id)
        
        if (response.success && response.data) {
          // Transform messages to match frontend format
          const transformedMessages = response.data.map(msg => ({
            id: msg._id,
            sender: msg.sender?.username || 'Unknown',
            text: msg.originalText,
            translations: msg.translations,
            timestamp: new Date(msg.createdAt).toLocaleTimeString(),
            isOwn: msg.sender?._id === user?.id,
            senderId: msg.sender?._id
          }))
          
          console.log('Loaded messages:', transformedMessages)
          // Update messages in context
          setChatMessages(selectedChat.id, transformedMessages)
        }
      } catch (error) {
        console.error('Error loading messages:', error)
      } finally {
        setIsLoadingMessages(false)
      }
    }

    loadMessages()
  }, [selectedChat.id, user?.id])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading messages...</p>
            </div>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          chatMessages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <MessageInput chatId={selectedChat.id} />
      </div>
    </div>
  )
}
