import { io } from 'socket.io-client'
import { getCurrentToken } from '@/lib/api'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
    this.messageCallbacks = new Set()
    this.globalListenerSet = false
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      autoConnect: true
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.listeners.clear()
    }
  }

  joinChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('join-chat', { chatId })
    }
  }

  leaveChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-chat', { chatId })
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.messageCallbacks.add(callback)
      
      if (!this.globalListenerSet) {
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
}

// Create a singleton instance
const socketService = new SocketService()

export default socketService
