'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useChatContext } from '@/app/(main)/layout'
import socketService from '@/services/socketService'
import messageService from '@/services/messageService'

export const useMessages = (chatId) => {
  const { user, updateChatWithNewMessage, markChatAsRead } = useChatContext()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [sending, setSending] = useState(false)
  
  const messagesEndRef = useRef(null)
  const isLoadingMoreRef = useRef(false)
  
  // Use refs to store the latest functions to avoid dependency issues
  const updateChatWithNewMessageRef = useRef(updateChatWithNewMessage)
  const markChatAsReadRef = useRef(markChatAsRead)
  const handleNewMessageRef = useRef()
  
  // Update refs when functions change
  useEffect(() => {
    updateChatWithNewMessageRef.current = updateChatWithNewMessage
    markChatAsReadRef.current = markChatAsRead
  }, [updateChatWithNewMessage, markChatAsRead])

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Load initial messages
  const loadMessages = useCallback(async (currentChatId, showLoading = true) => {
    if (!currentChatId) {
      return
    }

    if (showLoading) {
      setLoading(true)
    }
    setError(null)

    try {
      const result = await messageService.getMessages(currentChatId)
      
      if (result.success) {
        const transformedMessages = result.messages.map(msg => {
          const transformed = messageService.transformMessage(msg, user?.id)
          const displayInfo = messageService.getDisplayText({
            text: msg.originalText,
            translations: msg.translations
          }, user?.nativeLanguage || 'en')
          
          return {
            ...transformed,
            text: displayInfo.text,
            originalText: displayInfo.originalText,
            isTranslated: displayInfo.isTranslated
          }
        })
        setMessages(transformedMessages)
        setHasMore(result.hasMore)
        
        // Auto-scroll to bottom after messages are loaded (only on initial load)
        if (showLoading) {
          setTimeout(() => {
            scrollToBottom()
          }, 100)
        }
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load messages')
    } finally {
      if (showLoading) {
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
        const transformedMessages = result.messages.map(msg => {
          const transformed = messageService.transformMessage(msg, user?.id)
          const displayInfo = messageService.getDisplayText({
            text: msg.originalText,
            translations: msg.translations
          }, user?.nativeLanguage || 'en')
          
          return {
            ...transformed,
            text: displayInfo.text,
            originalText: displayInfo.originalText,
            isTranslated: displayInfo.isTranslated
          }
        })
        
        // Prepend older messages to the beginning
        setMessages(prev => [...transformedMessages, ...prev])
        setHasMore(result.hasMore)
      }
    } catch (err) {
      setError('Failed to load more messages')
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
    
    // Auto-scroll to bottom when sending a message
    setTimeout(() => {
      scrollToBottom()
    }, 50)

    try {
      const result = await messageService.sendMessage(chatId, text.trim())
      
      if (result.success) {
        // Replace temp message with real message
        const transformed = messageService.transformMessage(result.message, user?.id)
        const displayInfo = messageService.getDisplayText({
          text: result.message.originalText,
          translations: result.message.translations
        }, user?.nativeLanguage || 'en')
        
        const realMessage = {
          ...transformed,
          text: displayInfo.text,
          originalText: displayInfo.originalText,
          isTranslated: displayInfo.isTranslated
        }
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempMessage.id ? realMessage : msg
          )
        )
        
        // Update chat list with the sent message
        updateChatWithNewMessageRef.current(chatId, result.message)
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
    // Check if this message is for the current chat
    if (messageData.chat !== chatId) {
      return
    }
    
    // Ignore messages from the current user (they're already shown optimistically)
    if (messageData.sender && messageData.sender._id === user?.id) {
      return
    }
    
    // Transform the message using the message service
    const transformedMessage = messageService.transformMessage(messageData, user?.id)
    
    // Get display text with translation for the current user's language
    const displayInfo = messageService.getDisplayText({
      text: messageData.originalText,
      translations: messageData.translations
    }, user?.nativeLanguage || 'en')
    
    // Update the message with translated text
    const messageWithTranslation = {
      ...transformedMessage,
      text: displayInfo.text,
      originalText: displayInfo.originalText,
      isTranslated: displayInfo.isTranslated
    }
    
    setMessages(prev => {
      // Check if message already exists (avoid duplicates)
      const exists = prev.some(msg => msg.id === messageWithTranslation.id)
      if (exists) {
        return prev
      }
      
      // Update chat list with new message info
      updateChatWithNewMessageRef.current(chatId, messageData)
      
      // Auto-scroll to bottom when receiving a new message
      setTimeout(() => {
        scrollToBottom()
      }, 50)
      
      return [...prev, messageWithTranslation]
    })
  }, [chatId, user?.id, user?.nativeLanguage, scrollToBottom])

  // Store the handleNewMessage function in ref to avoid dependency issues
  handleNewMessageRef.current = handleNewMessage

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      loadMessages(chatId, true)
      markChatAsReadRef.current(chatId)
    }
  }, [chatId])

  // Socket connection management for real-time messages
  useEffect(() => {
    if (!chatId) return

    const socket = socketService.connect()
    if (!socket) return

    // Wait for connection before joining chat
    const setupSocket = () => {
      if (socket.connected) {
        socketService.joinChat(chatId)
        socketService.onNewMessage(handleNewMessageRef.current)
      } else {
        // Wait for connection
        socket.on('connect', () => {
          socketService.joinChat(chatId)
          socketService.onNewMessage(handleNewMessageRef.current)
        })
      }
    }

    setupSocket()

    return () => {
      socketService.leaveChat(chatId)
      socketService.offNewMessage(handleNewMessageRef.current)
    }
  }, [chatId])


  return {
    messages,
    loading,
    error,
    hasMore,
    sending,
    messagesEndRef,
    loadMessages,
    loadMoreMessages,
    sendMessage,
    scrollToBottom,
    setError
  }
}
