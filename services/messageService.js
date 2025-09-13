import { chatAPI } from '@/lib/api'

class MessageService {
  async getMessages(chatId, page = 1, limit = 50) {
    try {
      const response = await chatAPI.getMessages(chatId)
      
      if (response.success && response.data) {
        return {
          success: true,
          messages: response.data,
          hasMore: response.data.length === limit
        }
      }
      
      return {
        success: false,
        messages: [],
        hasMore: false,
        error: 'Failed to load messages'
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      return {
        success: false,
        messages: [],
        hasMore: false,
        error: error.message
      }
    }
  }

  async sendMessage(chatId, originalText) {
    try {
      const response = await chatAPI.sendMessage({
        chatId,
        text: originalText,
        messageType: 'text'
      })

      if (response.success && response.data) {
        return {
          success: true,
          message: response.data
        }
      }

      return {
        success: false,
        error: 'Failed to send message'
      }
    } catch (error) {
      console.error('Error sending message:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  transformMessage(messageData, currentUserId) {
    return {
      id: messageData._id,
      sender: messageData.sender?.username || 'Unknown',
      senderId: messageData.sender?._id,
      text: messageData.originalText,
      translations: messageData.translations || {},
      timestamp: new Date(messageData.createdAt).toLocaleTimeString(),
      createdAt: messageData.createdAt,
      isOwn: messageData.sender?._id === currentUserId
    }
  }

  getDisplayText(message, userLanguage) {
    // If user's language translation exists, use it
    if (message.translations && message.translations[userLanguage]) {
      return {
        text: message.translations[userLanguage],
        isTranslated: true,
        originalText: message.text
      }
    }
    
    // Fall back to original text
    return {
      text: message.text,
      isTranslated: false,
      originalText: null
    }
  }
}

// Create a singleton instance
const messageService = new MessageService()

export default messageService
