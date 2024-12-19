import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause } from 'lucide-react'

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio] = useState(new Audio(src))

  const togglePlayback = () => {
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={togglePlayback}
      aria-label={isPlaying ? 'pause' : 'play'}
    >
      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  )
} 