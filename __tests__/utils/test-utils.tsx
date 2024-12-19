import { render } from '@testing-library/react'
import { useChatStore } from '@/lib/store/chat-store'

export function renderWithStore(ui: React.ReactElement) {
  return render(ui)
} 