import { NextResponse } from 'next/server'
import { AzureSpeechService } from '@/server/services/speech/azure-speech'

export async function POST(req: Request) {
  try {
    const { text } = await req.json()
    const audioData = await AzureSpeechService.textToSpeech(text)
    
    return new NextResponse(audioData, {
      headers: {
        'Content-Type': 'audio/wav',
      },
    })
  } catch (error) {
    console.error('Speech synthesis error:', error)
    return NextResponse.json(
      { error: 'Speech synthesis failed' },
      { status: 500 }
    )
  }
} 