'use client'

import { useState } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CreateChatButton from '@/components/chat/CreateChatButton'

export default function ChatListSidebar() {
  const { 
    chats, 
    selectedChat, 
    setSelectedChat, 
    isLoadingChats, 
    loadUserChats, 
    user 
  } = useChatContext()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-80 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-border/50 flex flex-col shadow-modern">
      {/* Header */}
      <div className="p-6 border-b border-border/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">💬</span>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">Chats</h2>
          </div>
          <CreateChatButton />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoadingChats ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500">
            <div className="w-8 h-8 rounded-full gradient-primary animate-spin flex items-center justify-center mb-3">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <p className="text-sm font-medium">Loading conversations...</p>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-slate-500">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-sm font-medium">{searchQuery ? 'No conversations found' : 'No conversations yet'}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredChats.map((chat, index) => (
              <div
                key={chat.id}
                className={`group cursor-pointer transition-all duration-300 hover-lift animate-slide-up ${
                  selectedChat?.id === chat.id 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700' 
                    : 'bg-white/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50'
                } rounded-xl p-4 hover:shadow-modern`}
                onClick={() => setSelectedChat(chat)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                      selectedChat?.id === chat.id ? 'gradient-primary' : 'bg-gradient-to-br from-slate-400 to-slate-600'
                    }`}>
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate text-slate-800 dark:text-slate-200">
                        {chat.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {chat.timestamp}
                    </span>
                    {chat.unread > 0 && (
                      <div className="mt-2 w-5 h-5 rounded-full gradient-warm flex items-center justify-center text-white text-xs font-bold">
                        {chat.unread}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
