class NotificationService {
  constructor() {
    this.permission = 'default'
    this.audioContext = null
    this.initAudio()
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    } catch (error) {
      console.warn('Audio context not supported:', error)
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    this.permission = await Notification.requestPermission()
    return this.permission === 'granted'
  }

  playSound() {
    if (!this.audioContext) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1)
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
      
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.3)
    } catch (error) {
      console.warn('Could not play notification sound:', error)
    }
  }

  showNotification(title, options = {}) {
    if (!('Notification' in window) || this.permission !== 'granted') {
      return false
    }

    const notification = new Notification(title, {
      icon: '/logo.png',
      badge: '/logo.png',
      ...options
    })

    notification.onclick = () => {
      window.focus()
      notification.close()
    }

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)

    return true
  }

  notifyNewMessage(message, chatName) {
    const settings = JSON.parse(localStorage.getItem('notifications') || '{}')
    
    if (!settings.newMessages) return

    if (settings.soundEnabled) {
      this.playSound()
    }

    if (settings.desktopNotifications) {
      this.requestPermission().then(granted => {
        if (granted) {
          this.showNotification(`New message in ${chatName}`, {
            body: message.text || 'New message',
            tag: `chat-${message.chatId}`
          })
        }
      })
    }
  }

  notifyChatUpdate(chatName, updateType) {
    const settings = JSON.parse(localStorage.getItem('notifications') || '{}')
    
    if (!settings.chatUpdates) return

    if (settings.soundEnabled) {
      this.playSound()
    }

    if (settings.desktopNotifications) {
      this.requestPermission().then(granted => {
        if (granted) {
          this.showNotification(`Chat Update: ${chatName}`, {
            body: `${updateType} in ${chatName}`,
            tag: `chat-update-${chatName}`
          })
        }
      })
    }
  }

  notifySystemAlert(title, message) {
    const settings = JSON.parse(localStorage.getItem('notifications') || '{}')
    
    if (!settings.systemAlerts) return

    if (settings.soundEnabled) {
      this.playSound()
    }

    if (settings.desktopNotifications) {
      this.requestPermission().then(granted => {
        if (granted) {
          this.showNotification(title, {
            body: message,
            tag: 'system-alert'
          })
        }
      })
    }
  }
}

const notificationService = new NotificationService()
export default notificationService
