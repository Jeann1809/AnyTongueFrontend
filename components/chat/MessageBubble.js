'use client'

export default function MessageBubble({ message }) {
  const { sender, text, timestamp, isOwn, isSending, isError, translations, originalText, isTranslated } = message

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
        
        {/* Show original text if message is translated */}
        {isTranslated && originalText && originalText !== text && (
          <div>
            <p className="text-xs opacity-50 italic">
              {originalText}
            </p>
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
