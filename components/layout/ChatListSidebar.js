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
    <div className="w-80 bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <CreateChatButton />
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingChats ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            Loading conversations...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredChats.map((chat) => (
              <Card
                key={chat.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  selectedChat?.id === chat.id ? 'bg-accent border-primary' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {chat.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-2">
                      <span className="text-xs text-muted-foreground">
                        {chat.timestamp}
                      </span>
                      {chat.unread > 0 && (
                        <Badge variant="destructive" className="mt-1 h-5 w-5 text-xs p-0 flex items-center justify-center">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
