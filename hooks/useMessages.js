'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import socketService from '@/services/socketService'
import messageService from '@/services/messageService'

export const useMessages = (chatId) => {
  const { user } = useChatContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [sending, setSending] = useState(false)
  
  // messagesEndRef removed - no auto-scrolling
  const isLoadingMoreRef = useRef(false)

  // Scroll function removed - no auto-scrolling

  // Load initial messages
  const loadMessages = useCallback(async (currentChatId, showLoading = true) => {
    console.log('loadMessages called with chatId:', currentChatId, 'showLoading:', showLoading)
    if (!currentChatId) {
      console.log('loadMessages: no chatId provided')
      return
    }

    if (showLoading) {
      console.log('loadMessages: setting loading to true')
      setLoading(true)
    }
    setError(null)

    try {
      console.log('loadMessages: calling messageService.getMessages')
      const result = await messageService.getMessages(currentChatId)
      console.log('loadMessages: result received:', result)
      
      if (result.success) {
        const transformedMessages = result.messages.map(msg => 
          messageService.transformMessage(msg, user?.id)
        )
        console.log('loadMessages: transformed messages:', transformedMessages)
        setMessages(transformedMessages)
        setHasMore(result.hasMore)
      } else {
        console.log('loadMessages: result not successful:', result.error)
        setError(result.error)
      }
    } catch (err) {
      console.error('loadMessages: error occurred:', err)
      setError('Failed to load messages')
    } finally {
      if (showLoading) {
        console.log('loadMessages: setting loading to false')
        setLoading(false)
      }
    }
  }, [user?.id])

  // Load more messages for pagination
  const loadMoreMessages = useCallback(async () => {
    if (!chatId || !hasMore || isLoadingMoreRef.current) return

    isLoadingMoreRef.current = true

    try {
      const result = await messageService.getMessages(chatId, Math.ceil(messages.length / 50) + 1, 50)
      
      if (result.success && result.messages.length > 0) {
        const transformedMessages = result.messages.map(msg => 
          messageService.transformMessage(msg, user?.id)
        )
        
        // Prepend older messages to the beginning
        setMessages(prev => [...transformedMessages, ...prev])
        setHasMore(result.hasMore)
      }
    } catch (err) {
      console.error('Error loading more messages:', err)
    } finally {
      isLoadingMoreRef.current = false
    }
  }, [chatId, hasMore, messages.length, user?.id])

  // Send a new message
  const sendMessage = useCallback(async (text) => {
    if (!chatId || !text.trim() || sending) return

    setSending(true)
    setError(null)

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      sender: user?.username || 'You',
      senderId: user?.id,
      text: text.trim(),
      translations: {},
      timestamp: 'now',
      createdAt: new Date().toISOString(),
      isOwn: true,
      isSending: true
    }

    setMessages(prev => [...prev, tempMessage])
    scrollToBottom()

    try {
      const result = await messageService.sendMessage(chatId, text.trim())
      
      if (result.success) {
        // Replace temp message with real message
        const realMessage = messageService.transformMessage(result.message, user?.id)
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? realMessage : msg
          )
        )
      } else {
        // Remove temp message and show error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
        setError(result.error)
      }
    } catch (err) {
      // Remove temp message and show error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
      setError('Failed to send message')
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }, [chatId, user?.id, user?.username, sending])

  // Handle new message from socket
  const handleNewMessage = useCallback((messageData) => {
    const transformedMessage = messageService.transformMessage(messageData, user?.id)
    
    setMessages(prev => {
      // Check if message already exists (avoid duplicates)
      const exists = prev.some(msg => msg.id === transformedMessage.id)
      if (exists) return prev
      
      return [...prev, transformedMessage]
    })
  }, [user?.id])

  // Load messages when chatId changes
  useEffect(() => {
    console.log('useMessages: chatId changed to:', chatId)
    if (chatId) {
      console.log('useMessages: loading messages for chat:', chatId)
      loadMessages(chatId, true) // Show loading on initial load
    }
  }, [chatId, loadMessages])

  // Auto-reload messages every second
  useEffect(() => {
    if (!chatId) return

    console.log('useMessages: setting up auto-reload for chat:', chatId)
    
    // Set up interval to reload messages every second without showing loading
    const intervalId = setInterval(() => {
      console.log('useMessages: auto-reloading messages for chat:', chatId)
      loadMessages(chatId, false) // Don't show loading for auto-reload
    }, 1000) // Reload every 1000ms (1 second)

    // Cleanup interval when component unmounts or chatId changes
    return () => {
      console.log('useMessages: clearing auto-reload interval for chat:', chatId)
      clearInterval(intervalId)
    }
  }, [chatId, loadMessages])

  // Socket connection management (temporarily disabled for debugging)
  // useEffect(() => {
  //   if (!chatId) return

  //   // Connect to socket
  //   const socket = socketService.connect()
  //   if (!socket) return

  //   // Join chat room
  //   socketService.joinChat(chatId)

  //   // Listen for new messages
  //   socketService.onNewMessage(handleNewMessage)

  //   return () => {
  //     socketService.leaveChat(chatId)
  //     socketService.offNewMessage()
  //   }
  // }, [chatId, handleNewMessage])

  // // Cleanup socket connection when component unmounts
  // useEffect(() => {
  //   return () => {
  //     socketService.disconnect()
  //   }
  // }, [])

  return {
    messages,
    loading,
    error,
    hasMore,
    sending,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    setError
  }
}
