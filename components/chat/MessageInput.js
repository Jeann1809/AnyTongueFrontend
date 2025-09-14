'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Smile, ArrowRight, ChevronRight } from 'lucide-react'

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
        className="w-12 h-12 rounded-full"
      >
        {isSending ? (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
        ) : (
          <svg width="24" height="24" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M18.455 9.8834L7.063 4.1434C6.76535 3.96928 6.40109 3.95274 6.08888 4.09916C5.77667 4.24558 5.55647 4.53621 5.5 4.8764C5.5039 4.98942 5.53114 5.10041 5.58 5.2024L7.749 10.4424C7.85786 10.7903 7.91711 11.1519 7.925 11.5164C7.91714 11.8809 7.85789 12.2425 7.749 12.5904L5.58 17.8304C5.53114 17.9324 5.5039 18.0434 5.5 18.1564C5.55687 18.4961 5.77703 18.7862 6.0889 18.9323C6.40078 19.0785 6.76456 19.062 7.062 18.8884L18.455 13.1484C19.0903 12.8533 19.4967 12.2164 19.4967 11.5159C19.4967 10.8154 19.0903 10.1785 18.455 9.8834V9.8834Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </Button>
    </form>
  )
}
