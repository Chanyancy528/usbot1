import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function authMiddleware(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key')
  
  if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }
} 