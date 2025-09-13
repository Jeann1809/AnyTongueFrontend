'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SideNavbar from '@/components/layout/SideNavbar'
import ChatListSidebar from '@/components/layout/ChatListSidebar'
import { chatAPI, isAuthenticated, getCurrentToken } from '@/lib/api'

// Create context for managing chat state
const ChatContext = createContext()

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider')
  }
  return context
}

export default function MainLayout({ children }) {
  const router = useRouter()
  const [selectedChat, setSelectedChat] = useState(null)
  const [user, setUser] = useState(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [chats, setChats] = useState([])
  const [isLoadingChats, setIsLoadingChats] = useState(false)

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

  // Load user chats from API
  const loadUserChats = async (userId) => {
    if (!userId) return
    
    setIsLoadingChats(true)
    try {
      const response = await chatAPI.getUserChats(userId)
      
      if (response.success && response.data) {
        // Transform API response to match frontend format
        const transformedChats = response.data.map(chat => {
          // Get the other participant (not the current user)
          const otherParticipant = chat.participants.find(p => p._id !== userId)
          return {
            id: chat._id,
            name: otherParticipant ? otherParticipant.username : 'Unknown User',
            lastMessage: 'No messages yet', // This would come from the latest message
            timestamp: new Date(chat.updatedAt).toLocaleDateString(),
            unread: 0, // This would come from unread message count
            participants: chat.participants,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt
          }
        })
        
        setChats(transformedChats)
      }
    } catch (error) {
      console.error('Error loading chats:', error)
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
        
        // Load user chats after setting user data
        if (userData.id) {
          loadUserChats(userData.id)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
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
    isLoadingChats
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
