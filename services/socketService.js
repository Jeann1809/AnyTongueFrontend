import { io } from 'socket.io-client'
import { getCurrentToken } from '@/lib/api'

class SocketService {
  constructor() {
    this.socket = null
    this.listeners = new Map()
  }

  connect() {
    if (this.socket?.connected) return this.socket

    const token = getCurrentToken()
    if (!token) {
      console.error('No authentication token available for socket connection')
      return null
    }

    this.socket = io('http://localhost:8080', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO server')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason)
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error)
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
      console.log(`Joined chat room: ${chatId}`)
    }
  }

  leaveChat(chatId) {
    if (this.socket?.connected) {
      this.socket.emit('leave-chat', { chatId })
      console.log(`Left chat room: ${chatId}`)
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      const listener = (message) => {
        console.log('Received new message:', message)
        callback(message)
      }
      
      this.socket.on('new-message', listener)
      this.listeners.set('new-message', listener)
    }
  }

  offNewMessage() {
    if (this.socket && this.listeners.has('new-message')) {
      const listener = this.listeners.get('new-message')
      this.socket.off('new-message', listener)
      this.listeners.delete('new-message')
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
