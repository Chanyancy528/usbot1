import { NextResponse } from 'next/server'
import { OpenAITranslateService } from '@/server/services/translation/openai-translate'

export async function POST(req: Request) {
  try {
    const { text, targetLanguage } = await req.json()
    
    // First detect the source language
    const sourceLanguage = await OpenAITranslateService.detectLanguage(text)
    
    // Only translate if target language is different
    if (sourceLanguage !== targetLanguage) {
      const translatedText = await OpenAITranslateService.translateText(text, targetLanguage)
      return NextResponse.json({ translatedText, sourceLanguage })
    }
    
    return NextResponse.json({ translatedText: text, sourceLanguage })
  } catch (error) {
    console.error('Translation API error:', error)
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    )
  }
} 