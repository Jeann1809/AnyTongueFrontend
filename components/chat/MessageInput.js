'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Smile } from 'lucide-react'

export default function MessageInput({ sendMessage, isSending }) {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim() || isSending) return

    const messageText = message.trim()
    setMessage('')
    
    // Use the sendMessage function from parent component
    await sendMessage(messageText)
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
