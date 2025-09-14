'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    notifications: {
      newMessages: true,
      chatUpdates: true,
      systemAlerts: true,
      soundEnabled: true,
      desktopNotifications: false
    },
    privacy: {
      showOnlineStatus: true,
      allowDirectMessages: true,
      showLastSeen: true,
      dataCollection: false
    },
    appearance: {
      theme: 'system',
      language: 'en',
      fontSize: 'medium',
      compactMode: false
    },
    chatPrefs: {
      autoTranslate: false,
      showTimestamps: true,
      showReadReceipts: true,
      enterToSend: true
    }
  })

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedNotifications = localStorage.getItem('notifications')
      const savedPrivacy = localStorage.getItem('privacy')
      const savedAppearance = localStorage.getItem('appearance')
      const savedChatPrefs = localStorage.getItem('chatPrefs')

      setSettings(prev => ({
        ...prev,
        notifications: savedNotifications ? JSON.parse(savedNotifications) : prev.notifications,
        privacy: savedPrivacy ? JSON.parse(savedPrivacy) : prev.privacy,
        appearance: savedAppearance ? JSON.parse(savedAppearance) : prev.appearance,
        chatPrefs: savedChatPrefs ? JSON.parse(savedChatPrefs) : prev.chatPrefs
      }))
    }

    loadSettings()
  }, [])

  // Apply theme changes
  useEffect(() => {
    const applyTheme = () => {
      const { theme } = settings.appearance
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
      }
    }

    applyTheme()
  }, [settings.appearance.theme])

  // Apply font size
  useEffect(() => {
    const { fontSize } = settings.appearance
    const root = document.documentElement
    
    switch (fontSize) {
      case 'small':
        root.style.fontSize = '14px'
        break
      case 'medium':
        root.style.fontSize = '16px'
        break
      case 'large':
        root.style.fontSize = '18px'
        break
      default:
        root.style.fontSize = '16px'
    }
  }, [settings.appearance.fontSize])

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    }
    setSettings(newSettings)
    localStorage.setItem(category, JSON.stringify(newSettings[category]))
  }

  const getSetting = (category, key) => {
    return settings[category]?.[key]
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateSetting,
      getSetting
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
