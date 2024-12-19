import { render, fireEvent, waitFor } from '@testing-library/react'
import { renderWithStore } from './utils/test-utils'
import ChatInterface from '@/components/chat/chat-interface'

// Mock the chat store
jest.mock('@/lib/store/chat-store')

describe('Chat Interface', () => {
  it('allows sending a message', async () => {
    const { getByPlaceholderText, getByRole } = renderWithStore(<ChatInterface />)
    
    // Find and type in the input
    const input = getByPlaceholderText(/type your message/i)
    fireEvent.change(input, { target: { value: 'Hello' } })

    // Click send button
    const sendButton = getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)

    // Verify input is cleared
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })
}) 