'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mic, Send } from 'lucide-react'
import { useChatStore } from '@/lib/store/chat-store'

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const { addMessage, setLoading } = useChatStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setLoading('chat', true)
    addMessage({
      role: 'user',
      content: message
    })
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="button" size="icon" aria-label="microphone">
          <Mic className="h-4 w-4" />
        </Button>
        <Button type="submit" size="icon" aria-label="send">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}