// Utility functions for logging data that would be sent to backend

export const logUserRegistration = (userData) => {
  console.log('🚀 BACKEND API CALL: User Registration')
  console.log('POST /api/auth/register')
  console.log('Request Body:', {
    username: userData.username,
    password: userData.password, // In real app, this would be hashed
    displayName: userData.displayName,
    nativeLanguage: userData.nativeLanguage,
    createdAt: new Date().toISOString()
  })
  console.log('---')
}

export const logUserLogin = (userData) => {
  console.log('🔐 BACKEND API CALL: User Login')
  console.log('POST /api/auth/login')
  console.log('Request Body:', {
    username: userData.username,
    password: userData.password // In real app, this would be hashed
  })
  console.log('Response:', {
    success: true,
    user: {
      id: 'user_' + Date.now(),
      username: userData.username,
      displayName: userData.displayName,
      nativeLanguage: userData.nativeLanguage,
      token: 'jwt_token_' + Math.random().toString(36).substr(2, 9)
    }
  })
  console.log('---')
}

export const logProfileUpdate = (userData) => {
  console.log('👤 BACKEND API CALL: Profile Update')
  console.log('PUT /api/user/profile')
  console.log('Request Body:', {
    displayName: userData.displayName,
    nativeLanguage: userData.nativeLanguage,
    updatedAt: new Date().toISOString()
  })
  console.log('Headers:', {
    'Authorization': 'Bearer jwt_token_xyz123',
    'Content-Type': 'application/json'
  })
  console.log('---')
}

export const logMessageSend = (messageData) => {
  console.log('💬 BACKEND API CALL: Send Message')
  console.log('POST /api/messages')
  console.log('Request Body:', {
    chatId: messageData.chatId,
    senderId: messageData.senderId,
    text: messageData.text,
    timestamp: new Date().toISOString(),
    messageType: 'text'
  })
  console.log('Headers:', {
    'Authorization': 'Bearer jwt_token_xyz123',
    'Content-Type': 'application/json'
  })
  console.log('---')
}

export const logSocketConnection = () => {
  console.log('🔌 BACKEND WEBSOCKET: Connection')
  console.log('Socket.IO Connection Established')
  console.log('Server URL: ws://localhost:8080')
  console.log('Events to listen for:', [
    'connect',
    'disconnect', 
    'newMessage',
    'userJoined',
    'userLeft',
    'typing',
    'stopTyping'
  ])
  console.log('Events to emit:', [
    'joinChat',
    'leaveChat',
    'sendMessage',
    'startTyping',
    'stopTyping'
  ])
  console.log('---')
}
