import { io } from 'socket.io-client'
import { getCurrentToken } from '@/lib/api'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
    this.messageCallbacks = new Set()
    this.globalListenerSet = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    // Clean up existing socket if it exists but isn't connected
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
    }

    this.socket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      timeout: 20000
    })

    // Set up connection event handlers
    this.socket.on('connect', () => {
      this.reconnectAttempts = 0
      this.globalListenerSet = false // Reset to allow re-registering listeners
      this.setupGlobalListener()
    })

    this.socket.on('disconnect', (reason) => {
      this.globalListenerSet = false
    })

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners()
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
      this.messageCallbacks.clear()
      this.globalListenerSet = false
      this.reconnectAttempts = 0
    }
  }

  joinChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('join-chat', { chatId })
    } else {
      // If not connected, queue the join for when connection is established
      this.socket?.on('connect', () => {
        this.socket.emit('join-chat', { chatId })
      })
    }
  }

  leaveChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-chat', { chatId })
    }
  }

  setupGlobalListener() {
    if (this.socket && !this.globalListenerSet) {
      this.socket.on('new-message', (message) => {
        this.messageCallbacks.forEach(cb => {
          try {
            cb(message)
          } catch (error) {
            console.error('Error in message callback:', error)
          }
        })
      })
      this.globalListenerSet = true
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.messageCallbacks.add(callback)
      this.setupGlobalListener()
    }
  }

  offNewMessage(callback = null) {
    if (callback) {
      this.messageCallbacks.delete(callback)
    } else {
      this.messageCallbacks.clear()
    }
  }

  isConnected() {
    return this.socket?.connected || false
  }

  getSocket() {
    return this.socket
  }

  // Force reconnection if needed
  reconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket.connect()
    }
  }

  // Get connection health status
  getConnectionStatus() {
    return {
      connected: this.isConnected(),
      reconnectAttempts: this.reconnectAttempts,
      hasCallbacks: this.messageCallbacks.size > 0
    }
  }
}

// Create a singleton instance
const socketService = new SocketService()

export default socketService
