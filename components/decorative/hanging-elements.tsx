export function HangingElements({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <line x1="20" y1="0" x2="20" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="50" y1="0" x2="50" y2="60" stroke="currentColor" strokeWidth="1" />
      <line x1="80" y1="0" x2="80" y2="50" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="40" r="5" fill="currentColor" />
      <path d="M45 60 L50 55 L55 60 L50 65 Z" fill="currentColor" />
      <path d="M75 50 Q80 45, 85 50 Q80 55, 75 50" fill="currentColor" />
    </svg>
  )
} 