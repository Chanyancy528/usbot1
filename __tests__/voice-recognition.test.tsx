import { render, act } from '@testing-library/react'
import { renderWithStore } from './utils/test-utils'
import ChatInterface from '@/components/chat/chat-interface'

describe('Voice Recognition', () => {
  it('toggles voice recognition', async () => {
    const { getByRole } = renderWithStore(<ChatInterface />)
    const micButton = getByRole('button', { name: /microphone/i })

    await act(async () => {
      micButton.click()
    })

    expect(global.SpeechRecognition).toHaveBeenCalled()
  })

  it('handles speech recognition results', async () => {
    const mockAddMessage = jest.fn()
    const { getByRole } = renderWithStore(<ChatInterface />, {
      addMessage: mockAddMessage
    })

    const micButton = getByRole('button', { name: /microphone/i })
    await act(async () => {
      micButton.click()
    })

    // Simulate speech recognition result
    const mockRecognition = (global.SpeechRecognition as jest.Mock).mock.results[0].value
    const transcript = 'Hello, this is a test'
    
    await act(async () => {
      mockRecognition.onresult({
        results: [[{ transcript }]]
      })
    })

    expect(mockAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        content: transcript
      })
    )
  })
}) 