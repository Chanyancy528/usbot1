import { NextResponse } from 'next/server'
import { WhisperSpeechService } from '@/server/services/speech/whisper-speech'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer())
    
    const text = await WhisperSpeechService.speechToText(audioBuffer)
    
    return NextResponse.json({ text })
  } catch (error) {
    console.error('Speech recognition error:', error)
    return NextResponse.json(
      { error: 'Speech recognition failed' },
      { status: 500 }
    )
  }
} 