'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { useMessages } from '@/hooks/useMessages'
import messageService from '@/services/messageService'
import MessageBubble from './MessageBubble'
import DeleteChatButton from './DeleteChatButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft, MoreVertical } from 'lucide-react'

export default function Chat() {
  const { selectedChat, setSelectedChat, user, showChatList, setShowChatList } = useChatContext()
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

  const handleLoadMore = () => {
    loadMoreMessages()
  }


  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20 p-4">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-24 w-24 sm:h-32 sm:w-32 mb-4 sm:mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-modern">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent mb-2 sm:mb-3">Select a chat to start messaging</h3>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">Choose a conversation from the sidebar to begin chatting</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 sm:p-6 border-b border-border/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-modern">
        <div className="flex items-center space-x-2 sm:space-x-4 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden w-8 h-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex-shrink-0"
            onClick={() => {
              setSelectedChat(null)
              setShowChatList(true)
            }}
          >
            <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </Button>
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">
              {selectedChat.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-200 truncate">{selectedChat.name}</h1>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0"></div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Online</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <DeleteChatButton chatId={selectedChat.id} chatName={selectedChat.name} />
          <Button variant="ghost" size="icon" className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
              onClick={() => setError(null)}
            >
              ✕
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-8 relative"
        style={{
          backgroundImage: 'url(/background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-white/20 dark:bg-slate-900/20"></div>
        
        {/* Messages content */}
        <div className="relative z-10">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-slate-500">
              <div className="w-8 h-8 rounded-full gradient-primary animate-spin flex items-center justify-center mx-auto mb-3">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <p className="font-medium">Loading messages...</p>
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
                  className="px-6 py-2 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300"
                >
                  Load More Messages
                </Button>
              </div>
            )}

            {/* Messages List */}
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-500 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">💬</span>
                  </div>
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Start the conversation!</p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={message.id} className="animate-slide-up mb-4" style={{ animationDelay: `${index * 50}ms` }}>
                  <MessageBubble message={message} />
                </div>
              ))
            )}
            
            {/* Scroll anchor for auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-border/30 p-3 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2 sm:space-x-3">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input-modern h-10 sm:h-auto text-sm sm:text-base"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageText.trim() || sending}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
          >
            {sending ? (
              <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M18.455 9.8834L7.063 4.1434C6.76535 3.96928 6.40109 3.95274 6.08888 4.09916C5.77667 4.24558 5.55647 4.53621 5.5 4.8764C5.5039 4.98942 5.53114 5.10041 5.58 5.2024L7.749 10.4424C7.85786 10.7903 7.91711 11.1519 7.925 11.5164C7.91714 11.8809 7.85789 12.2425 7.749 12.5904L5.58 17.8304C5.53114 17.9324 5.5039 18.0434 5.5 18.1564C5.55687 18.4961 5.77703 18.7862 6.0889 18.9323C6.40078 19.0785 6.76456 19.062 7.062 18.8884L18.455 13.1484C19.0903 12.8533 19.4967 12.2164 19.4967 11.5159C19.4967 10.8154 19.0903 10.1785 18.455 9.8834V9.8834Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
