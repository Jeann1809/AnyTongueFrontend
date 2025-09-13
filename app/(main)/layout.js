'use client'

import { useState, createContext, useContext, useEffect } from 'react'
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
  const [selectedChat, setSelectedChat] = useState(null)
  const [user, setUser] = useState(null)
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
    const savedUser = localStorage.getItem('anytongue_user')
    const isLoggedIn = localStorage.getItem('anytongue_isLoggedIn')
    
    if (savedUser && savedUser !== 'undefined' && savedUser !== 'null' && isLoggedIn === 'true') {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('anytongue_user')
        localStorage.removeItem('anytongue_isLoggedIn')
        window.location.href = '/login'
      }
    } else {
      window.location.href = '/login'
    }
  }, [])

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
