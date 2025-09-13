'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Smile } from 'lucide-react'
import { useChatContext } from '@/app/(main)/layout'

export default function MessageInput({ chatId }) {
  const [message, setMessage] = useState('')
  const { addMessage } = useChatContext()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: message,
      timestamp: 'now',
      isOwn: true
    }

    addMessage(chatId, newMessage)
    setMessage('')

    // Socket.IO placeholder - uncomment when backend is ready
    // socket.emit('sendMessage', {
    //   chatId,
    //   text: message
    // })
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
      
      <Button type="submit" size="icon" disabled={!message.trim()}>
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}
