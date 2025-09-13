// API service layer for backend communication

const API_BASE_URL = 'http://localhost:8080/api' // Backend running on port 8080

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('anytongue_token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    const requestData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      nativeLanguage: userData.nativeLanguage
    }
    
    console.log('Registration request data:', requestData)
    
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(requestData)
    })
    
    if (!response.ok) {
      let errorMessage = `Registration failed: ${response.statusText} (${response.status})`
      try {
        const errorData = await response.json()
        console.error('Registration error details:', errorData)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch (e) {
        console.error('Could not parse error response:', e)
        console.error('Response status:', response.status)
        console.error('Response statusText:', response.statusText)
      }
      throw new Error(errorMessage)
    }
    
    return response.json()
  },

  // Login user
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      })
    })
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Store token for future requests
    if (data.token) {
      localStorage.setItem('anytongue_token', data.token)
    }
    
    return data
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    
    // Clear local storage regardless of response
    localStorage.removeItem('anytongue_token')
    localStorage.removeItem('anytongue_user')
    localStorage.removeItem('anytongue_isLoggedIn')
    
    return response.ok
  }
}

// User API calls
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get profile: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        username: profileData.username,
        email: profileData.email,
        nativeLanguage: profileData.nativeLanguage
      })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to update profile: ${response.statusText}`)
    }
    
    return response.json()
  }
}

// Chat API calls
export const chatAPI = {
  // Get all chats for user
  getChats: async () => {
    const response = await fetch(`${API_BASE_URL}/chats`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get chats: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get messages for a specific chat
  getMessages: async (chatId) => {
    const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
      method: 'GET',
      headers: getAuthHeaders()
    })
    
    if (!response.ok) {
      throw new Error(`Failed to get messages: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Send a message
  sendMessage: async (messageData) => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        chatId: messageData.chatId,
        text: messageData.text,
        messageType: 'text'
      })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`)
    }
    
    return response.json()
  }
}
