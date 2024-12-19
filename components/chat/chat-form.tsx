'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, Send } from 'lucide-react'

export default function ChatForm() {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg w-full max-w-3xl mx-auto">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 border-none bg-transparent"
      />
      <Button size="icon" variant="ghost" type="button" className="rounded-full">
        <Mic className="h-5 w-5" />
        <span className="sr-only">Start recording</span>
      </Button>
      <Button size="icon" type="submit" disabled={!message} className="rounded-full">
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}