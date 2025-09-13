'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SideNavbar from '@/components/layout/SideNavbar'
import ChatListSidebar from '@/components/layout/ChatListSidebar'

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
  const [chats, setChats] = useState([
    {
      id: '1',
      name: 'Maria Garcia',
      lastMessage: '¡Hola! ¿Cómo estás?',
      timestamp: '2 min ago',
      unread: 2
    },
    {
      id: '2',
      name: 'Jean Dubois',
      lastMessage: 'Bonjour! Comment allez-vous?',
      timestamp: '1 hour ago',
      unread: 0
    },
    {
      id: '3',
      name: 'Hans Mueller',
      lastMessage: 'Guten Tag! Wie geht es Ihnen?',
      timestamp: '3 hours ago',
      unread: 1
    },
    {
      id: '4',
      name: 'Language Exchange Group',
      lastMessage: 'Welcome to our weekly practice session!',
      timestamp: '1 day ago',
      unread: 5
    }
  ])

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

  // Simple authentication check
  useEffect(() => {
    console.log('Main layout auth check running...')
    
    const savedUser = localStorage.getItem('anytongue_user')
    const isLoggedIn = localStorage.getItem('anytongue_isLoggedIn')
    const token = localStorage.getItem('anytongue_token')
    
    console.log('Auth check values:', {
      savedUser,
      isLoggedIn,
      token,
      pathname: window.location.pathname
    })
    
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null' && isLoggedIn === 'true') {
      try {
        const userData = JSON.parse(savedUser)
        console.log('Parsed user data:', userData)
        setUser(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        console.log('Clearing invalid auth data and redirecting to login')
        localStorage.removeItem('anytongue_user')
        localStorage.removeItem('anytongue_isLoggedIn')
        localStorage.removeItem('anytongue_token')
        router.replace('/login')
      }
    } else {
      console.log('No valid auth data found, redirecting to login')
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
    user,
    setUser
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
