'use client'

export default function MessageBubble({ message }) {
  const { sender, text, timestamp, isOwn, isSending, isError, translations, originalText, isTranslated } = message

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-2 sm:px-0`}>
      <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg ${
        isError
          ? 'bg-destructive text-destructive-foreground'
          : isOwn 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-black dark:text-gray-200'
      } ${isSending ? 'opacity-70' : ''}`}>
        <div className="flex items-center space-x-2">
          <p className="text-base">{text}</p>
          {isSending && (
            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
          )}
        </div>
        
        {/* Show original text if message is translated */}
        {isTranslated && originalText && originalText !== text && (
          <div>
            <p className={`text-sm opacity-50 italic ${
              isOwn ? '' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {originalText}
            </p>
          </div>
        )}
        
        <p className={`text-xs mt-1 ${
          isError
            ? 'text-destructive-foreground/70'
            : isOwn 
              ? 'text-primary-foreground/70' 
              : 'text-gray-600 dark:text-gray-400'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  )
}
