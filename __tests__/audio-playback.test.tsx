import { render, fireEvent } from '@testing-library/react'
import { renderWithStore } from './utils/test-utils'
import { AudioPlayer } from '@/components/audio/audio-player'

describe('AudioPlayer', () => {
  const mockSrc = 'test-audio.mp3'

  it('renders audio controls', () => {
    const { getByRole } = renderWithStore(<AudioPlayer src={mockSrc} />)
    expect(getByRole('button', { name: /play/i })).toBeInTheDocument()
  })

  it('toggles play/pause', () => {
    const { getByRole } = renderWithStore(<AudioPlayer src={mockSrc} />)
    const playButton = getByRole('button', { name: /play/i })
    
    fireEvent.click(playButton)
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled()
    
    const pauseButton = getByRole('button', { name: /pause/i })
    fireEvent.click(pauseButton)
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })
}) 