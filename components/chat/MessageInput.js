'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Smile } from 'lucide-react'
import { useChatContext } from '@/app/(main)/layout'
import { chatAPI } from '@/lib/api'

export default function MessageInput({ chatId }) {
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { addMessage, setChatMessages, messages } = useChatContext()

  // Socket.IO placeholder - uncomment when backend is ready
  useEffect(() => {
    // const socket = io('http://localhost:3001')
    
    // socket.on('connect', () => {
    //   console.log('Connected to server')
    // })
    
    // socket.on('newMessage', (data) => {
    //   addMessage(data.chatId, {
    //     id: Date.now().toString(),
    //     sender: data.sender,
    //     text: data.text,
    //     timestamp: 'now',
    //     isOwn: false
    //   })
    // })
    
    // return () => {
    //   socket.disconnect()
    // }
  }, [addMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const messageText = message.trim()
    setMessage('')
    setIsSending(true)

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: 'You',
      text: messageText,
      timestamp: 'now',
      isOwn: true,
      isSending: true
    }

    addMessage(chatId, tempMessage)

    try {
      console.log('Sending message:', { chatId, text: messageText })
      const response = await chatAPI.sendMessage({
        chatId: chatId,
        text: messageText,
        messageType: 'text'
      })

      console.log('Message sent successfully:', response)

      // Replace temp message with real message from server
      if (response.success && response.data) {
        const messageData = response.data
        const realMessage = {
          id: messageData._id,
          sender: messageData.sender?.username || 'You',
          text: messageData.originalText,
          translations: messageData.translations,
          timestamp: new Date(messageData.createdAt).toLocaleTimeString(),
          isOwn: true,
          isSending: false,
          senderId: messageData.sender?._id
        }

        // Replace temp message with real message
        const currentMessages = messages[chatId] || []
        console.log('Current messages before replacement:', currentMessages)
        console.log('Looking for temp message ID:', tempMessage.id)
        
        const tempMessageIndex = currentMessages.findIndex(msg => msg.id === tempMessage.id)
        console.log('Temp message index:', tempMessageIndex)
        
        let updatedMessages
        if (tempMessageIndex !== -1) {
          // Replace the temp message
          updatedMessages = [...currentMessages]
          updatedMessages[tempMessageIndex] = realMessage
          console.log('Replaced temp message at index:', tempMessageIndex)
        } else {
          // If temp message not found, just add the real message
          updatedMessages = [...currentMessages, realMessage]
          console.log('Temp message not found, added real message to end')
        }
        
        setChatMessages(chatId, updatedMessages)
        console.log('Updated messages:', updatedMessages)
        console.log('Message updated successfully:', realMessage)
      } else {
        console.warn('Unexpected response structure:', response)
        // Fallback: just remove the sending state from temp message
        const currentMessages = messages[chatId] || []
        const tempMessageIndex = currentMessages.findIndex(msg => msg.id === tempMessage.id)
        
        if (tempMessageIndex !== -1) {
          const updatedMessages = [...currentMessages]
          updatedMessages[tempMessageIndex] = { ...updatedMessages[tempMessageIndex], isSending: false }
          setChatMessages(chatId, updatedMessages)
          console.log('Removed sending state from temp message')
        } else {
          console.warn('Temp message not found for fallback')
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Remove the temp message and show error
      const currentMessages = messages[chatId] || []
      const tempMessageIndex = currentMessages.findIndex(msg => msg.id === tempMessage.id)
      
      let updatedMessages
      if (tempMessageIndex !== -1) {
        // Remove temp message
        updatedMessages = currentMessages.filter(msg => msg.id !== tempMessage.id)
      } else {
        updatedMessages = currentMessages
      }
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: 'System',
        text: `Failed to send message: ${error.message}`,
        timestamp: 'now',
        isOwn: false,
        isError: true
      }
      
      setChatMessages(chatId, [...updatedMessages, errorMessage])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <Button type="button" variant="ghost" size="icon">
        <Paperclip className="h-5 w-5" />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
        >
          <Smile className="h-4 w-4" />
        </Button>
      </div>
      
      <Button type="submit" size="icon" disabled={!message.trim() || isSending}>
        {isSending ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  )
}
