interface PlaceholderProps {
  label: string
  className?: string
}

/** Clearly marked media placeholder — swap for real assets via data.ts. */
export default function Placeholder({ label, className = '' }: PlaceholderProps) {
  return (
    <div role="img" aria-label={`Placeholder for ${label}`} className={`placeholder-media ${className}`.trim()}>
      [{label}]
    </div>
  )
}
