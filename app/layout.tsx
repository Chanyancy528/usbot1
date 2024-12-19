import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sheldon AI Assistant',
  description: 'AI Assistant Interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 