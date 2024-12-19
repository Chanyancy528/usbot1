export function ShootingStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 50" className={className}>
      <path
        d="M10 25 Q 30 25, 90 5"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="90" cy="5" r="4" fill="currentColor" />
      <circle cx="30" cy="25" r="1" fill="currentColor" />
      <circle cx="50" cy="20" r="1" fill="currentColor" />
      <circle cx="70" cy="12" r="1" fill="currentColor" />
    </svg>
  )
}