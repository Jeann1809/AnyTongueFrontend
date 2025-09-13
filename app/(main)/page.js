'use client'

import { useChatContext } from './layout'
import ChatWindow from '@/components/chat/ChatWindow'
import AuthDebugger from '@/components/debug/AuthDebugger'

export default function ChatPage() {
  const { selectedChat } = useChatContext()

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-2xl">
          <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat to start messaging</h3>
          <p className="text-gray-500 mb-6">Choose a conversation from the sidebar to begin chatting</p>
          
          {/* Debug Component */}
          <div className="flex justify-center">
            <AuthDebugger />
          </div>
        </div>
      </div>
    )
  }

  return <ChatWindow />
}
