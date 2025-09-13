'use client'

import { useState } from 'react'

export default function MessageBubble({ message }) {
  const { sender, text, timestamp, isOwn, isSending, isError, translations } = message
  const [showTranslations, setShowTranslations] = useState(false)

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isError
          ? 'bg-destructive text-destructive-foreground'
          : isOwn 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
      } ${isSending ? 'opacity-70' : ''}`}>
        {!isOwn && (
          <p className="text-xs font-medium mb-1 opacity-75">{sender}</p>
        )}
        <div className="flex items-center space-x-2">
          <p className="text-sm">{text}</p>
          {isSending && (
            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
          )}
        </div>
        
        {/* Show translations if available */}
        {translations && Object.keys(translations).length > 1 && (
          <div className="mt-2">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="text-xs underline opacity-75 hover:opacity-100"
            >
              {showTranslations ? 'Hide' : 'Show'} translations
            </button>
            {showTranslations && (
              <div className="mt-1 space-y-1">
                {Object.entries(translations).map(([lang, translation]) => (
                  translation !== text && (
                    <div key={lang} className="text-xs opacity-75 border-l-2 border-current pl-2">
                      <span className="font-medium">{lang}:</span> {translation}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>
        )}
        <p className={`text-xs mt-1 ${
          isError
            ? 'text-destructive-foreground/70'
            : isOwn 
              ? 'text-primary-foreground/70' 
              : 'text-muted-foreground/70'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  )
}
