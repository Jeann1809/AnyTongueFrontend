'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Paperclip, Smile, ArrowRight, ChevronRight } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t-2 border-slate-200/50 dark:border-slate-700/50">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon"
        className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
      >
        <Paperclip className="h-5 w-5 text-slate-500 dark:text-slate-400" />
      </Button>
      
      <div className="flex-1 relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="input-modern pr-12"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
        >
          <Smile className="h-4 w-4 text-slate-500 dark:text-slate-400" />
        </Button>
      </div>
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!message.trim() || isSending} 
        className="w-12 h-12 btn-modern"
      >
        {isSending ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
        ) : (
          <ArrowRight className="h-5 w-5 text-white" />
        )}
      </Button>
    </form>
  )
}
