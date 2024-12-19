import { render, fireEvent, waitFor } from '@testing-library/react'
import { renderWithStore } from './utils/test-utils'
import ChatInterface from '@/components/chat/chat-interface'

describe('Chat Interface', () => {
  it('sends a message', async () => {
    const { getByPlaceholderText, getByRole } = renderWithStore(<ChatInterface />)
    
    // Type a message
    const input = getByPlaceholderText(/type your message/i)
    fireEvent.change(input, { target: { value: 'Hello' } })
    
    // Send the message
    const sendButton = getByRole('button', { name: /send/i })
    fireEvent.click(sendButton)

    // Check if input is cleared after sending
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })
}) 