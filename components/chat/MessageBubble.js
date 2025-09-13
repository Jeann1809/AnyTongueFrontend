'use client'

export default function MessageBubble({ message }) {
  const { sender, text, timestamp, isOwn } = message

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isOwn 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-muted-foreground'
      }`}>
        {!isOwn && (
          <p className="text-xs font-medium mb-1 opacity-75">{sender}</p>
        )}
        <p className="text-sm">{text}</p>
        <p className={`text-xs mt-1 ${
          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground/70'
        }`}>
          {timestamp}
        </p>
      </div>
    </div>
  )
}
