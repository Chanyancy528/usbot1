import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useChatStore } from '@/lib/store/chat-store'

export function ErrorToast() {
  const { error, setError } = useChatStore()

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])

  if (!error) return null

  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
      <span>{error}</span>
      <button onClick={() => setError(null)} className="hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
} 