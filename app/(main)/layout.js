'use client'

import { useState, createContext, useContext, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SideNavbar from '@/components/layout/SideNavbar'
import ChatListSidebar from '@/components/layout/ChatListSidebar'
import { chatAPI, isAuthenticated, getCurrentToken } from '@/lib/api'
import messageService from '@/services/messageService'
import socketService from '@/services/socketService'

// Create context for managing chat state
const ChatContext = createContext()

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

// Helper function to format message timestamps
const formatMessageTimestamp = (timestamp) => {
  const now = new Date()
  const messageTime = new Date(timestamp)
  const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return messageTime.toLocaleDateString()
}

export default function MainLayout({ children }) {
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState(null)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [chats, setChats] = useState([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const chatsLoadedRef = useRef(false)

  const [messages, setMessages] = useState({
    '1': [
      { id: '1', sender: 'Maria Garcia', text: '¡Hola! ¿Cómo estás?', timestamp: '2 min ago', isOwn: false },
      { id: '2', sender: 'You', text: '¡Hola María! Estoy bien, gracias. ¿Y tú?', timestamp: '1 min ago', isOwn: true },
      { id: '3', sender: 'Maria Garcia', text: 'Muy bien también. ¿Quieres practicar español hoy?', timestamp: '1 min ago', isOwn: false }
    ],
    '2': [
      { id: '1', sender: 'Jean Dubois', text: 'Bonjour! Comment allez-vous?', timestamp: '1 hour ago', isOwn: false },
      { id: '2', sender: 'You', text: 'Bonjour Jean! Je vais bien, merci. Et vous?', timestamp: '1 hour ago', isOwn: true }
    ],
    '3': [
      { id: '1', sender: 'Hans Mueller', text: 'Guten Tag! Wie geht es Ihnen?', timestamp: '3 hours ago', isOwn: false },
      { id: '2', sender: 'You', text: 'Guten Tag Hans! Mir geht es gut, danke.', timestamp: '3 hours ago', isOwn: true }
    ],
    '4': [
      { id: '1', sender: 'Admin', text: 'Welcome to our weekly practice session!', timestamp: '1 day ago', isOwn: false },
      { id: '2', sender: 'Sarah', text: 'Excited to practice with everyone!', timestamp: '1 day ago', isOwn: false },
      { id: '3', sender: 'You', text: 'Looking forward to it!', timestamp: '1 day ago', isOwn: true }
    ]
  })

  const addMessage = (chatId, message) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), message]
    }))
  }

  const setChatMessages = (chatId, messages) => {
    setMessages(prev => ({
      ...prev,
      [chatId]: messages
    }))
  }

  // Update chat list when a new message arrives
  const updateChatWithNewMessage = (chatId, message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        // Get display text with translation for the current user's language
        const displayInfo = messageService.getDisplayText({
          text: message.originalText,
          translations: message.translations
        }, user?.nativeLanguage || 'en')
        
        // Only increment unread count if:
        // 1. Message is not from current user
        // 2. User is not currently viewing this chat
        const isFromCurrentUser = message.sender._id === user?.id
        const isCurrentlyViewing = selectedChat?.id === chatId
        
        let newUnreadCount = chat.unread
        if (!isFromCurrentUser && !isCurrentlyViewing) {
          newUnreadCount = chat.unread + 1
        } else if (isCurrentlyViewing) {
          newUnreadCount = 0 // Reset to 0 when user is viewing the chat
        }
        
        return {
          ...chat,
          lastMessage: displayInfo.text,
          timestamp: formatMessageTimestamp(message.createdAt),
          unread: newUnreadCount
        }
      }
      return chat
    }))
  }

  // Mark messages as read for a specific chat
  const markChatAsRead = (chatId) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    ))
  }

  // Reset chats loaded state (useful for logout/login)
  const resetChatsLoaded = () => {
    chatsLoadedRef.current = false
    setChats([])
  }

  // Global socket message handler for chat list updates
  const handleGlobalSocketMessage = useCallback((messageData) => {
    updateChatWithNewMessage(messageData.chat, messageData)
  }, [])

  // Load user chats from API
  const loadUserChats = async (userId) => {
    if (!userId || isLoadingChats || chatsLoadedRef.current) return
    
    setIsLoadingChats(true)
    chatsLoadedRef.current = true
    try {
      const response = await chatAPI.getUserChats(userId)
      
      if (response.success && response.data) {
        // First, create basic chat objects without last messages
        const basicChats = response.data.map(chat => {
          const otherParticipant = chat.participants.find(p => p._id !== userId)
          return {
            id: chat._id,
            name: otherParticipant ? otherParticipant.username : 'Unknown User',
            lastMessage: 'No messages yet',
            timestamp: formatMessageTimestamp(chat.updatedAt),
            unread: 0,
            participants: chat.participants,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
          }
        })
        
        // Set basic chats first to show them immediately
        setChats(basicChats)
        
        // Then load last messages in parallel
        const chatsWithLastMessages = await Promise.all(
          basicChats.map(async (chat) => {
            try {
              const lastMessageResponse = await chatAPI.getLastMessage(chat.id)
              if (lastMessageResponse.success && lastMessageResponse.data.length > 0) {
                const lastMsg = lastMessageResponse.data[0]
                const displayInfo = messageService.getDisplayText({
                  text: lastMsg.originalText,
                  translations: lastMsg.translations
                }, user?.nativeLanguage || 'en')
                
                return {
                  ...chat,
                  lastMessage: displayInfo.text,
                  timestamp: formatMessageTimestamp(lastMsg.createdAt)
                }
              }
            } catch (error) {
              // Silent fail for last message loading
            }
            return chat
          })
        )
        
        // Update chats with last messages
        setChats(chatsWithLastMessages)
      }
    } catch (error) {
      // Keep empty chats array on error
    } finally {
      setIsLoadingChats(false)
    }
  }

  // Create a new chat with another user
  const createChatWithUser = async (otherUserId) => {
    try {
      const response = await chatAPI.createChat(otherUserId)
      
      if (response.success && response.data) {
        // Transform and add to chats list
        const chat = response.data
        const otherParticipant = chat.participants.find(p => p._id !== user?.id)
        const newChat = {
          id: chat._id,
          name: otherParticipant ? otherParticipant.username : 'Unknown User',
          lastMessage: 'No messages yet',
          timestamp: new Date(chat.createdAt).toLocaleDateString(),
          unread: 0,
          participants: chat.participants,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt
        }
        
        setChats(prev => [newChat, ...prev])
        setSelectedChat(newChat)
        return newChat
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      throw error
    }
  }

  // Simple authentication check
  useEffect(() => {
    const savedUser = localStorage.getItem('anytongue_user')
    const isLoggedIn = localStorage.getItem('anytongue_isLoggedIn')
    
    // Check if user is properly authenticated with token
    if (isAuthenticated() && savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        
        // Load user chats after setting user data (only if not already loaded)
        if (userData.id && !chatsLoadedRef.current) {
          loadUserChats(userData.id)
        }
      } catch (error) {
        localStorage.removeItem('anytongue_user')
        localStorage.removeItem('anytongue_isLoggedIn')
        localStorage.removeItem('anytongue_token')
        router.replace('/login')
      }
    } else {
      // Only redirect if we're not already on login page
      if (window.location.pathname !== '/login') {
        router.replace('/login')
      }
    }
    
    // Always set checking auth to false after the check
    setIsCheckingAuth(false)
  }, [router])

  // Set up global socket listener for chat list updates
  useEffect(() => {
    if (!user) return

    const socket = socketService.connect()
    
    if (socket) {
      socketService.onNewMessage(handleGlobalSocketMessage)
      
      return () => {
        socketService.offNewMessage()
      }
    }
  }, [user, handleGlobalSocketMessage])

  const contextValue = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    messages,
    setMessages,
    addMessage,
    setChatMessages,
    user,
    setUser,
    loadUserChats,
    createChatWithUser,
    isLoadingChats,
    updateChatWithNewMessage,
    markChatAsRead,
    resetChatsLoaded,
    handleGlobalSocketMessage
  }

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex h-screen bg-background items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <ChatContext.Provider value={contextValue}>
      <div className="flex h-screen bg-background">
        {/* Side Navigation - Narrow */}
        <SideNavbar />
        
        {/* Chat List Sidebar - Medium Width */}
        <ChatListSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </ChatContext.Provider>
  )
}
