import { NextResponse } from 'next/server'
import { ImageService } from '@/server/services/image/image-service'
import { retry } from '@/lib/utils/retry'

export async function POST(req: Request) {
  try {
    const { prompt, ...options } = await req.json()
    
    const imageUrl = await retry(
      async () => await ImageService.generateImage({ prompt, ...options }),
      {
        retries: 3,
        delay: 1000,
        onRetry: (error, attempt) => {
          console.warn(`Retry attempt ${attempt} due to:`, error)
        }
      }
    )

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { 
        error: 'Image generation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 