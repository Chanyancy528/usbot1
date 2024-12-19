export function StarBurst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <path
        d="M50 20 L55 45 L80 50 L55 55 L50 80 L45 55 L20 50 L45 45 Z"
        fill="currentColor"
      />
      <circle cx="30" cy="30" r="2" fill="currentColor" />
      <circle cx="70" cy="70" r="2" fill="currentColor" />
      <circle cx="75" cy="25" r="2" fill="currentColor" />
      <circle cx="25" cy="75" r="2" fill="currentColor" />
    </svg>
  )
} 